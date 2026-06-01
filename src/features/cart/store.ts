import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  producto_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url?: string | null;
}

interface CartStore {
  items: CartItem[];
  addItem: (producto: { id: number; nombre: string; precio: number; imagen_url?: string | null }) => void;
  removeItem: (producto_id: number) => void;
  updateCantidad: (producto_id: number, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (producto) => {
        const items = get().items;
        const existing = items.find((i) => i.producto_id === producto.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.producto_id === producto.id
                ? { ...i, cantidad: i.cantidad + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                producto_id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
                imagen_url: producto.imagen_url,
              },
            ],
          });
        }
      },

      removeItem: (producto_id) => {
        set({ items: get().items.filter((i) => i.producto_id !== producto_id) });
      },

      updateCantidad: (producto_id, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(producto_id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.producto_id === producto_id ? { ...i, cantidad } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => get().items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),

      getCount: () => get().items.reduce((sum, i) => sum + i.cantidad, 0),
    }),
    { name: "gastro-cart" }
  )
);
