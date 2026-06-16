import { api } from "@/shared/api";
import type { ProductoReadWithRelations, CategoriaRead } from "../types";

export const productService = {
  list: async (params?: { limit?: number; offset?: number; categoria_id?: number; disponible?: boolean; q?: string }) => {
    const { data } = await api.get("/productos/", { params });
    return data as { data: ProductoReadWithRelations[]; total: number };
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/productos/${id}`);
    return data as ProductoReadWithRelations;
  },

  getCategorias: async () => {
    const { data } = await api.get("/categorias/tree");
    return data as CategoriaRead[];
  },
};
