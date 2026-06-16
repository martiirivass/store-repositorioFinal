import { useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductos, useCategorias } from "../hooks/useProducts";
import { useCartStore } from "@/features/cart/store";
import { getProductImage, HERO_IMAGE, getCloudinaryUrl } from "@/shared/images";
import { formatARS } from "@/shared/currency";
import { PageSkeleton } from "@/shared/components/Skeleton";

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 12;
  const categoria = searchParams.get("categoria") || undefined;
  const { data, isLoading } = useProductos({
    limit,
    offset: page * limit,
    q: search || undefined,
    categoria_id: categoria ? Number(categoria) : undefined,
  });
  const { data: categoriasData } = useCategorias();
  const categorias = (categoriasData as { id: number; nombre: string; imagen_url?: string | null }[] | undefined) || [];
  const inputRef = useRef<HTMLInputElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const seleccionarCategoria = (id: number | null) => {
    setPage(0);
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set("categoria", String(id));
    } else {
      params.delete("categoria");
    }
    setSearchParams(params);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-margin-desktop py-xl">
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

      <div className="mb-xl flex gap-sm">
        <input type="text"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="flex-1 max-w-md bg-surface-container-low border border-outline-variant/40 rounded-lg px-lg py-md font-body-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="Ej: Pizzas" />
        <button
          onClick={() => inputRef.current?.focus()}
          className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-lg hover:brightness-110 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-sm mb-xl">
        <button
          onClick={() => seleccionarCategoria(null)}
          className={`px-md py-sm rounded-full font-label-lg text-label-lg border transition-all ${
            !categoria
              ? "bg-primary text-on-primary border-primary"
              : "bg-surface-container text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
          }`}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => seleccionarCategoria(cat.id)}
            className={`px-md py-sm rounded-full font-label-lg text-label-lg border transition-all ${
              Number(categoria) === cat.id
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-container text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageSkeleton count={8} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
            {(data?.data ?? []).map((p, idx) => (
              <div key={p.id} className="group bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col">
                <Link to={`/producto/${p.id}`} className="relative aspect-square overflow-hidden bg-surface-container-high block">
                  <img
                    src={getCloudinaryUrl(p.imagen_url) || getProductImage(p.id, idx)}
                    alt={p.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="p-lg flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-xs gap-sm">
                    <h3 className="font-title-lg text-title-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1">{p.nombre}</h3>
                    <span className="text-primary font-bold font-title-lg shrink-0">{formatARS(p.precio)}</span>
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
