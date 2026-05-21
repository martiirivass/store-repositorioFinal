import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../store/cartStore";
import { useCrearPedido, useDirecciones } from "../hooks/usePedidos";
import { useAuthStore } from "../../../store/authStore";
import { getProductImage } from "../../../shared/images";

export function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { isLogged } = useAuthStore();
  const { mutateAsync: crearPedido, isPending } = useCrearPedido();
  const { data: direcciones } = useDirecciones();
  const navigate = useNavigate();
  const [selectedDir, setSelectedDir] = useState<number | null>(null);
  const [formaPago, setFormaPago] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLogged) navigate("/login");
  }, [isLogged]);

  useEffect(() => {
    if (direcciones && direcciones.length > 0 && !selectedDir) {
      const principal = direcciones.find((d) => d.principal);
      setSelectedDir(principal?.id || direcciones[0].id);
    }
  }, [direcciones]);

  if (items.length === 0) {
    navigate("/carrito");
    return null;
  }

  const handleSubmit = async () => {
    try {
      setError("");
      await crearPedido({
        forma_pago_id: formaPago,
        direccion_entrega_id: selectedDir,
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
      });
      clearCart();
      navigate("/mis-pedidos");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al crear el pedido");
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-margin-desktop py-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-7 space-y-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-lg">Checkout</h1>

          <div className="space-y-md">
            {items.map((item) => (
              <div key={item.producto_id} className="bg-surface-container rounded-lg p-md flex items-center gap-lg border border-outline-variant/30">
                <div className="w-16 h-16 rounded overflow-hidden shrink-0">
                  <img src={getProductImage(item.producto_id, item.producto_id)} alt={item.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="font-label-lg text-label-lg text-on-surface">{item.nombre}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">{item.cantidad}x ${item.precio.toFixed(2)}</p>
                </div>
                <p className="font-label-lg text-label-lg text-primary font-bold">${(item.precio * item.cantidad).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-low border border-dashed border-outline-variant rounded-lg p-lg">
            <p className="font-label-lg text-label-lg text-on-surface mb-sm">¿Deseas añadir algo más?</p>
            <button onClick={() => navigate("/catalogo")} className="bg-surface-variant text-on-surface px-lg py-sm rounded font-label-lg hover:bg-surface-container-highest transition-all border border-outline-variant/30">
              Seguir Comprando
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-surface-container-high rounded-lg p-xl border border-outline-variant/30 sticky top-24 shadow-2xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xl">Detalles de Envío</h2>

            {direcciones && direcciones.length > 0 && (
              <div className="mb-lg space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Dirección</label>
                {direcciones.map((d) => (
                  <button key={d.id} onClick={() => setSelectedDir(d.id)}
                    className={`w-full text-left p-md rounded-lg border transition-all ${selectedDir === d.id ? "border-primary bg-primary/5" : "border-outline-variant/30 bg-surface-container-low"}`}
                  >
                    <p className="font-label-lg text-label-lg text-on-surface">{d.alias}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">{d.direccion}, {d.ciudad}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-md mb-lg">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Método de Pago</label>
              <div className="grid grid-cols-3 gap-sm">
                {[
                  { id: 1, label: "Tarjeta", icon: "credit_card" },
                  { id: 2, label: "Efectivo", icon: "payments" },
                  { id: 3, label: "Transferencia", icon: "account_balance" },
                ].map((mp) => (
                  <button key={mp.id} onClick={() => setFormaPago(mp.id)}
                    className={`flex flex-col items-center gap-xs p-md rounded transition-all ${
                      formaPago === mp.id
                        ? "bg-surface-container-low border-2 border-primary text-primary"
                        : "bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:border-outline"
                    }`}
                  >
                    <span className="material-symbols-outlined">{mp.icon}</span>
                    <span className="font-label-sm text-label-sm">{mp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-xl space-y-md">
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span className="text-on-surface">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>Envío</span>
                <span className="text-secondary font-medium">Gratis</span>
              </div>
              <div className="flex justify-between font-headline-md text-headline-md text-on-surface pt-md border-t border-outline-variant/20">
                <span>Total</span>
                <span className="text-primary">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            {error && <p className="text-error font-label-sm text-label-sm mt-md">{error}</p>}

            <button onClick={handleSubmit} disabled={isPending}
              className="w-full bg-primary text-on-primary py-lg rounded font-headline-md text-headline-md font-bold hover:brightness-110 transition-all flex items-center justify-center gap-md active:scale-[0.98] shadow-lg shadow-primary/20 mt-xl disabled:opacity-50"
            >
              {isPending ? "Procesando..." : "Confirmar Pedido"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
