import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWsStore } from "@/store/wsStore";

function getWsBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return apiUrl.replace(/\/api\/v1\/?$/, "").replace(/^http/, "ws");
}

/**
 * Connects to the WebSocket feed for a specific order.
 * When `pedidoId` is null/undefined, no connection is established
 * (the badge will show "Sin conexión").
 */
export function useOrderStatusWS(pedidoId?: number | null) {
  const queryClient = useQueryClient();
  const lastMessage = useWsStore((s) => s.lastMessage);
  const connect = useWsStore((s) => s.connect);
  const disconnect = useWsStore((s) => s.disconnect);

  // ── Connect to order-specific WS feed ───────────────────────────────
  useEffect(() => {
    if (!pedidoId) return;

    const wsUrl = `${getWsBaseUrl()}/ws/pedidos/${pedidoId}`;
    connect(wsUrl);

    return () => {
      disconnect();
    };
  }, [pedidoId, connect, disconnect]);

  // ── Invalidate queries when an event arrives ────────────────────────
  useEffect(() => {
    if (lastMessage?.event === "pedido_estado_changed") {
      // Invalidates ["pedidos"] (the full list — MyOrdersPage re-fetches)
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    }
  }, [lastMessage, queryClient]);

  return {
    connected: useWsStore((s) => s.connected),
    reconnectAttempts: useWsStore((s) => s.reconnectAttempts),
  };
}
