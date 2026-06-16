import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export function useProductos(params?: { limit?: number; offset?: number; categoria_id?: number; q?: string }) {
  return useQuery({
    queryKey: ["productos", params],
    queryFn: () => productService.list({ ...params, disponible: true }),
  });
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: ["producto", id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useCategorias() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: () => productService.getCategorias(),
  });
}
