import { useState } from "react";
import type { DireccionRead } from "@/features/orders/types";

interface DireccionCardProps {
  direccion: DireccionRead;
  onEdit: (direccion: DireccionRead) => void;
  onDelete: (id: number) => void;
  onMarcarPrincipal: (id: number) => void;
}

export function DireccionCard({ direccion, onEdit, onDelete, onMarcarPrincipal }: DireccionCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <article className="bg-surface-container-high border border-outline-variant rounded-xl p-xl hover:border-outline transition-all">
        <div className="flex items-start justify-between gap-lg">
          <div className="space-y-1 flex-grow min-w-0">
            <div className="flex items-center gap-md flex-wrap">
              <h3 className="font-title-lg text-title-lg text-on-surface truncate">
                {direccion.alias || `Dirección ${direccion.id}`}
              </h3>
              {direccion.es_principal && (
                <span className="px-md py-base rounded-lg bg-primary/10 text-primary font-label-sm text-label-sm border border-primary/20 whitespace-nowrap">
                  Principal
                </span>
              )}
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {direccion.linea1}
              {direccion.linea2 ? `, ${direccion.linea2}` : ""}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {direccion.ciudad}
              {direccion.provincia ? `, ${direccion.provincia}` : ""}
              {direccion.codigo_postal ? ` (CP: ${direccion.codigo_postal})` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-md mt-lg pt-md border-t border-outline-variant/30">
          <button
            onClick={() => onEdit(direccion)}
            className="inline-flex items-center gap-xs px-lg py-sm border border-outline-variant/50 text-on-surface hover:bg-surface-container-low transition-colors font-label-sm text-label-sm rounded-lg"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Editar
          </button>

          {!direccion.es_principal && (
            <button
              onClick={() => onMarcarPrincipal(direccion.id)}
              className="inline-flex items-center gap-xs px-lg py-sm border border-outline-variant/50 text-on-surface hover:bg-surface-container-low transition-colors font-label-sm text-label-sm rounded-lg"
            >
              <span className="material-symbols-outlined text-lg">star</span>
              Marcar como principal
            </button>
          )}

          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-xs px-lg py-sm border border-error/50 text-error hover:bg-error/10 transition-colors font-label-sm text-label-sm rounded-lg ml-auto"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
            Eliminar
          </button>
        </div>
      </article>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-high border border-outline-variant rounded-xl p-xl max-w-[400px] w-full mx-4 sm:mx-gutter shadow-2xl">
            <div className="flex items-center gap-md mb-md">
              <span className="material-symbols-outlined text-error text-2xl">warning</span>
              <h3 className="font-title-lg text-title-lg text-on-surface">Eliminar dirección</h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
              ¿Estás seguro de que querés eliminar esta dirección?
            </p>
            <div className="flex justify-end gap-md">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-lg py-sm border border-outline-variant/50 text-on-surface hover:bg-surface-container-low transition-colors font-label-sm text-label-sm rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDelete(direccion.id);
                  setShowConfirm(false);
                }}
                className="px-lg py-sm bg-error text-on-error font-label-sm text-label-sm rounded-lg hover:opacity-90 transition-all active:scale-95"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
