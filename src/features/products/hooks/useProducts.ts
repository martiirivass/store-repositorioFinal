import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export function useProductos(params?: { limit?: number; offset?: number; categoria_id?: number; q?: string }) {
  return useQuery({
    queryKey: ["productos", params],
    queryFn: () => productService.list({ ...params, disponible: true }),
  });
}

export function useCategorias() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: () => productService.getCategorias(),
  });
}
