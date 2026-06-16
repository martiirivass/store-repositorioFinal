import { Link } from "react-router-dom";
import { useCartStore } from "@/features/cart/store";
import { getProductImage, getCloudinaryUrl } from "@/shared/images";
import { formatARS } from "@/shared/currency";

export function CartPage() {
  const { items, updateCantidad, removeItem, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-margin-desktop py-2xl text-center">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-lg">shopping_cart</span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">Tu carrito está vacío</h2>
        <p className="text-on-surface-variant font-body-lg mb-xl">Agregá productos del catálogo para empezar.</p>
        <Link to="/catalogo" className="bg-primary text-on-primary font-label-lg px-8 py-4 rounded-lg font-bold hover:brightness-110 transition-all inline-block">
          Explorar Menú
        </Link>
      </div>
    );
  }

  return (
      <div className="max-w-[1400px] mx-auto px-margin-desktop py-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-7 space-y-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-lg">Tu Carrito ({items.length} items)</h1>
          <div className="space-y-md">
            {items.map((item) => (
              <div key={item.producto_id} className="bg-surface-container rounded-lg p-md flex flex-col sm:flex-row items-start sm:items-center gap-lg border border-outline-variant/30 hover:border-primary/50 transition-all duration-300">
                <div className="w-full sm:w-24 h-48 sm:h-24 rounded overflow-hidden shrink-0 bg-surface-container-high">
                  <img
                    src={getCloudinaryUrl(item.imagen_url) || getProductImage(item.producto_id, item.producto_id)}
                    alt={item.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-title-lg text-title-lg text-on-surface">{item.nombre}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{formatARS(item.precio)} c/u</p>
                  <div className="flex items-center gap-lg mt-md">
                    <div className="flex items-center bg-surface-container-highest rounded px-sm py-xs border border-outline-variant/50">
                      <button onClick={() => updateCantidad(item.producto_id, item.cantidad - 1)} className="text-primary hover:text-primary-fixed transition-colors">
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="mx-md font-label-lg text-label-lg w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => updateCantidad(item.producto_id, item.cantidad + 1)} className="text-primary hover:text-primary-fixed transition-colors">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.producto_id)} className="text-error font-label-sm text-label-sm uppercase tracking-widest flex items-center gap-xs hover:opacity-80 transition-opacity">
                      <span className="material-symbols-outlined text-[18px]">delete</span> Eliminar
                    </button>
                  </div>
                </div>
                <div className="sm:text-right w-full sm:w-auto pt-md sm:pt-0 border-t sm:border-t-0 border-outline-variant/20">
                  <span className="font-headline-md text-headline-md text-on-surface">{formatARS(item.precio * item.cantidad)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-surface-container-high rounded-lg p-xl border border-outline-variant/30 sticky top-24 shadow-2xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xl">Resumen</h2>
            <div className="space-y-md">
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span className="text-on-surface">{formatARS(getTotal())}</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>Envío Gourmet</span>
                <span className="text-secondary font-medium">Gratis</span>
              </div>
              <div className="flex justify-between font-headline-md text-headline-md text-on-surface pt-md border-t border-outline-variant/20">
                <span>Total</span>
                <span className="text-primary">{formatARS(getTotal())}</span>
              </div>
            </div>
            <Link to="/checkout"
              className="w-full bg-primary text-on-primary py-lg rounded font-headline-md text-headline-md font-bold hover:brightness-110 transition-all flex items-center justify-center gap-md active:scale-[0.98] duration-150 shadow-lg shadow-primary/20 mt-xl"
            >
              Proceder al Pago <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
