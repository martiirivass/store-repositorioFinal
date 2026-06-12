import { api } from "@/shared/api";
import type { PedidoReadWithDetalles, PedidoCreate, DireccionRead, DireccionCreate } from "../types";

export const pedidoService = {
  create: async (data: PedidoCreate) => {
    const res = await api.post("/pedidos/", data);
    return res.data as PedidoReadWithDetalles;
  },

  listMine: async (params?: { limit?: number; offset?: number }) => {
    const { data } = await api.get("/pedidos/", { params });
    return data as { data: PedidoReadWithDetalles[]; total: number };
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/pedidos/${id}`);
    return data as PedidoReadWithDetalles;
  },

  cancel: async (id: number) => {
    const { data } = await api.patch(`/pedidos/${id}/cancelar`);
    return data;
  },

  getDirecciones: async () => {
    const { data } = await api.get("/direcciones-entrega/");
    return data as DireccionRead[];
  },

  createDireccion: async (dir: DireccionCreate) => {
    const { data } = await api.post("/direcciones-entrega/", dir);
    return data as DireccionRead;
  },
};
