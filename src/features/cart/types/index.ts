import type { ProductoReadWithRelations } from '@/features/products/types';

export interface CartItem {
  producto: ProductoReadWithRelations;
  cantidad: number;
  personalizacion?: string | null;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
