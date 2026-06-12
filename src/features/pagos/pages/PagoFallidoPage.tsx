import { useSearchParams, useNavigate } from "react-router-dom";

export function PagoFallidoPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const pedidoId = params.get("pedido_id")
    ? Number(params.get("pedido_id"))
    : params.get("external_reference")
    ? Number(params.get("external_reference"))
    : null;

  return (
    <div className="max-w-[600px] mx-auto px-margin-desktop py-2xl text-center">
      <div className="bg-surface-container-high rounded-2xl p-xl border border-outline-variant/30 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-red-500/20 mx-auto mb-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-red-400">
            cancel
          </span>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
          Pago Fallido
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
          El pago de tu pedido{" "}
          <span className="text-primary font-bold">
            #ORD-{String(pedidoId ?? "").padStart(4, "0")}
          </span>{" "}
          no pudo completarse.
        </p>

        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
          Podés intentarlo nuevamente desde la sección "Mis Pedidos".
        </p>

        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <button
            onClick={() => navigate("/mis-pedidos")}
            className="bg-primary text-on-primary px-xl py-lg rounded-lg font-headline-md font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            Ir a Mis Pedidos
          </button>
          <button
            onClick={() => navigate("/catalogo")}
            className="bg-surface-variant text-on-surface px-xl py-lg rounded-lg font-headline-md font-bold hover:bg-surface-container-highest transition-all border border-outline-variant/30"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
}
