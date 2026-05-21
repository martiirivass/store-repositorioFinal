import { Link } from "react-router-dom";
import { useProductos } from "../hooks/useProducts";
import { useCartStore } from "../../../store/cartStore";
import { HERO_IMAGE, PREMIUM_IMAGE, getProductImage, getCategoryImage } from "../../../shared/images";

const CATEGORIES = ["Pizzas", "Hamburguesas", "Bebidas", "Postres", "Entrantes"];

export function HomePage() {
  const { data } = useProductos({ limit: 8, offset: 0 });
  const addItem = useCartStore((s) => s.addItem);
  const productos = data?.data || [];

  return (
    <div className="max-w-[1280px] mx-auto">
      <section className="relative w-full h-[600px] overflow-hidden mt-6 rounded-xl mx-gutter">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10" />
        <img
          src={HERO_IMAGE}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center h-full px-margin-desktop max-w-2xl">
          <span className="text-primary font-label-lg text-label-lg tracking-[0.2em] mb-4 uppercase">Alta Cocina a Domicilio</span>
          <h1 className="font-display-lg text-display-lg text-white mb-8 leading-tight">La Excelencia en Cada Bocado</h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg mb-10 max-w-lg">
            Descubra una curaduría gastronómica diseñada para los paladares más exigentes, donde la técnica y el ingrediente se encuentran.
          </p>
          <div className="flex gap-4">
            <Link to="/catalogo" className="bg-primary-container text-white font-label-lg text-label-lg px-8 py-4 rounded-lg font-bold hover:brightness-110 transition-all transform active:scale-95">
              Explorar Menú
            </Link>
            <button className="border-[1.5px] border-[#597a99] text-[#597a99] font-label-lg text-label-lg px-8 py-4 rounded-lg font-bold hover:bg-[#597a99]/10 transition-all">
              Nuestra Historia
            </button>
          </div>
        </div>
      </section>

      {/* Category Circles — como en Stitch */}
      <section className="py-12 px-margin-desktop">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {CATEGORIES.map((cat) => {
            const img = getCategoryImage(cat);
            return (
              <Link
                key={cat}
                to={`/catalogo?categoria=${cat.toLowerCase()}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-outline-variant group-hover:border-primary transition-colors shadow-lg">
                  {img ? (
                    <img src={img} alt={cat} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant/50">restaurant</span>
                    </div>
                  )}
                </div>
                <span className="font-label-lg text-label-lg text-on-surface-variant group-hover:text-primary transition-colors">{cat}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="py-16 px-margin-desktop">
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
              <div className="relative h-64 overflow-hidden">
                <img
                  src={getProductImage(p.id, idx)}
                  alt={p.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-title-lg text-title-lg text-white mb-2">{p.nombre}</h3>
                <p className="text-on-surface-variant font-body-md text-body-md mb-6 line-clamp-2">{p.descripcion || "Sin descripción"}</p>
                <div className="flex justify-between items-center">
                  <span className="font-headline-md text-headline-md text-primary">${p.precio.toFixed(2)}</span>
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

      <section className="px-margin-desktop mb-16">
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
