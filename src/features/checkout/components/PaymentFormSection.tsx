import type { UseCheckoutFormReturn } from "@/features/checkout/hooks/useCheckoutForm";

interface Props extends UseCheckoutFormReturn {
  formaPago: string;
}

// ─── Tarjeta ──────────────────────────────────────────────────────────
function TarjetaForm({ cardNumber, setCardNumber, cardHolder, setCardHolder, cardExpiry, setCardExpiry, cardCvv, setCardCvv }: Props) {
  const inputCls = "w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";
  return (
    <div className="space-y-md">
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">Número de tarjeta</label>
        <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
          value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">Titular</label>
        <input type="text" placeholder="Nombre como figura en la tarjeta"
          value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-md">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">Vencimiento</label>
          <input type="text" placeholder="MM/AA"
            value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">CVV</label>
          <input type="text" inputMode="numeric" placeholder="123" maxLength={4}
            value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className={inputCls} />
        </div>
      </div>
    </div>
  );
}

// ─── Transferencia ────────────────────────────────────────────────────
function TransferenciaForm({ cbu, setCbu, bankName, setBankName, accountHolder, setAccountHolder }: Props) {
  const inputCls = "w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";
  return (
    <div className="space-y-md">
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">CBU / CVU / Alias</label>
        <input type="text" placeholder="0000003100054321"
          value={cbu} onChange={(e) => setCbu(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">Banco</label>
        <input type="text" placeholder="Ej: Banco Galicia, Nación, etc."
          value={bankName} onChange={(e) => setBankName(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs block">Titular de la cuenta</label>
        <input type="text" placeholder="Nombre y apellido del titular"
          value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} className={inputCls} />
      </div>
    </div>
  );
}

// ─── Principal ────────────────────────────────────────────────────────
export function PaymentFormSection(props: Props) {
  const { formaPago } = props;

  if (formaPago === "EFECTIVO") {
    return (
      <div className="bg-surface-container-high rounded-lg p-xl border border-dashed border-outline-variant/50">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-[32px] text-secondary">info</span>
          <p className="font-body-md text-body-md text-on-surface-variant">Pagás en efectivo cuando recibís el pedido. No necesitás ingresar ningún dato adicional.</p>
        </div>
      </div>
    );
  }

  if (formaPago === "MERCADOPAGO") {
    return (
      <div className="bg-surface-container-high rounded-lg p-xl border border-dashed border-outline-variant/50">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-[32px] text-secondary">info</span>
          <p className="font-body-md text-body-md text-on-surface-variant">Vas a pagar con Mercado Pago. Al confirmar el pedido serás redirigido al sitio seguro de Mercado Pago para completar el pago.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-high rounded-lg p-xl border border-outline-variant/30 space-y-lg">
      <h2 className="font-headline-md text-headline-md text-on-surface">
        {formaPago === "TARJETA" ? "Datos de la Tarjeta" : "Datos de la Transferencia"}
      </h2>
      {formaPago === "TARJETA" ? <TarjetaForm {...props} /> : <TransferenciaForm {...props} />}
    </div>
  );
}
