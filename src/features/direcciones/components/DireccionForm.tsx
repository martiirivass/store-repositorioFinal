import { useState } from "react";
import type { DireccionRead, DireccionCreate } from "@/features/orders/types";

interface DireccionFormProps {
  direccion?: DireccionRead;
  onSubmit: (data: DireccionCreate) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function DireccionForm({ direccion, onSubmit, onCancel, isSubmitting }: DireccionFormProps) {
  const [alias, setAlias] = useState(direccion?.alias ?? "");
  const [linea1, setLinea1] = useState(direccion?.linea1 ?? "");
  const [linea2, setLinea2] = useState(direccion?.linea2 ?? "");
  const [ciudad, setCiudad] = useState(direccion?.ciudad ?? "");
  const [provincia, setProvincia] = useState(direccion?.provincia ?? "");
  const [codigoPostal, setCodigoPostal] = useState(direccion?.codigo_postal ?? "");
  const [esPrincipal, setEsPrincipal] = useState(direccion?.es_principal ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!direccion;

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!linea1.trim()) next.linea1 = "La dirección es obligatoria";
    if (!ciudad.trim()) next.ciudad = "La ciudad es obligatoria";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: DireccionCreate = {
      alias: alias.trim() || null,
      linea1: linea1.trim(),
      linea2: linea2.trim() || null,
      ciudad: ciudad.trim(),
      provincia: provincia.trim() || null,
      codigo_postal: codigoPostal.trim() || null,
      es_principal: esPrincipal,
    };

    onSubmit(data);
  };

  const inputClass = (field: string) =>
    `w-full bg-surface-container-low border ${errors[field] ? "border-error" : "border-outline-variant/40"} rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`;

  const labelClass = "font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest";

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-gutter pt-16 sm:pt-4 overflow-y-auto">
      <div className="bg-surface-container-high border border-outline-variant rounded-xl p-lg md:p-xl w-full max-w-[600px] shadow-2xl my-auto">
        <div className="flex items-center justify-between mb-xl">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {isEditing ? "Editar dirección" : "Agregar dirección"}
          </h2>
          <button
            onClick={onCancel}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="space-y-sm">
            <label htmlFor="alias" className={labelClass}>Alias</label>
            <input
              id="alias"
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Ej: Casa, Trabajo"
              className={inputClass("alias")}
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant/60">
              Opcional — un nombre para identificar esta dirección
            </p>
          </div>

          <div className="space-y-sm">
            <label htmlFor="linea1" className={labelClass}>
              Dirección <span className="text-error">*</span>
            </label>
            <input
              id="linea1"
              type="text"
              value={linea1}
              onChange={(e) => setLinea1(e.target.value)}
              placeholder="Calle y número"
              className={inputClass("linea1")}
            />
            {errors.linea1 && (
              <p className="font-label-sm text-label-sm text-error">{errors.linea1}</p>
            )}
          </div>

          <div className="space-y-sm">
            <label htmlFor="linea2" className={labelClass}>Línea 2</label>
            <input
              id="linea2"
              type="text"
              value={linea2}
              onChange={(e) => setLinea2(e.target.value)}
              placeholder="Piso, departamento, etc."
              className={inputClass("linea2")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
            <div className="space-y-sm">
              <label htmlFor="ciudad" className={labelClass}>
                Ciudad <span className="text-error">*</span>
              </label>
              <input
                id="ciudad"
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ciudad"
                className={inputClass("ciudad")}
              />
              {errors.ciudad && (
                <p className="font-label-sm text-label-sm text-error">{errors.ciudad}</p>
              )}
            </div>

            <div className="space-y-sm">
              <label htmlFor="provincia" className={labelClass}>Provincia</label>
              <input
                id="provincia"
                type="text"
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                placeholder="Provincia"
                className={inputClass("provincia")}
              />
            </div>
          </div>

          <div className="space-y-sm">
            <label htmlFor="codigo_postal" className={labelClass}>Código Postal</label>
            <input
              id="codigo_postal"
              type="text"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
              placeholder="Código postal"
              className={inputClass("codigo_postal")}
            />
          </div>

          <label className="flex items-center gap-md cursor-pointer select-none">
            <input
              type="checkbox"
              checked={esPrincipal}
              onChange={(e) => setEsPrincipal(e.target.checked)}
              className="w-5 h-5 rounded border-outline-variant/40 text-primary focus:ring-primary/20 bg-surface-container-low"
            />
            <span className="font-label-lg text-label-lg text-on-surface">
              Establecer como dirección principal
            </span>
          </label>

          <div className="flex justify-end gap-md pt-md border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-xl py-md border border-outline-variant/50 text-on-surface hover:bg-surface-container-low transition-colors font-label-lg text-label-lg rounded-lg disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-xl py-md bg-primary text-on-primary font-label-lg text-label-lg rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                isEditing ? "Guardar cambios" : "Agregar dirección"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
