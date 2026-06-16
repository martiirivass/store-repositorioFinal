import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";
import { useDirecciones } from "@/features/orders/hooks/usePedidos";
import { useCheckoutForm } from "@/features/checkout/hooks/useCheckoutForm";
import { useCheckoutSubmit } from "@/features/checkout/hooks/useCheckoutSubmit";
import { CheckoutSuccessScreen } from "@/features/checkout/components/CheckoutSuccessScreen";
import { PaymentFormSection } from "@/features/checkout/components/PaymentFormSection";
import { getProductImage, getCloudinaryUrl } from "@/shared/images";
import { formatARS } from "@/shared/currency";

export function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const { isLogged } = useAuthStore();
  const { data: direcciones } = useDirecciones();
  const navigate = useNavigate();

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
    await handleSubmit({ formaPago: form.formaPago, selectedDir: form.selectedDir, items, referencia }, form.setError);
  };

  if (items.length === 0 && !showSuccess && !isSubmitting) return null;

  if (showSuccess && successData) return <CheckoutSuccessScreen data={successData} />;

  // ─── Checkout ─────────────────────────────────────────────────────
  return (
    <div className="max-w-[1400px] mx-auto px-margin-desktop py-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-7 space-y-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-lg">Checkout</h1>

          <div className="space-y-md">
            {items.map((item) => (
              <div key={item.producto_id} className="bg-surface-container rounded-lg p-md flex items-center gap-lg border border-outline-variant/30">
                <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-surface-container-high">
                  <img src={getCloudinaryUrl(item.imagen_url) || getProductImage(item.producto_id, item.producto_id)} alt={item.nombre} className="w-full h-full object-cover" />
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

            {direcciones && direcciones.length > 0 && (
              <div className="mb-lg space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Dirección</label>
                {direcciones.map((d) => (
                  <button key={d.id} onClick={() => form.setSelectedDir(d.id)}
                    className={`w-full text-left p-md rounded-lg border transition-all ${form.selectedDir === d.id ? "border-primary bg-primary/5" : "border-outline-variant/30 bg-surface-container-low"}`}>
                    <p className="font-label-lg text-label-lg text-on-surface">{d.alias || d.linea1}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">{d.linea1}, {d.ciudad}</p>
                  </button>
                ))}
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

            <div className="border-t border-outline-variant/30 pt-xl space-y-md">
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span className="text-on-surface">{formatARS(getTotal())}</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>Envío</span>
                <span className="text-secondary font-medium">Gratis</span>
              </div>
              <div className="flex justify-between font-headline-md text-headline-md text-on-surface pt-md border-t border-outline-variant/20">
                <span>Total</span>
                <span className="text-primary">{formatARS(getTotal())}</span>
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
