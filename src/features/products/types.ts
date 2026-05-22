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

export interface DetallePedidoRead {
  pedido_id: number;
  producto_id: number;
  nombre_snapshot: string;
  precio_snapshot: number;
  cantidad: number;
  subtotal_snap: number;
  personalizacion: string | null;
  created_at: string;
}

export interface HistorialEstadoRead {
  id: number;
  pedido_id: number;
  estado_desde: string | null;
  estado_hacia: string;
  usuario_id: number | null;
  motivo: string | null;
  created_at: string;
}

export interface DireccionRead {
  id: number;
  usuario_id: number;
  alias: string | null;
  linea1: string;
  linea2: string | null;
  ciudad: string;
  provincia: string | null;
  codigo_postal: string | null;
  es_principal: boolean;
  latitud: number | null;
  longitud: number | null;
  created_at: string;
  updated_at: string;
}

export interface PedidoRead {
  id: number;
  usuario_id: number;
  direccion_id: number | null;
  estado_codigo: string;
  forma_pago_codigo: string;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface PedidoReadWithDetalles extends PedidoRead {
  detalles: DetallePedidoRead[];
  historial_estados: HistorialEstadoRead[];
  pagos: PagoRead[];
}

export interface PedidoCreate {
  forma_pago_codigo: string;
  direccion_id?: number | null;
  items: { producto_id: number; cantidad: number }[];
}

export interface DireccionCreate {
  alias?: string | null;
  linea1: string;
  linea2?: string | null;
  ciudad: string;
  provincia?: string | null;
  codigo_postal?: string | null;
  es_principal?: boolean;
}

export interface PagoRead {
  id: number;
  pedido_id: number;
  monto: number;
  forma_pago_codigo: string;
  referencia: string | null;
  created_at: string;
}

export interface FormaPagoRead {
  codigo: string;
  descripcion: string;
  habilitado: boolean;
}
