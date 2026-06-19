import { useNavigate } from "react-router-dom";
import { useMisPedidos, useCancelarPedido } from "../hooks/usePedidos";
import type { DetallePedidoRead } from "../types";
import { useAuthStore } from "@/features/auth/store";
import { useCartStore } from "@/features/cart/store";
import { useOrderStatusWS } from "@/hooks/useOrderStatusWS";
import { Skeleton } from "@/shared/components/Skeleton";

const ESTADOS: Record<string, { label: string; color: string }> = {
  PENDIENTE: { label: "Pendiente", color: "bg-orange-900/30 text-primary border-primary/20" },
  CONFIRMADO: { label: "Confirmado", color: "bg-blue-900/30 text-blue-400 border-blue-400/20" },
  EN_PREP: { label: "En Preparación", color: "bg-yellow-900/30 text-yellow-400 border-yellow-400/20" },
  ENTREGADO: { label: "Entregado", color: "bg-green-900/30 text-green-400 border-green-400/20" },
  CANCELADO: { label: "Cancelado", color: "bg-red-900/30 text-red-400 border-red-400/20" },
};

const ESTADOS_ORDER = ["PENDIENTE", "CONFIRMADO", "EN_PREP", "ENTREGADO"];

const TERMINAL_STATES = ["ENTREGADO", "CANCELADO"];

export function MyOrdersPage() {
  const { data, isLoading } = useMisPedidos();
  const { mutate: cancelar } = useCancelarPedido();
  const { isLogged } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  // Connect to the latest active order for real-time updates
  const latestActiveOrderId = data?.data
    .filter((p) => !TERMINAL_STATES.includes(p.estado_codigo))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0]?.id;
  // Only connect WS while user is authenticated
  useOrderStatusWS(isLogged ? latestActiveOrderId : null);

  return (
    <div className="max-w-[1280px] mx-auto px-gutter py-xl">
      <header className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Mis Pedidos</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Gestiona y revisa el historial de tus compras gourmet.</p>
      </header>

      {isLoading ? (
        <div className="space-y-lg">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-surface-container-high border border-outline-variant rounded-xl p-xl space-y-xl">
              <div className="flex justify-between items-center">
                <div className="space-y-md">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-28" />
              </div>
              <div className="flex gap-md">
                <Skeleton className="h-16 w-full max-w-[200px]" />
                <Skeleton className="h-16 w-full max-w-[200px]" />
              </div>
              <div className="flex justify-end gap-md">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : !data?.data.length ? (
        <div className="text-center py-xl">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-lg">receipt_long</span>
          <p className="text-on-surface-variant font-body-lg">No tenés pedidos aún.</p>
        </div>
      ) : (
        <div className="space-y-lg">
          {data.data.map((pedido) => {
            const codigoActual = pedido.estado_codigo || "PENDIENTE";
            const estadoInfo = ESTADOS[codigoActual] || ESTADOS.PENDIENTE;
            const idxActual = ESTADOS_ORDER.indexOf(codigoActual);
            const cancelable = ["PENDIENTE", "CONFIRMADO"].includes(codigoActual);

            return (
              <article key={pedido.id} className="bg-surface-container-high border border-outline-variant rounded-xl overflow-hidden hover:border-outline transition-all">
                <div className="p-lg md:p-xl space-y-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
                    <div className="space-y-1">
                      <h2 className="font-title-lg text-title-lg text-primary font-bold">#ORD-{String(pedido.id).padStart(4, "0")}</h2>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        {new Date(pedido.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-xl">
                      <div className="text-right">
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Total</p>
                        <p className="font-title-lg text-title-lg text-on-surface font-bold">${Number(pedido.total ?? 0).toFixed(2)}</p>
                      </div>
                      <span className={`px-md py-base rounded-lg font-label-sm text-label-sm border backdrop-blur-sm ${estadoInfo.color}`}>
                        {estadoInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="relative py-xl px-xs">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-highest -translate-y-1/2 rounded-full" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all"
                      style={{ width: `${idxActual >= 0 ? ((idxActual + 1) / ESTADOS_ORDER.length) * 100 : 0}%` }}
                    />
                    <div className="relative flex justify-between">
                      {ESTADOS_ORDER.map((est, i) => {
                        const reached = i <= idxActual;
                        return (
                          <div key={est} className="flex flex-col items-center gap-xs">
                            <div className={`w-6 h-6 rounded-full border-4 border-surface-container-high transition-all ${
                              reached ? "bg-primary ring-2 ring-primary/20" : "bg-surface-container-highest"
                            }`} />
                            <span className={`font-label-sm text-label-sm whitespace-nowrap ${reached ? "text-primary font-bold" : "text-on-surface-variant"}`}>
                              {ESTADOS[est]?.label || est}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    {pedido.detalles?.map((det) => (
                      <div key={`${det.pedido_id}-${det.producto_id}`} className="flex items-start gap-md bg-surface-container/50 p-md rounded-lg border border-outline-variant">
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl text-on-surface-variant/30">image</span>
                          </div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-label-lg text-label-lg text-on-surface break-words">{det.nombre_snapshot}</p>
                          <p className="font-body-md text-body-md text-on-surface-variant">{det.cantidad}x ${Number(det.precio_snapshot ?? 0).toFixed(2)}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant/60 mt-xs">Subtotal: ${Number(det.subtotal_snap ?? 0).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-end gap-md pt-md border-t border-outline-variant">
                    {cancelable && (
                      <button onClick={() => {
                        cancelar({ id: pedido.id, motivo: "Cancelado por el usuario" });
                      }}
                        className="px-xl py-md border border-error/50 text-error hover:bg-error/10 transition-colors font-label-lg text-label-lg rounded-lg active:scale-95"
                      >
                        Cancelar pedido
                      </button>
                    )}
                    <button onClick={() => {
                        clearCart();
                        pedido.detalles?.forEach((det) => addItem({
                          id: det.producto_id,
                          nombre: det.nombre_snapshot,
                          precio: det.precio_snapshot,
                          cantidad: det.cantidad,
                        }));
                        navigate("/carrito");
                      }}
                      className="px-xl py-md bg-primary text-on-primary font-label-lg text-label-lg rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10">
                      Repetir pedido
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
