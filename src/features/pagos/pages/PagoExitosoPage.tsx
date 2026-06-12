import { useSearchParams, useNavigate } from "react-router-dom";
import { formatARS } from "@/shared/currency";
import { usePagoStatus } from "../hooks/usePagos";

export function PagoExitosoPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const pedidoId = params.get("pedido_id")
    ? Number(params.get("pedido_id"))
    : params.get("external_reference")
    ? Number(params.get("external_reference"))
    : null;

  const { data: pago, isLoading } = usePagoStatus(pedidoId);

  const estaAprobado = pago?.status === "approved";
  const estaRechazado = pago?.status === "rejected";

  return (
    <div className="max-w-[600px] mx-auto px-margin-desktop py-2xl text-center">
      <div className="bg-surface-container-high rounded-2xl p-xl border border-outline-variant/30 shadow-2xl">
        {isLoading || !pago ? (
          <>
            <div className="flex items-center justify-center mb-xl">
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
              Esperando confirmación del pago
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Completá el pago en la ventana de Mercado Pago que se abrió.
              Esta página se actualizará automáticamente.
            </p>
          </>
        ) : estaAprobado ? (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[48px] text-green-400">
                check_circle
              </span>
            </div>

            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
              ¡Pago Exitoso!
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
              Tu pedido{" "}
              <span className="text-primary font-bold">
                #ORD-{String(pedidoId ?? "").padStart(4, "0")}
              </span>{" "}
              fue pagado correctamente.
            </p>

            {pago.transaction_amount && (
              <div className="bg-surface-container rounded-lg p-lg mb-xl text-left space-y-md border border-outline-variant/20">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-body-md">
                    Método de pago
                  </span>
                  <span className="text-on-surface font-label-lg">
                    Mercado Pago
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant font-body-md">
                    Total pagado
                  </span>
                  <span className="text-primary font-headline-md font-bold">
                    {formatARS(pago.transaction_amount)}
                  </span>
                </div>
              </div>
            )}

            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
              Vas a poder seguir el estado de tu pedido en la sección "Mis Pedidos".
            </p>

            <div className="flex flex-col sm:flex-row gap-md justify-center">
              <button
                onClick={() => navigate("/mis-pedidos")}
                className="bg-primary text-on-primary px-xl py-lg rounded-lg font-headline-md font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
              >
                Ver Mis Pedidos
              </button>
              <button
                onClick={() => navigate("/catalogo")}
                className="bg-surface-variant text-on-surface px-xl py-lg rounded-lg font-headline-md font-bold hover:bg-surface-container-highest transition-all border border-outline-variant/30"
              >
                Seguir Comprando
              </button>
            </div>
          </>
        ) : estaRechazado ? (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/20 mx-auto mb-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[48px] text-red-400">
                cancel
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
              Pago rechazado
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
              El pago del pedido{" "}
              <span className="text-primary font-bold">
                #ORD-{String(pedidoId ?? "").padStart(4, "0")}
              </span>{" "}
              fue rechazado. Podés intentar de nuevo desde Mis Pedidos.
            </p>
            <button
              onClick={() => navigate("/mis-pedidos")}
              className="bg-primary text-on-primary px-xl py-lg rounded-lg font-headline-md font-bold hover:brightness-110 transition-all"
            >
              Ir a Mis Pedidos
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center mb-xl">
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
              Procesando pago...
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Estamos esperando la confirmación de Mercado Pago.
              Esto puede tomar unos segundos.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
