import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";
import { useDirecciones } from "@/features/orders/hooks/usePedidos";
import { useCheckoutForm } from "@/features/checkout/hooks/useCheckoutForm";
import { useCheckoutSubmit } from "@/features/checkout/hooks/useCheckoutSubmit";
import { CheckoutSuccessScreen } from "@/features/checkout/components/CheckoutSuccessScreen";
import { PaymentFormSection } from "@/features/checkout/components/PaymentFormSection";
import { getCloudinaryUrl } from "@/shared/images";
import { formatARS } from "@/shared/currency";

export function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const { isLogged } = useAuthStore();
  const { data: direcciones } = useDirecciones();
  const navigate = useNavigate();

  const [codigoDescuento, setCodigoDescuento] = useState("");
  const [descuentoValido, setDescuentoValido] = useState(false);

  const DESCUENTO_PORCENTAJE = 0.20;
  const totalSinDescuento = getTotal();
  const descuentoMonto = descuentoValido ? totalSinDescuento * DESCUENTO_PORCENTAJE : 0;
  const totalConDescuento = totalSinDescuento - descuentoMonto;

  const aplicarDescuento = () => {
    if (codigoDescuento.trim().toUpperCase() === "PREMIUN20") {
      setDescuentoValido(true);
    } else {
      setDescuentoValido(false);
    }
  };

  const form = useCheckoutForm();
  const { isSubmitting, showSuccess, successData, handleSubmit } = useCheckoutSubmit();

  // ─── Redirecciones ────────────────────────────────────────────────
  useEffect(() => { if (!isLogged) navigate("/login"); }, [isLogged]);

  useEffect(() => {
    if (direcciones && direcciones.length > 0 && form.selectedDir === null) {
      const p = direcciones.find((d) => d.es_principal);
      form.setSelectedDir(p?.id || direcciones[0].id);
    }
  }, [direcciones]);

  const handleConfirmar = async () => {
    const errorPago = form.validarPago();
    if (errorPago) { form.setError(errorPago); return; }
    const referencia = form.buildReferencia();
    await handleSubmit({ formaPago: form.formaPago, selectedDir: form.selectedDir, items, referencia, codigoDescuento: descuentoValido ? "PREMIUN20" : null }, form.setError);
  };

  if (items.length === 0 && !showSuccess && !isSubmitting) return null;

  if (showSuccess && successData) return <CheckoutSuccessScreen data={successData} />;

  // ─── Checkout ─────────────────────────────────────────────────────
  return (
    <div className="max-w-[1400px] mx-auto px-gutter md:px-margin-desktop py-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-7 space-y-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-lg">Checkout</h1>

          <div className="space-y-md">
            {items.map((item) => (
              <div key={item.producto_id} className="bg-surface-container rounded-lg p-md flex items-center gap-lg border border-outline-variant/30">
                <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-surface-container-high">
                  {getCloudinaryUrl(item.imagen_url) ? (
                    <img src={getCloudinaryUrl(item.imagen_url)} alt={item.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl text-on-surface-variant/30">image</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-label-lg text-label-lg text-on-surface">{item.nombre}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">{item.cantidad}x {formatARS(item.precio)}</p>
                </div>
                <p className="font-label-lg text-label-lg text-primary font-bold">{formatARS(item.precio * item.cantidad)}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-low border border-dashed border-outline-variant rounded-lg p-lg">
            <p className="font-label-lg text-label-lg text-on-surface mb-sm">¿Deseas añadir algo más?</p>
            <button onClick={() => navigate("/catalogo")}
              className="bg-surface-variant text-on-surface px-lg py-sm rounded font-label-lg hover:bg-surface-container-highest transition-all border border-outline-variant/30">
              Seguir Comprando
            </button>
          </div>

          <PaymentFormSection {...form} />
        </div>

        <div className="lg:col-span-5">
          <div className="bg-surface-container-high rounded-lg p-xl border border-outline-variant/30 sticky top-24 shadow-2xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xl">Detalles de Envío</h2>

            {direcciones && direcciones.length > 0 ? (
              <div className="mb-lg space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Dirección</label>
                {direcciones.map((d) => (
                  <button key={d.id} onClick={() => form.setSelectedDir(d.id)}
                    className={`w-full text-left p-md rounded-lg border transition-all ${form.selectedDir === d.id ? "border-primary bg-primary/5" : "border-outline-variant/30 bg-surface-container-low"}`}>
                    <p className="font-label-lg text-label-lg text-on-surface">{d.alias || d.linea1}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">{d.linea1}, {d.ciudad}</p>
                  </button>
                ))}
                <button
                  onClick={() => navigate("/mis-direcciones")}
                  className="w-full text-left mt-sm font-label-sm text-label-sm text-primary hover:underline transition-all"
                >
                  Gestionar direcciones
                </button>
              </div>
            ) : (
              <div className="mb-lg p-lg border border-dashed border-outline-variant rounded-lg text-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/40 mb-sm">location_off</span>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                  No tenés direcciones cargadas.
                </p>
                <button
                  onClick={() => navigate("/mis-direcciones")}
                  className="inline-flex items-center gap-xs px-lg py-sm bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:opacity-90 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">add_location</span>
                  Agregar dirección
                </button>
              </div>
            )}

            <div className="space-y-md mb-lg">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Método de Pago</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
                {[
                  { codigo: "TARJETA", label: "Tarjeta", icon: "credit_card" },
                  { codigo: "EFECTIVO", label: "Efectivo", icon: "payments" },
                  { codigo: "TRANSFERENCIA", label: "Transferencia", icon: "account_balance" },
                  { codigo: "MERCADOPAGO", label: "Mercado Pago", icon: "account_balance" },
                ].map((mp) => (
                  <button key={mp.codigo} onClick={() => form.setFormaPago(mp.codigo)}
                    className={`flex flex-col items-center gap-xs p-md rounded transition-all ${
                      form.formaPago === mp.codigo
                        ? "bg-surface-container-low border-2 border-primary text-primary"
                        : "bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:border-outline"
                    }`}>
                    <span className="material-symbols-outlined">{mp.icon}</span>
                    <span className="font-label-sm text-label-sm">{mp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-md mb-lg">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">¿Tenés un código de descuento?</label>
              <div className="flex gap-sm">
                <input type="text" placeholder=""
                  value={codigoDescuento} onChange={(e) => { setCodigoDescuento(e.target.value); setDescuentoValido(false); }}
                  className="flex-grow bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                <button onClick={aplicarDescuento}
                  className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
                  disabled={!codigoDescuento.trim()}>
                  Aplicar
                </button>
              </div>
              {descuentoValido && (
                <p className="font-label-sm text-label-sm text-success flex items-center gap-xs">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  ¡Descuento del 20% aplicado!
                </p>
              )}
              {codigoDescuento.trim() && !descuentoValido && (
                <p className="font-label-sm text-label-sm text-error flex items-center gap-xs">
                  <span className="material-symbols-outlined text-lg">error</span>
                  Código inválido
                </p>
              )}
            </div>

            <div className="border-t border-outline-variant/30 pt-xl space-y-md">
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span className="text-on-surface">{formatARS(totalSinDescuento)}</span>
              </div>
              {descuentoValido && (
                <div className="flex justify-between font-body-md text-body-md text-success">
                  <span>Descuento (20%)</span>
                  <span className="font-medium">-{formatARS(descuentoMonto)}</span>
                </div>
              )}
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>Envío</span>
                <span className="text-secondary font-medium">Gratis</span>
              </div>
              <div className="flex justify-between font-headline-md text-headline-md text-on-surface pt-md border-t border-outline-variant/20">
                <span>Total</span>
                <span className="text-primary">{formatARS(totalConDescuento)}</span>
              </div>
            </div>

            {form.error && <p className="text-error font-label-sm text-label-sm mt-md">{form.error}</p>}

            <button onClick={handleConfirmar} disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-lg rounded font-headline-md text-headline-md font-bold hover:brightness-110 transition-all flex items-center justify-center gap-md active:scale-[0.98] shadow-lg shadow-primary/20 mt-xl disabled:opacity-50">
              {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
