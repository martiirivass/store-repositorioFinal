export interface CategoriaRead {
  id: number;
  nombre: string;
  descripcion: string | null;
  parent_id: number | null;
  imagen_url: string | null;
}

export interface ProductoRead {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  precio: number; // alias property
  imagenes_url: string | null;
  imagen_url: string | null;
  stock_cantidad: number;
  disponible: boolean;
}

export interface ProductoReadWithRelations extends ProductoRead {
  categorias: CategoriaRead[];
  ingredientes: { id: number; nombre: string; descripcion: string | null; es_alergeno: boolean }[];
}
