import api from './api';
import type { Pedido, CrearPedidoDto, PaginatedResponse } from '../types';

export const orderService = {
  /**
   * Crear pedido desde el carrito (checkout)
   */
  async createOrder(data: CrearPedidoDto): Promise<Pedido> {
    const response = await api.post<Pedido>('/pedido/checkout', data, {
      timeout: 45000, // 45 segundos para crear pedido (incluye email de confirmación)
    });
    return response.data;
  },

  /**
   * Obtener mis pedidos
   */
  async getMyOrders(): Promise<Pedido[]> {
    const response = await api.get<Pedido[]>('/pedido/mis-pedidos');
    return response.data;
  },

  /**
   * Obtener detalle de un pedido
   */
  async getOrderById(id: number): Promise<Pedido> {
    const response = await api.get<Pedido>(`/pedido/${id}`);
    return response.data;
  },

  /**
   * Cancelar pedido
   */
  async cancelOrder(id: number): Promise<Pedido> {
    const response = await api.patch<Pedido>(`/pedido/${id}/cancelar`);
    return response.data;
  },

  /**
   * Consultar pedidos por email (sin autenticación)
   */
  async getOrdersByEmail(email: string): Promise<Pedido[]> {
    const response = await api.get<Pedido[]>(`/pedido/publico/consultar?email=${email}`);
    return response.data;
  },

  // ===== ENDPOINTS DE ADMINISTRACIÓN =====

  /**
   * Listar todos los pedidos (admin)
   */
  async getAllOrders(estado?: string, pagina: number = 1, limite: number = 20): Promise<PaginatedResponse<Pedido>> {
    const params = new URLSearchParams();
    if (estado) params.append('estado', estado);
    params.append('pagina', pagina.toString());
    params.append('limite', limite.toString());

    const response = await api.get<PaginatedResponse<Pedido>>(
      `/admin/pedidos?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Obtener pedido por ID (admin)
   */
  async getOrderByIdAdmin(id: number): Promise<Pedido> {
    const response = await api.get<Pedido>(`/admin/pedidos/${id}`);
    return response.data;
  },

  /**
   * Actualizar estado del pedido (admin)
   */
  async updateOrderStatus(id: number, estado: string): Promise<Pedido> {
    const response = await api.patch<Pedido>(`/admin/pedidos/${id}/estado`, { estado });
    return response.data;
  },

  /**
   * Actualizar tracking del pedido (admin)
   */
  async updateOrderTracking(
    id: number,
    codigo_tracking: string,
    agencia_envio?: string
  ): Promise<Pedido> {
    const response = await api.patch<Pedido>(`/admin/pedidos/${id}/tracking`, {
      codigo_tracking,
      agencia_envio,
    });
    return response.data;
  },
};
