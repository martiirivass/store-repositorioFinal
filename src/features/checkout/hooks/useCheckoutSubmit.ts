import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/features/cart/store";
import { checkoutService } from "@/features/checkout/services/checkoutService";
import type { CartItem } from "@/features/cart/store";

export interface SubmitParams {
  formaPago: string;
  selectedDir: number | null;
  items: CartItem[];
  referencia: string | null;
  codigoDescuento?: string | null;
}

export interface SuccessData {
  pedidoId: number;
  total: number;
  formaPago: string;
}

export function useCheckoutSubmit() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (params: SubmitParams) =>
      checkoutService.crearPedido({
        forma_pago_codigo: params.formaPago,
        direccion_id: params.selectedDir,
        items: params.items.map((i) => ({
          producto_id: i.producto_id,
          cantidad: i.cantidad,
        })),
        referencia_pago: params.referencia,
        codigo_descuento: params.codigoDescuento || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });

  const handleSubmit = async (
    params: SubmitParams,
    onError: (msg: string) => void
  ) => {
    try {
      const pedido = await mutateAsync(params);

      if (params.formaPago === "MERCADOPAGO") {
        clearCart();
        navigate(`/pagar/${pedido.id}`);
        return;
      }

      clearCart();
      setSuccessData({
        pedidoId: pedido.id,
        total: pedido.total,
        formaPago: params.formaPago,
      });
      setShowSuccess(true);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d: any) => d.msg).join("; ")
        : detail || "Error al crear el pedido";
      onError(msg);
    }
  };

  return {
    isSubmitting: isPending,
    showSuccess,
    successData,
    setShowSuccess,
    handleSubmit,
  };
}
