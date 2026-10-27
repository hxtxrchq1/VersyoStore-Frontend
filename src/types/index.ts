// ============================================
// TIPOS PRINCIPALES DEL SISTEMA VERSYO
// ============================================

// Usuario
export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido?: string;
  rol: 'admin' | 'cliente';
  telefono?: string;
  direccion?: string;
  dni?: string;
  ciudad?: string;
  codigo_postal?: string;
  pais?: string;
  email_verificado: boolean;
  activo?: boolean;
  tiene_membresia?: boolean;
  fecha_membresia?: string;
  createdAt?: string;
  updatedAt?: string;
  creado_en?: string;
}

// Autenticación
export interface AuthResponse {
  user?: User;
  usuario?: User; // El backend devuelve 'usuario' en vez de 'user'
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  contrasena: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  contrasena: string;
  telefono?: string;
}

// Producto
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  precio_oferta?: number;
  sku: string;
  slug: string;
  genero?: string; // 'hombre', 'mujer', 'ambos'
  activo: boolean;
  recomendado: boolean;
  nuevo: boolean;
  stock_total: number;
  imagenes: string[];
  imagen_principal?: string; // Para items de pedidos
  categoria?: Categoria;
  temporada?: Temporada;
  variaciones?: Variacion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Variacion {
  id: number;
  producto_id: number;
  talla?: string;
  color?: string;
  codigo_color?: string;
  imagen_url?: string;
  stock: number;
  sku?: string;
  sku_variacion?: string;
  activo?: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  activo: boolean;
}

export interface Temporada {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  activo: boolean;
}

// Pedido
export interface Pedido {
  id: number;
  usuario_id: number;
  usuario?: User; // Relación con usuario
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  subtotal: number;
  descuento: number;
  envio: number;
  total: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  direccion: string;
  direccionEnvio?: string; // Alias para compatibilidad
  ciudad: string;
  codigo_postal: string;
  pais: string;
  metodoPago?: string; // Método de pago
  notas?: string;
  codigo_tracking?: string;
  numero_seguimiento?: string; // Alias para código de seguimiento
  agencia_envio?: string;
  cupon_usado?: string;
  items: ItemPedido[];
  createdAt?: string; // Para pedidos normales
  creado_en?: string; // Para respuesta del admin
  updatedAt?: string;
  voucher_url?: string; // URL del voucher de pago
  metodo_pago?: 'yape' | 'bcp'; // Método de pago usado
}

export interface ItemPedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  variacion_id?: number;
  nombre_producto: string;
  nombre?: string; // Alias para nombre_producto
  precio_unitario: number;
  precioUnitario?: number; // Alias para compatibilidad
  cantidad: number;
  subtotal: number;
  color?: string; // Propiedades de la variación
  talla?: string;
  producto?: Producto;
  variacion?: Variacion;
}

export interface CrearPedidoDto {
  items: Array<{
    productoId: number;
    variacionId?: number;
    cantidad: number;
    precioUnitario: number;
    color?: string;
    talla?: string;
  }>;
  nombre_receptor: string;
  direccion_envio: string;
  ciudad: string;
  region: string;
  pais: string;
  telefono_contacto: string;
  cupon_codigo?: string;
  metodo_pago?: string;
  voucher_url?: string;
  notas?: string;
  costo_envio?: number;
}

// Carrito
export interface CarritoItem {
  id: number;
  carrito_id: number;
  producto_id: number;
  variacion_id?: number;
  cantidad: number;
  producto: Producto;
  variacion?: Variacion;
}

// CartItem para el carrito del contexto
export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
  variacion?: {
    id: number;
    color?: string;
    talla?: string;
    stock: number;
  };
}

// Membresía
export interface SolicitudMembresia {
  id: number;
  usuario_id: number;
  tipo: 'mensual' | 'anual';
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  metodo_pago?: string;
  referencia_pago?: string;
  motivo_rechazo?: string;
  createdAt: string;
  updatedAt: string;
}

// Filtros y Paginación
export interface FiltrosProductos {
  categoria?: string;
  temporada?: number;
  precio_min?: number;
  precio_max?: number;
  buscar?: string;
  orden?: 'precio_asc' | 'precio_desc' | 'nombre_asc' | 'nombre_desc' | 'nuevo';
  pagina?: number;
  limite?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  productos?: T[];
  pedidos?: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

// Formulario de contacto
export interface ContactData {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

// Estadísticas Admin
export interface Estadisticas {
  totalVentas: number;
  totalPedidos: number;
  totalUsuarios: number;
  totalProductos: number;
  ventasPorMes?: Array<{
    mes: string;
    total: number;
  }>;
  pedidosPorEstado?: Array<{
    estado: string;
    cantidad: number;
  }>;
}

// Respuestas de API
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
