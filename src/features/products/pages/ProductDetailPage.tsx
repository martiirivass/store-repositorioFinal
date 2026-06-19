import { useParams, useNavigate, Link } from "react-router-dom";
import { useProducto } from "../hooks/useProducts";
import { useCartStore } from "@/features/cart/store";
import { getCloudinaryUrl } from "@/shared/images";
import { formatARS } from "@/shared/currency";
import { ProductDetailSkeleton } from "@/shared/components/Skeleton";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productoId = Number(id);
  const { data: producto, isLoading, isError } = useProducto(productoId);
  const addItem = useCartStore((s) => s.addItem);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !producto) {
    return (
      <div className="max-w-[1400px] mx-auto px-gutter md:px-margin-desktop py-2xl text-center">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-lg">search_off</span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">Producto no encontrado</h2>
        <p className="text-on-surface-variant font-body-lg mb-xl">El producto que buscás no existe o fue eliminado.</p>
        <Link to="/catalogo" className="bg-primary text-on-primary font-label-lg px-8 py-4 rounded-lg font-bold hover:brightness-110 transition-all inline-block">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const tieneStock = producto.disponible && producto.stock_cantidad > 0;
  const ingredientesConAlergeno = producto.ingredientes?.filter((i) => i.es_alergeno) || [];
  const ingredientesSinAlergeno = producto.ingredientes?.filter((i) => !i.es_alergeno) || [];

  return (
    <div className="max-w-[1400px] mx-auto px-gutter md:px-margin-desktop py-xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors mb-xl font-label-lg">
        <span className="material-symbols-outlined">arrow_back</span>
        Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-6">
          <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/30 flex items-center justify-center">
            {getCloudinaryUrl(producto.imagen_url) ? (
              <img
                src={getCloudinaryUrl(producto.imagen_url)}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">image</span>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-lg">
          <div>
            <div className="flex flex-wrap gap-2 mb-md">
              {producto.categorias?.map((c) => (
                <Link
                  key={c.id}
                  to={`/catalogo?categoria=${c.id}`}
                  className="text-[11px] px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors"
                >
                  {c.nombre}
                </Link>
              ))}
            </div>

            <h1 className="font-display-lg text-display-lg text-on-surface mb-md">{producto.nombre}</h1>

            <div className="flex items-baseline gap-md mb-lg">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">{formatARS(producto.precio)}</span>
              {producto.precio_base !== producto.precio && (
                <span className="font-title-lg text-title-lg text-on-surface-variant line-through">{formatARS(producto.precio_base)}</span>
              )}
            </div>

            <div className="flex items-center gap-md mb-lg">
              {tieneStock ? (
                <span className="inline-flex items-center gap-1 text-green-400 font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  En stock ({producto.stock_cantidad} uds.)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-error font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-error" />
                  Sin stock
                </span>
              )}
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-lg border border-outline-variant/30">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Descripción</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {producto.descripcion || "Sin descripción disponible."}
            </p>
          </div>

          {producto.ingredientes && producto.ingredientes.length > 0 && (
            <div className="bg-surface-container-low rounded-xl p-lg border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Ingredientes</h2>

              {ingredientesConAlergeno.length > 0 && (
                <div className="mb-md">
                  <p className="font-label-sm text-label-sm text-error uppercase tracking-widest mb-sm flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    Alérgenos
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ingredientesConAlergeno.map((ing) => (
                      <span key={ing.id} className="px-3 py-1 rounded-full bg-error/15 text-error border border-error/30 text-[12px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {ing.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ingredientesSinAlergeno.length > 0 && (
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-sm">Ingredientes</p>
                  <div className="flex flex-wrap gap-2">
                    {ingredientesSinAlergeno.map((ing) => (
                      <span key={ing.id} className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-[12px]">
                        {ing.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => addItem(producto)}
            disabled={!tieneStock}
            className="w-full bg-primary text-on-primary py-lg rounded-xl font-headline-md text-headline-md font-bold hover:brightness-110 transition-all flex items-center justify-center gap-md active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
            {tieneStock ? "Agregar al Carrito" : "No disponible"}
          </button>
        </div>
      </div>
    </div>
  );
}
