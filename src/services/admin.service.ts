import api from './api';

export interface AdminStats {
  total_productos: number;
  total_pedidos: number;
  total_usuarios: number;
  pedidos_pendientes: number;
  total_ventas: number;
}

export const adminService = {
  /**
   * Obtener estadísticas del dashboard
   */
  async getStats(): Promise<AdminStats> {
    const response = await api.get<AdminStats>('/admin/estadisticas');
    return response.data;
  },
};
