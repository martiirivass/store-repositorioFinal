import { useState } from "react";
import { useProductos } from "../hooks/useProducts";
import { useCartStore } from "../../../store/cartStore";
import { getProductImage, HERO_IMAGE } from "../../../shared/images";

export function CatalogPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 12;
  const { data, isLoading } = useProductos({ limit, offset: page * limit, q: search || undefined });
  const addItem = useCartStore((s) => s.addItem);
  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="max-w-[1280px] mx-auto px-margin-desktop py-xl">
      <section className="relative h-[280px] rounded-lg overflow-hidden mb-2xl border border-outline-variant">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center px-2xl">
          <span className="text-primary font-label-lg mb-sm tracking-widest uppercase">Catálogo</span>
          <h1 className="font-display-lg text-display-lg text-white mb-md">Descubra Nuestra Carta</h1>
          <p className="text-on-surface-variant font-body-lg mb-xl max-w-xl">
            Ingredientes frescos seleccionados diariamente para una experiencia culinaria única.
          </p>
        </div>
      </section>

      <div className="mb-xl">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full bg-surface-container border border-outline-variant rounded-full pl-xl pr-md py-sm text-body-md focus:outline-none focus:border-primary transition-colors"
            placeholder="Buscar sabor..."
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-xl text-on-surface-variant">Cargando...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
            {data?.data.map((p, idx) => (
              <div key={p.id} className="group bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={getProductImage(p.id, idx)}
                    alt={p.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-lg flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-xs gap-sm">
                    <h3 className="font-title-lg text-title-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1">{p.nombre}</h3>
                    <span className="text-primary font-bold font-title-lg shrink-0">${p.precio.toFixed(2)}</span>
                  </div>
                  <p className="text-body-md text-on-surface-variant mb-xl line-clamp-2 flex-1">{p.descripcion || "Sin descripción"}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.categorias?.map((c) => (
                      <span key={c.id} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant">{c.nombre}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => addItem(p)}
                    className="w-full bg-surface-container-highest text-on-surface-variant border border-outline-variant py-sm rounded-lg font-bold font-label-lg hover:bg-primary hover:text-on-primary hover:border-primary transition-all flex items-center justify-center gap-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2xl flex justify-center items-center gap-md">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="p-sm rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-30">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-lg transition-all ${i === page ? "bg-primary text-on-primary font-bold" : "border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="p-sm rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-30">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
