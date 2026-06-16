import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Wallet } from "@mercadopago/sdk-react";
import { useCrearPreferencia } from "../hooks/usePagos";
import { Spinner } from "@/shared/components/Skeleton";

export function PaymentPage() {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const navigate = useNavigate();
  const { mutateAsync: crearPreferencia, isPending } = useCrearPreferencia();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePagar = async () => {
    if (!pedidoId) return;
    setError(null);
    try {
      const response = await crearPreferencia(Number(pedidoId));
      setPreferenceId(response.preference_id);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || "Error al crear la preferencia";
      setError(detail);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-margin-desktop py-2xl text-center">
      <div className="bg-surface-container-high rounded-2xl p-xl border border-outline-variant/30 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-primary">
            payments
          </span>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
          {preferenceId ? "Finalizar pago" : "Pagar con Mercado Pago"}
        </h1>

        {error && (
          <div className="bg-error/10 border border-error/30 rounded-lg p-md mb-xl">
            <p className="font-body-md text-body-md text-error">{error}</p>
          </div>
        )}

        {!preferenceId ? (
          <>
            <div className="flex items-center justify-center gap-md mb-xl">
              {isPending && <Spinner />}
              <span className="font-body-md text-body-md text-on-surface-variant">
                {isPending ? "Preparando tu pago..." : "Hacé clic para pagar con Mercado Pago"}
              </span>
            </div>

            <button
              onClick={handlePagar}
              disabled={isPending}
              className="w-full bg-primary text-on-primary py-lg rounded-xl font-headline-md font-bold hover:brightness-110 transition-all flex items-center justify-center gap-md active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-40"
            >
              {isPending ? (
                <>
                  <Spinner />
                  Procesando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">account_balance</span>
                  Pagar con Mercado Pago
                </>
              )}
            </button>
          </>
        ) : (
          <div className="space-y-lg">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Hacé clic en el botón de abajo para abrir el checkout seguro de Mercado Pago.
            </p>
            <Wallet
              initialization={{ preferenceId }}
              onReady={() => {}}
              onError={(err) => {
                navigate(`/pago-fallido?pedido_id=${pedidoId}`, {
                  replace: true,
                  state: { error: err.message || "Error en el checkout" },
                });
              }}
            />
            <button
              onClick={() => navigate(`/pago-exitoso?pedido_id=${pedidoId}`, { replace: true })}
              className="w-full bg-surface-container-highest text-on-surface-variant py-md rounded-lg font-label-lg hover:bg-surface-container transition-colors"
            >
              Ya pagué
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
