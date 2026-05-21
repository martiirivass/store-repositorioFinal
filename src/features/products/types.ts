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
  precio: number;
  imagen_url: string | null;
  stock_cantidad: number;
  disponible: boolean;
}

export interface ProductoReadWithRelations extends ProductoRead {
  categorias: CategoriaRead[];
  ingredientes: { id: number; nombre: string; descripcion: string | null; es_alergeno: boolean }[];
}

export interface DetallePedidoRead {
  id: number;
  producto_id: number;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

export interface HistorialEstadoRead {
  id: number;
  estado_pedido_id: number;
  fecha: string;
  observacion: string | null;
}

export interface DireccionRead {
  id: number;
  alias: string;
  direccion: string;
  ciudad: string;
  provincia: string | null;
  codigo_postal: string | null;
  principal: boolean;
}

export interface PedidoReadWithDetalles {
  id: number;
  usuario_id: number;
  fecha: string;
  total: number;
  estado_actual_id: number;
  forma_pago_id: number;
  direccion_entrega_id: number | null;
  activo: boolean;
  detalles: DetallePedidoRead[];
  historial_estados: HistorialEstadoRead[];
  estado_actual?: { id: number; codigo: string; nombre: string };
}

export interface PedidoCreate {
  forma_pago_id: number;
  direccion_entrega_id?: number | null;
  items: { producto_id: number; cantidad: number }[];
}

export interface DireccionCreate {
  alias: string;
  direccion: string;
  ciudad: string;
  provincia?: string | null;
  codigo_postal?: string | null;
}
