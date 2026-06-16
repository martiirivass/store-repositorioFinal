import { api } from "@/shared/api";

export interface CrearPreferenciaRequest {
  pedido_id: number;
}

export interface CrearPreferenciaResponse {
  preference_id: string;
  init_point: string;
  pedido_id: number;
}

export interface PagoStatusResponse {
  pedido_id: number;
  payment_id: number | null;
  status: string | null;
  transaction_amount: number | null;
}

export const pagoService = {
  crearPreferencia: async (data: CrearPreferenciaRequest) => {
    const res = await api.post("/pagos/crear-preferencia", data);
    return res.data as CrearPreferenciaResponse;
  },

  getPagoStatus: async (pedidoId: number) => {
    const res = await api.get(`/pagos/${pedidoId}`);
    return res.data as PagoStatusResponse;
  },
};
