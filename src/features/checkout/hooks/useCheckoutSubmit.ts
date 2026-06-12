import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/features/cart/store";
import { checkoutService } from "@/features/checkout/services/checkoutService";
import type { CartItem } from "@/features/cart/store";

export interface SubmitParams {
  formaPago: string;
  selectedDir: number | null;
  items: CartItem[];
  referencia: string | null;
}

export interface SuccessData {
  pedidoId: number;
  total: number;
  formaPago: string;
}

export function useCheckoutSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  const handleSubmit = async (
    params: SubmitParams,
    onError: (msg: string) => void
  ) => {
    try {
      setIsSubmitting(true);

      const pedido = await checkoutService.crearPedido({
        forma_pago_codigo: params.formaPago,
        direccion_id: params.selectedDir,
        items: params.items.map((i) => ({
          producto_id: i.producto_id,
          cantidad: i.cantidad,
        })),
        referencia_pago: params.referencia,
      });

      if (params.formaPago === "MERCADOPAGO") {
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
      onError(err?.response?.data?.detail || "Error al crear el pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    showSuccess,
    successData,
    setShowSuccess,
    handleSubmit,
  };
}
