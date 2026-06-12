import { api } from "@/shared/api";
import type { PedidoReadWithDetalles } from "@/features/orders/types";

export interface CrearPedidoData {
  forma_pago_codigo: string;
  direccion_id?: number | null;
  items: { producto_id: number; cantidad: number }[];
  referencia_pago?: string | null;
}

export const checkoutService = {
  crearPedido: async (data: CrearPedidoData) => {
    const { data: pedido } = await api.post("/pedidos/", data);
    return pedido as PedidoReadWithDetalles;
  },
};
