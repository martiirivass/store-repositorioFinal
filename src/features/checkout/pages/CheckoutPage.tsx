import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/features/cart/store";
import { useCrearPedido, useDirecciones } from "@/features/orders/hooks/usePedidos";
import { useAuthStore } from "@/features/auth/store";
import { getProductImage } from "@/shared/images";
import { formatARS } from "@/shared/currency";

// ─── Helper: máscara para número de tarjeta ───────────────────────────────
function maskCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

// ─── Helper: máscara para fecha de vencimiento ─────────────────────────────
function maskExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

// ─── Componente principal ──────────────────────────────────────────────────
export function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { isLogged } = useAuthStore();
  const { mutateAsync: crearPedido, isPending } = useCrearPedido();
  const { data: direcciones } = useDirecciones();
  const navigate = useNavigate();

  // Estados existentes
  const [selectedDir, setSelectedDir] = useState<number | null>(null);
  const [formaPago, setFormaPago] = useState("EFECTIVO");
  const [error, setError] = useState("");

  // ─── Estados para datos de pago ───────────────────────────────────────
  // Tarjeta
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Transferencia
  const [cbu, setCbu] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  // ─── Estado de éxito ──────────────────────────────────────────────────
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    pedidoId: number;
    total: number;
    formaPago: string;
  } | null>(null);

  // ─── Redirección si no está logueado ──────────────────────────────────
  useEffect(() => {
    if (!isLogged) navigate("/login");
  }, [isLogged]);

  // ─── Seleccionar dirección por defecto ────────────────────────────────
  useEffect(() => {
    if (direcciones && direcciones.length > 0 && !selectedDir) {
      const principal = direcciones.find((d) => d.es_principal);
      setSelectedDir(principal?.id || direcciones[0].id);
    }
  }, [direcciones]);

  // ─── Si el carrito está vacío, redirigir ──────────────────────────────
  if (items.length === 0 && !showSuccess) {
    navigate("/carrito");
    return null;
  }

  // ─── Armar referencia según forma de pago ─────────────────────────────
  const buildReferencia = (): string | null => {
    if (formaPago === "TARJETA") {
      const last4 = cardNumber.replace(/\D/g, "").slice(-4);
      return `TARJETA-****${last4}`;
    }
    if (formaPago === "TRANSFERENCIA") {
      return `CBU-${cbu.replace(/\D/g, "").slice(0, 22)}`;
    }
    return null;
  };

  // ─── Validar campos según forma de pago ───────────────────────────────
  const validarPago = (): string | null => {
    if (formaPago === "TARJETA") {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length < 13) return "El número de tarjeta debe tener al menos 13 dígitos";
      if (!cardHolder.trim()) return "Ingresá el titular de la tarjeta";
      if (cardExpiry.replace(/\D/g, "").length < 4) return "Ingresá una fecha de vencimiento válida";
      if (cardCvv.replace(/\D/g, "").length < 3) return "Ingresá el código de seguridad (CVV)";
    }
    if (formaPago === "TRANSFERENCIA") {
      const digits = cbu.replace(/\D/g, "");
      if (digits.length < 10) return "Ingresá un CBU/CVU válido (mín. 10 dígitos)";
      if (!bankName.trim()) return "Ingresá el nombre del banco";
      if (!accountHolder.trim()) return "Ingresá el titular de la cuenta";
    }
    return null;
  };

  // ─── Enviar pedido ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      setError("");

      const errorPago = validarPago();
      if (errorPago) {
        setError(errorPago);
        return;
      }

      const referencia = buildReferencia();

      const pedido = await crearPedido({
        forma_pago_codigo: formaPago,
        direccion_id: selectedDir,
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
        referencia_pago: referencia,
      });

      clearCart();
      setSuccessData({
        pedidoId: pedido.id,
        total: pedido.total,
        formaPago: formaPago,
      });
      setShowSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Error al crear el pedido");
    }
  };

  // ─── Render: PANTALLA DE ÉXITO ────────────────────────────────────────
  if (showSuccess && successData) {
    const pagoLabels: Record<string, string> = {
      TARJETA: "Tarjeta de crédito/débito",
      EFECTIVO: "Efectivo",
      TRANSFERENCIA: "Transferencia bancaria",
    };

    return (
      <div className="max-w-[600px] mx-auto px-margin-desktop py-2xl text-center">
        <div className="bg-surface-container-high rounded-2xl p-xl border border-outline-variant/30 shadow-2xl">
          {/* Icono de éxito */}
          <div className="w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[48px] text-green-400">check_circle</span>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
            ¡Pago Exitoso!
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
            Tu pedido <span className="text-primary font-bold">#ORD-{String(successData.pedidoId).padStart(4, "0")}</span>{" "}
            fue registrado correctamente.
          </p>

          {/* Detalles del pago */}
          <div className="bg-surface-container rounded-lg p-lg mb-xl text-left space-y-md border border-outline-variant/20">
            <div className="flex justify-between">
              <span className="text-on-surface-variant font-body-md">Método de pago</span>
              <span className="text-on-surface font-label-lg">{pagoLabels[successData.formaPago] || successData.formaPago}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant font-body-md">Total pagado</span>
              <span className="text-primary font-headline-md font-bold">{formatARS(successData.total)}</span>
            </div>
          </div>

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

  // ─── Render: CHECKOUT ─────────────────────────────────────────────────
  return (
    <div className="max-w-[1400px] mx-auto px-margin-desktop py-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Columna izquierda: items + campos de pago */}
        <div className="lg:col-span-7 space-y-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-lg">Checkout</h1>

          {/* Lista de productos */}
          <div className="space-y-md">
            {items.map((item) => (
              <div key={item.producto_id} className="bg-surface-container rounded-lg p-md flex items-center gap-lg border border-outline-variant/30">
                <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-surface-container-high">
                  <img src={item.imagen_url || getProductImage(item.producto_id, item.producto_id)} alt={item.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="font-label-lg text-label-lg text-on-surface">{item.nombre}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">{item.cantidad}x {formatARS(item.precio)}</p>
                </div>
                <p className="font-label-lg text-label-lg text-primary font-bold">{formatARS(item.precio * item.cantidad)}</p>
              </div>
            ))}
          </div>

          {/* Seguir comprando */}
          <div className="bg-surface-container-low border border-dashed border-outline-variant rounded-lg p-lg">
            <p className="font-label-lg text-label-lg text-on-surface mb-sm">¿Deseas añadir algo más?</p>
            <button onClick={() => navigate("/catalogo")} className="bg-surface-variant text-on-surface px-lg py-sm rounded font-label-lg hover:bg-surface-container-highest transition-all border border-outline-variant/30">
              Seguir Comprando
            </button>
          </div>

          {/* ─── Datos de pago según método ──────────────────────────── */}
          {formaPago !== "EFECTIVO" && (
            <div className="bg-surface-container-high rounded-lg p-xl border border-outline-variant/30 space-y-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {formaPago === "TARJETA" ? "Datos de la Tarjeta" : "Datos de la Transferencia"}
              </h2>

              {formaPago === "TARJETA" ? (
                /* ── Campos para TARJETA ────────────────────────────── */
                <div className="space-y-md">
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">
                      Titular
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre como figura en la tarjeta"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">
                        Vencimiento
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(maskExpiry(e.target.value))}
                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">
                        CVV
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Campos para TRANSFERENCIA ────────────────────────── */
                <div className="space-y-md">
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">
                      CBU / CVU / Alias
                    </label>
                    <input
                      type="text"
                      placeholder="0000003100054321"
                      value={cbu}
                      onChange={(e) => setCbu(e.target.value.replace(/\D/g, "").slice(0, 22))}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">
                      Banco
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Banco Galicia, Nación, etc."
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">
                      Titular de la cuenta
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre y apellido del titular"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info para efectivo */}
          {formaPago === "EFECTIVO" && (
            <div className="bg-surface-container-high rounded-lg p-xl border border-dashed border-outline-variant/50">
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-[32px] text-secondary">info</span>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Pagás en efectivo cuando recibís el pedido. No necesitás ingresar ningún dato adicional.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: resumen + direcciones */}
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
                    <p className="font-label-lg text-label-lg text-on-surface">{d.alias || d.linea1}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">{d.linea1}, {d.ciudad}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-md mb-lg">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Método de Pago</label>
              <div className="grid grid-cols-3 gap-sm">
                {[
                  { codigo: "TARJETA", label: "Tarjeta", icon: "credit_card" },
                  { codigo: "EFECTIVO", label: "Efectivo", icon: "payments" },
                  { codigo: "TRANSFERENCIA", label: "Transferencia", icon: "account_balance" },
                ].map((mp) => (
                  <button key={mp.codigo} onClick={() => setFormaPago(mp.codigo)}
                    className={`flex flex-col items-center gap-xs p-md rounded transition-all ${
                      formaPago === mp.codigo
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
