import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import {
  useDirecciones,
  useCrearDireccion,
  useActualizarDireccion,
  useEliminarDireccion,
  useMarcarPrincipal,
} from "@/features/orders/hooks/usePedidos";
import type { DireccionRead, DireccionCreate } from "@/features/orders/types";
import { Skeleton } from "@/shared/components/Skeleton";
import { DireccionCard } from "@/features/direcciones/components/DireccionCard";
import { DireccionForm } from "@/features/direcciones/components/DireccionForm";

export function MisDireccionesPage() {
  const { data: direcciones, isLoading } = useDirecciones();
  const { mutate: crearDireccion, isPending: isCreating } = useCrearDireccion();
  const { mutate: actualizarDireccion, isPending: isUpdating } = useActualizarDireccion();
  const { mutate: eliminarDireccion } = useEliminarDireccion();
  const { mutate: marcarPrincipal } = useMarcarPrincipal();
  const { isLogged } = useAuthStore();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingDireccion, setEditingDireccion] = useState<DireccionRead | undefined>();

  const isSubmitting = isCreating || isUpdating;

  const handleAdd = () => {
    setEditingDireccion(undefined);
    setShowForm(true);
  };

  const handleEdit = (direccion: DireccionRead) => {
    setEditingDireccion(direccion);
    setShowForm(true);
  };

  const handleFormSubmit = (data: DireccionCreate) => {
    if (editingDireccion) {
      actualizarDireccion(
        { id: editingDireccion.id, data },
        { onSuccess: () => { setShowForm(false); setEditingDireccion(undefined); } },
      );
    } else {
      crearDireccion(data, { onSuccess: () => setShowForm(false) });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDireccion(undefined);
  };

  // ─── No autenticado ────────────────────────────────────────────────
  if (!isLogged) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-gutter py-xl">
      <header className="mb-xl flex flex-col sm:flex-row sm:items-center justify-between gap-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Mis Direcciones</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Gestioná tus direcciones de envío.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-md px-xl py-md bg-primary text-on-primary font-label-lg text-label-lg rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10 whitespace-nowrap"
        >
          <span className="material-symbols-outlined">add</span>
          Agregar dirección
        </button>
      </header>

      {/* ─── Loading ──────────────────────────────────────────────── */}
      {isLoading && (
        <div className="space-y-lg">
          {[1, 2].map((n) => (
            <div key={n} className="bg-surface-container-high border border-outline-variant rounded-xl p-xl space-y-lg">
              <div className="flex justify-between">
                <div className="space-y-md flex-grow">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full max-w-sm" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="flex gap-md pt-md border-t border-outline-variant/30">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-44" />
                <Skeleton className="h-10 w-24 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Vacío ────────────────────────────────────────────────── */}
      {!isLoading && direcciones && direcciones.length === 0 && (
        <div className="text-center py-2xl">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-lg">
            location_off
          </span>
          <p className="text-on-surface-variant font-body-lg mb-lg">
            No tenés direcciones cargadas.
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-md px-xl py-md bg-primary text-on-primary font-label-lg text-label-lg rounded-lg font-bold hover:opacity-90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add_location</span>
            Agregar dirección
          </button>
        </div>
      )}

      {/* ─── Lista ────────────────────────────────────────────────── */}
      {!isLoading && direcciones && direcciones.length > 0 && (
        <div className="space-y-lg">
          {direcciones.map((direccion) => (
            <DireccionCard
              key={direccion.id}
              direccion={direccion}
              onEdit={handleEdit}
              onDelete={(id) => eliminarDireccion(id)}
              onMarcarPrincipal={(id) => marcarPrincipal(id)}
            />
          ))}
        </div>
      )}

      {/* ─── Formulario modal ─────────────────────────────────────── */}
      {showForm && (
        <DireccionForm
          direccion={editingDireccion}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
