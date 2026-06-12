import { useMutation, useQuery } from "@tanstack/react-query";
import { pagoService } from "../services/pagoService";

export function useCrearPreferencia() {
  return useMutation({
    mutationFn: (pedido_id: number) =>
      pagoService.crearPreferencia({ pedido_id }),
  });
}

export function usePagoStatus(pedidoId: number | null) {
  return useQuery({
    queryKey: ["pago-status", pedidoId],
    queryFn: () => pagoService.getPagoStatus(pedidoId!),
    enabled: !!pedidoId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "approved" || data?.status === "rejected") {
        return false;
      }
      return 5000;
    },
  });
}
