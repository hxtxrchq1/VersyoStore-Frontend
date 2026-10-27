import api from './api';
import type { SolicitudMembresia } from '../types';

export const membershipService = {
  /**
   * Solicitar membresía (email es opcional, usa el del usuario autenticado)
   */
  async requestMembership(email?: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>('/membresia/solicitar', email ? { email } : {});
    return response.data;
  },

  /**
   * Obtener mis solicitudes de membresía
   */
  async getMySolicitudes(): Promise<SolicitudMembresia[]> {
    const response = await api.get<SolicitudMembresia[]>('/membresia/mis-solicitudes');
    return response.data;
  },

  /**
   * Verificar si tengo membresía activa
   */
  async verifyMembership(): Promise<{ activa: boolean; tipo?: string; vencimiento?: string }> {
    const response = await api.get('/membresia/verificar');
    return response.data;
  },

  // ===== ENDPOINTS DE ADMINISTRACIÓN =====

  /**
   * Listar todas las solicitudes (admin)
   */
  async getAllSolicitudes(estado?: string): Promise<SolicitudMembresia[]> {
    const params = estado ? `?estado=${estado}` : '';
    const response = await api.get<SolicitudMembresia[]>(`/membresia/admin/solicitudes${params}`);
    return response.data;
  },

  /**
   * Confirmar membresía (admin)
   */
  async confirmMembership(data: {
    solicitud_id: number;
    duracion_meses: number;
  }): Promise<{ message: string }> {
    const response = await api.patch('/membresia/admin/confirmar', data);
    return response.data;
  },

  /**
   * Rechazar solicitud de membresía (admin)
   */
  async rejectMembership(id: number, motivo?: string): Promise<{ message: string }> {
    const response = await api.patch(`/membresia/admin/rechazar/${id}`, { motivo });
    return response.data;
  },
};
