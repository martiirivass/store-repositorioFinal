import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pedidoService } from "../services/pedidoService";

const QUERY_KEY = ["pedidos"];

export function useMisPedidos() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => pedidoService.listMine({ limit: 50, offset: 0 }),
  });
}

export function usePedido(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => pedidoService.getById(id),
    enabled: !!id,
  });
}

export function useCancelarPedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo?: string }) => pedidoService.cancel(id, motivo),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDirecciones() {
  return useQuery({
    queryKey: ["direcciones"],
    queryFn: () => pedidoService.getDirecciones(),
  });
}
