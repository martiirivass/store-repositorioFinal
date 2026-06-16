import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pedidoService } from "../services/pedidoService";
import type { PedidoCreate } from "../types";

const QUERY_KEY = ["pedidos"];

export function useMisPedidos() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => pedidoService.listMine({ limit: 50, offset: 0 }),
  });
}

export function useCrearPedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PedidoCreate) => pedidoService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useCancelarPedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) => pedidoService.cancel(id, motivo),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDirecciones() {
  return useQuery({
    queryKey: ["direcciones"],
    queryFn: () => pedidoService.getDirecciones(),
  });
}
