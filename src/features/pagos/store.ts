import { create } from "zustand";
import { persist } from "zustand/middleware";
import { pagoService } from "./services/pagoService";

type PaymentStatus = "pending" | "approved" | "rejected" | "in_progress";

interface PaymentStore {
  paymentId: number | null;
  status: PaymentStatus | null;
  paymentUrl: string | null;
  isLoading: boolean;
  error: string | null;
  createPayment: (orderId: number) => Promise<void>;
  checkPayment: (paymentId: number) => Promise<void>;
  resetPayment: () => void;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      paymentId: null,
      status: null,
      paymentUrl: null,
      isLoading: false,
      error: null,

      createPayment: async (orderId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await pagoService.crearPreferencia({
            pedido_id: orderId,
          });
          set({
            paymentId: orderId,
            status: "pending",
            paymentUrl: response.init_point,
            isLoading: false,
          });
        } catch (err: any) {
          const detail = err?.response?.data?.detail;
          const message = Array.isArray(detail)
            ? detail.map((d: any) => d.msg).join("; ")
            : detail || "Error al crear el pago";
          set({ error: message, isLoading: false });
        }
      },

      checkPayment: async (paymentId: number) => {
        set({ isLoading: true, error: null });
        try {
          const response = await pagoService.getPagoStatus(paymentId);
          set({
            status: (response.status as PaymentStatus) ?? null,
            paymentId: response.pedido_id,
            isLoading: false,
          });
        } catch (err: any) {
          const detail = err?.response?.data?.detail;
          const message = Array.isArray(detail)
            ? detail.map((d: any) => d.msg).join("; ")
            : detail || "Error al verificar el pago";
          set({ error: message, isLoading: false });
        }
      },

      resetPayment: () => {
        set({
          paymentId: null,
          status: null,
          paymentUrl: null,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: "payment-store",
      partialize: (state) => ({
        paymentId: state.paymentId,
        status: state.status,
      }),
    }
  )
);
