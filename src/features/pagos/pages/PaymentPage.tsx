import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCrearPreferencia, usePagoStatus } from "../hooks/usePagos";
import { useCartStore } from "@/features/cart/store";
import { Spinner } from "@/shared/components/Skeleton";
import { formatARS } from "@/shared/currency";

export function PaymentPage() {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const navigate = useNavigate();
  const clearCart = useCartStore((s) => s.clearCart);
  const { mutateAsync: crearPreferencia, isPending: isCreating } = useCrearPreferencia();
  const { data: pago, isLoading: isCheckingStatus } = usePagoStatus(
    pedidoId ? Number(pedidoId) : null
  );
  const initPointRef = useRef<string | null>(null);
  const tabRef = useRef<Window | null>(null);

  const estaAprobado = pago?.status === "approved";
  const estaRechazado = pago?.status === "rejected";

  // ─── Crear preferencia al montar y abrir nueva pestaña ────────────
  useEffect(() => {
    if (!pedidoId || initPointRef.current) return;

    crearPreferencia(Number(pedidoId)).then((response) => {
      initPointRef.current = response.init_point;

      // Abrir Mercado Pago en NUEVA PESTAÑA
      tabRef.current = window.open(response.init_point, "_blank");

      // Si el popup fue bloqueado, no pasa nada — el usuario puede
      // hacer clic en "Abrir Mercado Pago" manualmente.
    });
  }, [pedidoId, crearPreferencia]);

  // ─── Cuando se aprueba, cerrar la pestaña de MP y limpiar carrito ──
  useEffect(() => {
    if (estaAprobado) {
      clearCart();
      if (tabRef.current && !tabRef.current.closed) {
        try { tabRef.current.close(); } catch { /* ignore cross-origin */ }
      }
    }
  }, [estaAprobado, clearCart]);

  // ─── Pantalla de éxito ────────────────────────────────────────────
  if (estaAprobado) {
    return (
      <div className="max-w-[600px] mx-auto px-margin-desktop py-2xl text-center">
        <div className="bg-surface-container-high rounded-2xl p-xl border border-outline-variant/30 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-green-400">
              check_circle
            </span>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
            ¡Pago Confirmado!
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
            Tu pedido{" "}
            <span className="text-primary font-bold">
              #ORD-{String(pedidoId ?? "").padStart(4, "0")}
            </span>{" "}
            fue pagado correctamente.
          </p>

          {pago?.transaction_amount && (
            <div className="bg-surface-container rounded-lg p-lg mb-xl text-left space-y-md border border-outline-variant/20">
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-body-md">Método de pago</span>
                <span className="text-on-surface font-label-lg">Mercado Pago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant font-body-md">Total pagado</span>
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
        </div>
      </div>
    );
  }

  // ─── Pantalla de rechazo ──────────────────────────────────────────
  if (estaRechazado) {
    return (
      <div className="max-w-[600px] mx-auto px-margin-desktop py-2xl text-center">
        <div className="bg-surface-container-high rounded-2xl p-xl border border-outline-variant/30 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-red-500/20 mx-auto mb-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-red-400">cancel</span>
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
        </div>
      </div>
    );
  }

  // ─── Esperando pago ───────────────────────────────────────────────
  const mpAbierta = initPointRef.current && tabRef.current && !tabRef.current.closed;

  return (
    <div className="max-w-[600px] mx-auto px-margin-desktop py-2xl text-center">
      <div className="bg-surface-container-high rounded-2xl p-xl border border-outline-variant/30 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-primary">
            {mpAbierta ? "hourglass_top" : "payments"}
          </span>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
          {mpAbierta
            ? "Esperando el pago..."
            : "Pagar con Mercado Pago"}
        </h1>

        {isCreating && (
          <div className="flex items-center justify-center gap-md mb-xl">
            <Spinner />
            <span className="font-body-md text-body-md text-on-surface-variant">
              Preparando tu pago...
            </span>
          </div>
        )}

        {!isCreating && !initPointRef.current && (
          <div className="flex items-center justify-center gap-md mb-xl">
            <Spinner />
            <span className="font-body-md text-body-md text-on-surface-variant">
              Creando preferencia de pago...
            </span>
          </div>
        )}

        {!isCreating && initPointRef.current && !mpAbierta && (
          <>
            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
              Hacé clic para abrir el checkout seguro de Mercado Pago
              en una nueva pestaña.
            </p>
            <button
              onClick={() => {
                tabRef.current = window.open(initPointRef.current!, "_blank");
              }}
              className="w-full bg-primary text-on-primary py-lg rounded-xl font-headline-md font-bold hover:brightness-110 transition-all flex items-center justify-center gap-md active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">open_in_new</span>
              Abrir Mercado Pago
            </button>
            <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-md">
              Permití ventanas emergentes si no se abre automáticamente.
            </p>
          </>
        )}

        {!isCreating && initPointRef.current && mpAbierta && (
          <>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
              Completá el pago en la ventana de Mercado Pago que se abrió.
            </p>

            <div className="flex items-center justify-center gap-md mb-xl">
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="font-body-md text-body-md text-on-surface-variant">
                Esperando confirmación...
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
              No cierres esta página. Apenas se confirme el pago,
              se actualizará automáticamente.
            </p>

            <p className="font-body-sm text-body-sm text-on-surface-variant/60 mb-xl">
              ¿Ya pagaste y no se actualiza?{" "}
              <button
                onClick={() => navigate(`/pago-exitoso?pedido_id=${pedidoId}`, { replace: true })}
                className="text-primary underline hover:brightness-110"
              >
                Hacé clic acá
              </button>
            </p>

            <button
              onClick={() => navigate("/catalogo")}
              className="bg-surface-variant text-on-surface px-xl py-lg rounded-lg font-headline-md font-bold hover:bg-surface-container-highest transition-all border border-outline-variant/30"
            >
              Ir al Catálogo
            </button>
          </>
        )}

        {isCheckingStatus && initPointRef.current && (
          <div className="flex items-center justify-center gap-md mt-lg">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="font-body-sm text-body-sm text-on-surface-variant/60">
              Verificando estado del pago...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
