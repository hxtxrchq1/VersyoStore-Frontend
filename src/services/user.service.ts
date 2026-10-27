import api from './api';
import type { User } from '../types';

export const userService = {
  /**
   * Obtener perfil del usuario actual
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/usuario/perfil');
    return response.data;
  },

  /**
   * Actualizar perfil del usuario
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/usuario/perfil', data);
    return response.data;
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(
    contrasenaActual: string,
    nuevaContrasena: string
  ): Promise<{ message: string }> {
    const response = await api.patch('/usuario/cambiar-contrasena', {
      contrasenaActual,
      nuevaContrasena,
    });
    return response.data;
  },

  /**
   * Eliminar cuenta
   */
  async deleteAccount(contrasena: string): Promise<{ message: string }> {
    const response = await api.delete('/usuario/cuenta', {
      data: { contrasena },
    });
    return response.data;
  },

  // ===== ENDPOINTS DE ADMINISTRACIÓN =====

  /**
   * Listar todos los usuarios (admin)
   */
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/usuario/admin/listar');
    return response.data;
  },

  /**
   * Obtener usuario por ID (admin)
   */
  async getUserById(id: number): Promise<User> {
    const response = await api.get<User>(`/usuario/admin/${id}`);
    return response.data;
  },

  /**
   * Crear usuario (admin)
   */
  async createUser(data: any): Promise<User> {
    const response = await api.post<User>('/usuario/admin/crear', data);
    return response.data;
  },

  /**
   * Actualizar usuario (admin)
   */
  async updateUser(id: number, data: any): Promise<User> {
    const response = await api.patch<User>(`/usuario/admin/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar usuario (admin)
   */
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/usuario/admin/${id}`);
  },

  /**
   * Activar/Desactivar usuario (admin)
   */
  async toggleUserActive(id: number, activo: boolean): Promise<User> {
    const response = await api.patch<User>(`/usuario/admin/${id}`, { activo });
    return response.data;
  },

  /**
   * Cambiar rol de usuario (admin)
   */
  async changeUserRole(id: number, rol: 'admin' | 'cliente'): Promise<User> {
    const response = await api.patch<User>(`/usuario/admin/${id}`, { rol });
    return response.data;
  },
};
