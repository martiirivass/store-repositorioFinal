import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCrearPreferencia } from "../hooks/usePagos";

export function PaymentPage() {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const navigate = useNavigate();
  const { mutateAsync: crearPreferencia, isPending } = useCrearPreferencia();
  const redirected = useRef(false);

  useEffect(() => {
    if (!pedidoId) {
      navigate("/", { replace: true });
      return;
    }

    if (redirected.current) return;
    redirected.current = true;

    const redirectToMP = async () => {
      try {
        const response = await crearPreferencia(Number(pedidoId));

        if (response.init_point) {
          window.open(response.init_point, "_blank");
          navigate(`/pago-exitoso?pedido_id=${pedidoId}`, { replace: true });
        }
      } catch (err: any) {
        const detail =
          err?.response?.data?.detail || "Error al crear la preferencia";
        navigate(`/pago-fallido?pedido_id=${pedidoId}`, {
          replace: true,
          state: { error: detail },
        });
      }
    };

    redirectToMP();
  }, [pedidoId, crearPreferencia, navigate]);

  return (
    <div className="max-w-[600px] mx-auto px-margin-desktop py-2xl text-center">
      <div className="bg-surface-container-high rounded-2xl p-xl border border-outline-variant/30 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-primary">
            payments
          </span>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
          Redirigiendo a Mercado Pago
        </h1>

        <div className="flex items-center justify-center gap-md mb-xl">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-body-md text-body-md text-on-surface-variant">
            {isPending
              ? "Preparando tu pago..."
              : "Conectando con Mercado Pago..."}
          </span>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant">
          Serás redirigido automáticamente al sitio seguro de Mercado Pago para
          completar el pago.
        </p>
      </div>
    </div>
  );
}
