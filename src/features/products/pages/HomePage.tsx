import { Link } from "react-router-dom";
import { useProductos, useCategorias } from "../hooks/useProducts";
import { useCartStore } from "../../../store/cartStore";
import { HERO_IMAGE, PREMIUM_IMAGE, getProductImage, getCategoryImage } from "../../../shared/images";
import { formatARS } from "../../../shared/currency";
import type { CategoriaRead } from "../types";

const FALLBACK_CATEGORIES = ["Pizzas", "Hamburguesas", "Bebidas", "Postres", "Entrantes"];

export function HomePage() {
  const { data } = useProductos({ limit: 8, offset: 0 });
  const { data: categoriasData } = useCategorias();
  const addItem = useCartStore((s) => s.addItem);
  const productos = data?.data || [];
  const categorias = (categoriasData as CategoriaRead[] | undefined) || [];

  return (
    <div className="w-full">
      <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-[15%] right-[8%] w-64 h-64 rounded-full bg-primary/5 blur-3xl z-10 animate-pulse" />
        <div className="absolute bottom-[20%] left-[5%] w-48 h-48 rounded-full bg-tertiary/5 blur-3xl z-10 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[30%] left-[45%] w-36 h-36 rounded-full bg-primary/8 blur-2xl z-10 animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Background image */}
        <img
          src={HERO_IMAGE}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent z-10" />

        <div className="relative z-20 flex flex-col justify-center h-full px-margin-desktop max-w-[1400px] mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 w-fit">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 font-label-sm text-label-sm tracking-wider uppercase">Abierto ahora</span>
          </div>

          <span className="block text-primary font-label-lg text-label-lg tracking-[0.25em] mb-3 uppercase">
            Alta Cocina a Domicilio
          </span>

          <h1 className="font-display-xl text-display-xl text-white mb-6 leading-[1.02] max-w-4xl">
            La Excelencia <span className="text-primary">en Cada Bocado</span>
          </h1>

          <p className="text-on-surface-variant font-body-xl text-body-xl mb-10 max-w-2xl leading-relaxed">
            Ingredientes premium, técnica impecable, y una experiencia gastronómica única
            diseñada para los paladares más exigentes.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              to="/catalogo"
              className="bg-primary text-on-primary font-label-lg text-label-lg px-10 py-4 rounded-xl font-bold
                         hover:brightness-110 hover:shadow-[0_0_24px_rgba(148,204,255,0.4)]
                         transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Explorar Menú
            </Link>
            <button
              className="border border-outline-variant/60 text-on-surface font-label-lg text-label-lg px-10 py-4 rounded-xl
                         hover:bg-white/5 hover:border-outline-variant transition-all backdrop-blur-sm"
            >
              Nuestra Historia
            </button>
          </div>
        </div>
      </section>

      {/* Category Circles — desde backend o fallback hardcodeado */}
      <section className="py-16 px-margin-desktop max-w-[1400px] mx-auto">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {(categorias.length > 0 ? categorias : FALLBACK_CATEGORIES.map((n) => ({ id: 0, nombre: n }))).map((cat) => {
            const img = (cat as CategoriaRead).imagen_url || getCategoryImage(cat.nombre, true);
            return (
              <Link
                key={cat.id || cat.nombre}
                to={`/catalogo?categoria=${cat.id || cat.nombre.toLowerCase()}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-outline-variant group-hover:border-primary transition-colors shadow-lg">
                  {img ? (
                    <img src={img} alt={cat.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant/50">restaurant</span>
                    </div>
                  )}
                </div>
                <span className="font-label-lg text-label-lg text-on-surface-variant group-hover:text-primary transition-colors">{cat.nombre}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="py-16 px-margin-desktop max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Selección Destacada</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">Productos seleccionados para usted</p>
          </div>
          <Link to="/catalogo" className="text-primary font-label-lg text-label-lg flex items-center gap-2 hover:underline">
            Ver todo <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productos.map((p, idx) => (
            <div key={p.id} className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant hover:shadow-[0px_8px_24px_rgba(0,0,0,0.5)] transition-all group">
              <div className="relative h-64 overflow-hidden bg-surface-container-high">
                <img
                  src={p.imagen_url || getProductImage(p.id, idx)}
                  alt={p.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-title-lg text-title-lg text-white mb-2">{p.nombre}</h3>
                <p className="text-on-surface-variant font-body-md text-body-md mb-6 line-clamp-2">{p.descripcion || "Sin descripción"}</p>
                <div className="flex justify-between items-center">
                  <span className="font-headline-md text-headline-md text-primary">{formatARS(p.precio)}</span>
                  <button
                    onClick={() => addItem(p)}
                    className="bg-surface-container-highest text-on-surface font-label-lg text-label-lg px-4 py-2 rounded-lg hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-margin-desktop mb-16 max-w-[1400px] mx-auto">
        <div className="bg-surface-container-high rounded-2xl overflow-hidden flex flex-col md:flex-row items-center border border-outline-variant">
          <div className="w-full md:w-1/2 p-12 lg:p-16">
            <div className="bg-tertiary-container/20 text-tertiary px-3 py-1 rounded inline-block font-label-sm text-label-sm mb-6">EDICIÓN LIMITADA</div>
            <h2 className="font-headline-lg text-headline-lg text-white mb-4">Experiencia Premium</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg mb-8">
              Nuestra selección premium de temporada ahora disponible con un beneficio exclusivo para miembros GASTRO.
            </p>
            <div className="flex items-center gap-6 mb-8">
              <div className="text-display-lg font-display-lg text-primary">20%<span className="text-headline-md"> OFF</span></div>
              <div className="h-12 w-[1px] bg-outline-variant" />
              <div className="text-on-surface font-label-lg text-label-lg uppercase tracking-wider">Código:<br />PREMIUM20</div>
            </div>
            <Link to="/catalogo" className="bg-primary text-on-primary font-label-lg text-label-lg px-10 py-4 rounded-lg font-bold hover:bg-primary/90 transition-all inline-block">
              Ordenar Ahora
            </Link>
          </div>
          <div className="w-full md:w-1/2 h-80 md:h-[450px] overflow-hidden">
            <img
              src={PREMIUM_IMAGE}
              alt="Premium"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
