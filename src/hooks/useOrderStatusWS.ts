import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWsStore } from "@/store/wsStore";
import { useAuthStore } from "@/features/auth/store";

function getWsBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return apiUrl.replace(/\/api\/v1\/?$/, "").replace(/^http/, "ws");
}

/**
 * Connects to the WebSocket feed for a specific order.
 * When `pedidoId` is null/undefined, no connection is established
 * (the badge will show "Sin conexión").
 * On reconnect, automatically refetches pedidos data (resync).
 */
export function useOrderStatusWS(pedidoId?: number | null) {
  const queryClient = useQueryClient();
  const connected = useWsStore((s) => s.connected);
  const lastMessage = useWsStore((s) => s.lastMessage);
  const connect = useWsStore((s) => s.connect);
  const disconnect = useWsStore((s) => s.disconnect);
  const setAuthRefreshUrl = useWsStore((s) => s.setAuthRefreshUrl);

  // ── Configure auth refresh endpoint for WS token refresh ────────────
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    setAuthRefreshUrl(`${apiUrl}/api/v1/auth/refresh`);
  }, [setAuthRefreshUrl]);

  // ── Connect to order-specific WS feed ───────────────────────────────
  useEffect(() => {
    if (!pedidoId) return;

    const token = useAuthStore.getState().accessToken;
    const wsUrl = token
      ? `${getWsBaseUrl()}/ws/pedidos/${pedidoId}?token=${token}`
      : `${getWsBaseUrl()}/ws/pedidos/${pedidoId}`;
    connect(wsUrl);

    return () => {
      disconnect();
    };
  }, [pedidoId, connect, disconnect]);

  // ── Resync on reconnect: refetch when WS connection is established ──
  useEffect(() => {
    if (connected && pedidoId) {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    }
  }, [connected, pedidoId, queryClient]);

  // ── Invalidate queries when an event arrives ────────────────────────
  useEffect(() => {
    if (lastMessage?.event === "pedido_estado_changed") {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    }
  }, [lastMessage, queryClient]);

  return {
    connected,
    reconnectAttempts: useWsStore((s) => s.reconnectAttempts),
  };
}
