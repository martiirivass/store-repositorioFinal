import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
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
        } catch (err: unknown) {
          const detail = axios.isAxiosError(err) ? (err.response?.data as Record<string, unknown> | undefined)?.detail : undefined;
          const message = Array.isArray(detail)
            ? detail.map((d) => String(d && typeof d === "object" && "msg" in d ? d.msg : "")).join("; ")
            : typeof detail === "string" ? detail : "Error al crear el pago";
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
        } catch (err: unknown) {
          const detail = axios.isAxiosError(err) ? (err.response?.data as Record<string, unknown> | undefined)?.detail : undefined;
          const message = Array.isArray(detail)
            ? detail.map((d) => String(d && typeof d === "object" && "msg" in d ? d.msg : "")).join("; ")
            : typeof detail === "string" ? detail : "Error al verificar el pago";
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
