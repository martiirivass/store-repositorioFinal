import { create } from "zustand";
import { persist } from "zustand/middleware";
import { pedidoService } from "./services/pedidoService";
import type { HistorialEstadoRead } from "./types";

interface OrderStatusStore {
  currentOrderId: number | null;
  status: string | null;
  statusHistory: HistorialEstadoRead[];
  isLoading: boolean;
  error: string | null;
  trackOrder: (orderId: number) => Promise<void>;
  refreshStatus: () => Promise<void>;
  resetTracking: () => void;
}

export const useOrderStatusStore = create<OrderStatusStore>()(
  persist(
    (set, get) => ({
      currentOrderId: null,
      status: null,
      statusHistory: [],
      isLoading: false,
      error: null,

      trackOrder: async (orderId: number) => {
        set({ isLoading: true, error: null });
        try {
          const pedido = await pedidoService.getById(orderId);
          set({
            currentOrderId: pedido.id,
            status: pedido.estado_codigo,
            statusHistory: pedido.historial_estados,
            isLoading: false,
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Error al obtener el pedido";
          set({ error: message, isLoading: false });
        }
      },

      refreshStatus: async () => {
        const { currentOrderId } = get();
        if (currentOrderId === null) return;

        set({ isLoading: true, error: null });
        try {
          const pedido = await pedidoService.getById(currentOrderId);
          set({
            status: pedido.estado_codigo,
            statusHistory: pedido.historial_estados,
            isLoading: false,
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Error al actualizar el estado";
          set({ error: message, isLoading: false });
        }
      },

      resetTracking: () => {
        set({
          currentOrderId: null,
          status: null,
          statusHistory: [],
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: "order-status-store",
      partialize: (state) => ({
        currentOrderId: state.currentOrderId,
        status: state.status,
      }),
    }
  )
);
