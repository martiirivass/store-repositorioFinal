import { useNavigate } from "react-router-dom";
import { formatARS } from "@/shared/currency";
import type { SuccessData } from "@/features/checkout/hooks/useCheckoutSubmit";

const PAGO_LABELS: Record<string, string> = {
  TARJETA: "Tarjeta de crédito/débito",
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia bancaria",
  MERCADOPAGO: "Mercado Pago",
};

interface Props {
  data: SuccessData;
}

export function CheckoutSuccessScreen({ data }: Props) {
  const navigate = useNavigate();

  return (
    <div className="max-w-[600px] mx-auto px-gutter md:px-margin-desktop py-2xl text-center">
      <div className="bg-surface-container-high rounded-2xl p-xl border border-outline-variant/30 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-green-400">check_circle</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">¡Pago Exitoso!</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
          Tu pedido <span className="text-primary font-bold">#ORD-{String(data.pedidoId).padStart(4, "0")}</span>{" "}
          fue registrado correctamente.
        </p>
        <div className="bg-surface-container rounded-lg p-lg mb-xl text-left space-y-md border border-outline-variant/20">
          <div className="flex justify-between">
            <span className="text-on-surface-variant font-body-md">Método de pago</span>
            <span className="text-on-surface font-label-lg">{PAGO_LABELS[data.formaPago] || data.formaPago}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant font-body-md">Total pagado</span>
            <span className="text-primary font-headline-md font-bold">{formatARS(data.total)}</span>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
          Vas a poder seguir el estado de tu pedido en la sección "Mis Pedidos".
        </p>
        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <button onClick={() => navigate("/mis-pedidos")}
            className="bg-primary text-on-primary px-xl py-lg rounded-lg font-headline-md font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">
            Ver Mis Pedidos
          </button>
          <button onClick={() => navigate("/catalogo")}
            className="bg-surface-variant text-on-surface px-xl py-lg rounded-lg font-headline-md font-bold hover:bg-surface-container-highest transition-all border border-outline-variant/30">
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
}
