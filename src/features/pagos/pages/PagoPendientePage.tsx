import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePagoStatus } from "../hooks/usePagos";

export function PagoPendientePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const pedidoId = params.get("pedido_id")
    ? Number(params.get("pedido_id"))
    : params.get("external_reference")
    ? Number(params.get("external_reference"))
    : null;

  const { data: pago } = usePagoStatus(pedidoId);

  useEffect(() => {
    if (pago?.status === "approved") {
      navigate(`/pago-exitoso?pedido_id=${pedidoId}`, { replace: true });
    } else if (pago?.status === "rejected") {
      navigate(`/pago-fallido?pedido_id=${pedidoId}`, { replace: true });
    }
  }, [pago?.status, pedidoId, navigate]);

  return (
    <div className="max-w-[600px] mx-auto px-margin-desktop py-2xl text-center">
      <div className="bg-surface-container-high rounded-2xl p-xl border border-outline-variant/30 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-yellow-500/20 mx-auto mb-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-yellow-400">
            hourglass_top
          </span>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
          Pago Pendiente
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
          Tu pedido{" "}
          <span className="text-primary font-bold">
            #ORD-{String(pedidoId ?? "").padStart(4, "0")}
          </span>{" "}
          está esperando la confirmación del pago.
        </p>

        <div className="flex items-center justify-center gap-md mb-xl">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-body-md text-body-md text-on-surface-variant">
            Verificando pago...
          </span>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
          No cierres esta página. Apenas se confirme el pago, te redirigiremos
          automáticamente.
        </p>

        <button
          onClick={() => navigate("/catalogo")}
          className="bg-surface-variant text-on-surface px-xl py-lg rounded-lg font-headline-md font-bold hover:bg-surface-container-highest transition-all border border-outline-variant/30"
        >
          Ir al Catálogo
        </button>
      </div>
    </div>
  );
}
