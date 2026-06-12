import { useState, useCallback } from "react";

// ─── Helpers de máscara ───────────────────────────────────────────────
function maskCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function maskExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export interface UseCheckoutFormReturn {
  selectedDir: number | null;
  setSelectedDir: (v: number | null) => void;
  formaPago: string;
  setFormaPago: (v: string) => void;
  error: string;
  setError: (v: string) => void;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardHolder: string;
  setCardHolder: (v: string) => void;
  cardExpiry: string;
  setCardExpiry: (v: string) => void;
  cardCvv: string;
  setCardCvv: (v: string) => void;
  cbu: string;
  setCbu: (v: string) => void;
  bankName: string;
  setBankName: (v: string) => void;
  accountHolder: string;
  setAccountHolder: (v: string) => void;
  validarPago: () => string | null;
  buildReferencia: () => string | null;
  resetForm: () => void;
}

export function useCheckoutForm(): UseCheckoutFormReturn {
  // ─── Estados ──────────────────────────────────────────────────────
  const [selectedDir, setSelectedDir] = useState<number | null>(null);
  const [formaPago, setFormaPago] = useState("EFECTIVO");
  const [error, setError] = useState("");

  // Tarjeta
  const [cardNumber, setCardNumberRaw] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiryRaw] = useState("");
  const [cardCvv, setCardCvvRaw] = useState("");

  // Transferencia
  const [cbu, setCbuRaw] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  // ─── Setters con máscara ──────────────────────────────────────────
  const setCardNumber = useCallback(
    (value: string) => setCardNumberRaw(maskCardNumber(value)),
    []
  );

  const setCardExpiry = useCallback(
    (value: string) => setCardExpiryRaw(maskExpiry(value)),
    []
  );

  const setCardCvv = useCallback(
    (value: string) => setCardCvvRaw(value.replace(/\D/g, "").slice(0, 4)),
    []
  );

  const setCbu = useCallback(
    (value: string) => setCbuRaw(value.replace(/\D/g, "").slice(0, 22)),
    []
  );

  // ─── Validar campos según forma de pago ──────────────────────────
  const validarPago = useCallback((): string | null => {
    if (formaPago === "MERCADOPAGO") return null;

    if (formaPago === "TARJETA") {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length < 13) return "El número de tarjeta debe tener al menos 13 dígitos";
      if (!cardHolder.trim()) return "Ingresá el titular de la tarjeta";
      if (cardExpiry.replace(/\D/g, "").length < 4)
        return "Ingresá una fecha de vencimiento válida";
      if (cardCvv.replace(/\D/g, "").length < 3)
        return "Ingresá el código de seguridad (CVV)";
    }

    if (formaPago === "TRANSFERENCIA") {
      const digits = cbu.replace(/\D/g, "");
      if (digits.length < 10) return "Ingresá un CBU/CVU válido (mín. 10 dígitos)";
      if (!bankName.trim()) return "Ingresá el nombre del banco";
      if (!accountHolder.trim()) return "Ingresá el titular de la cuenta";
    }

    return null;
  }, [formaPago, cardNumber, cardHolder, cardExpiry, cardCvv, cbu, bankName, accountHolder]);

  // ─── Armar referencia según forma de pago ────────────────────────
  const buildReferencia = useCallback((): string | null => {
    if (formaPago === "TARJETA") {
      const last4 = cardNumber.replace(/\D/g, "").slice(-4);
      return `TARJETA-****${last4}`;
    }
    if (formaPago === "TRANSFERENCIA") {
      return `CBU-${cbu.replace(/\D/g, "").slice(0, 22)}`;
    }
    return null;
  }, [formaPago, cardNumber, cbu]);

  // ─── Reset form ──────────────────────────────────────────────────
  const resetForm = useCallback(() => {
    setSelectedDir(null);
    setFormaPago("EFECTIVO");
    setError("");
    setCardNumberRaw("");
    setCardHolder("");
    setCardExpiryRaw("");
    setCardCvvRaw("");
    setCbuRaw("");
    setBankName("");
    setAccountHolder("");
  }, []);

  return {
    // Estados
    selectedDir,
    setSelectedDir,
    formaPago,
    setFormaPago,
    error,
    setError,

    // Tarjeta
    cardNumber,
    setCardNumber,
    cardHolder,
    setCardHolder,
    cardExpiry,
    setCardExpiry,
    cardCvv,
    setCardCvv,

    // Transferencia
    cbu,
    setCbu,
    bankName,
    setBankName,
    accountHolder,
    setAccountHolder,

    // Helpers
    validarPago,
    buildReferencia,
    resetForm,
  };
}
