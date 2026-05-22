import { useMisPedidos, useCancelarPedido } from "../hooks/usePedidos";
import { getProductImage } from "../../../shared/images";

const ESTADOS: Record<string, { label: string; color: string }> = {
  PENDIENTE: { label: "Pendiente", color: "bg-orange-900/30 text-primary border-primary/20" },
  CONFIRMADO: { label: "Confirmado", color: "bg-blue-900/30 text-blue-400 border-blue-400/20" },
  EN_PREP: { label: "En Preparación", color: "bg-yellow-900/30 text-yellow-400 border-yellow-400/20" },
  EN_CAMINO: { label: "En Camino", color: "bg-purple-900/30 text-purple-400 border-purple-400/20" },
  ENTREGADO: { label: "Entregado", color: "bg-green-900/30 text-green-400 border-green-400/20" },
  CANCELADO: { label: "Cancelado", color: "bg-red-900/30 text-red-400 border-red-400/20" },
};

const ESTADOS_ORDER = ["PENDIENTE", "CONFIRMADO", "EN_PREP", "EN_CAMINO", "ENTREGADO"];

export function MyOrdersPage() {
  const { data, isLoading } = useMisPedidos();
  const { mutate: cancelar } = useCancelarPedido();

  return (
    <div className="max-w-[1280px] mx-auto px-gutter py-xl">
      <header className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Mis Pedidos</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Gestiona y revisa el historial de tus compras gourmet.</p>
      </header>

      {isLoading ? (
        <div className="text-center py-xl text-on-surface-variant">Cargando...</div>
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
                        <p className="font-title-lg text-title-lg text-on-surface font-bold">${pedido.total.toFixed(2)}</p>
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
                    {pedido.detalles?.slice(0, 2).map((det) => (
                      <div key={det.id} className="flex items-center gap-md bg-surface-container/50 p-md rounded-lg border border-outline-variant">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <img src={getProductImage(det.producto_id, det.producto_id)} alt={det.nombre_producto} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-label-lg text-label-lg text-on-surface">{det.nombre_snapshot}</p>
                          <p className="font-body-md text-body-md text-on-surface-variant">{det.cantidad}x ${det.precio_snapshot.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {pedido.detalles && pedido.detalles.length > 2 && (
                      <div className="flex items-center justify-center bg-surface-container/50 p-md rounded-lg border border-outline-variant text-on-surface-variant font-label-sm">
                        +{pedido.detalles.length - 2} más
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-end gap-md pt-md border-t border-outline-variant">
                    {cancelable && (
                      <button onClick={() => cancelar(pedido.id)}
                        className="px-xl py-md border border-error/50 text-error hover:bg-error/10 transition-colors font-label-lg text-label-lg rounded-lg active:scale-95"
                      >
                        Cancelar pedido
                      </button>
                    )}
                    <button className="px-xl py-md bg-primary text-on-primary font-label-lg text-label-lg rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10">
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
