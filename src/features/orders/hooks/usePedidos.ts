import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pedidoService } from "../services/pedidoService";
import type { DireccionCreate, DireccionUpdate } from "../types";

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

const DIRECCIONES_KEY = ["direcciones"];

export function useDirecciones() {
  return useQuery({
    queryKey: DIRECCIONES_KEY,
    queryFn: () => pedidoService.getDirecciones(),
  });
}

export function useCrearDireccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DireccionCreate) => pedidoService.createDireccion(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: DIRECCIONES_KEY }),
  });
}

export function useActualizarDireccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DireccionUpdate }) =>
      pedidoService.updateDireccion(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: DIRECCIONES_KEY }),
  });
}

export function useEliminarDireccion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pedidoService.deleteDireccion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DIRECCIONES_KEY }),
  });
}

export function useMarcarPrincipal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pedidoService.marcarPrincipal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DIRECCIONES_KEY }),
  });
}
