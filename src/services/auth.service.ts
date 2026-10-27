import api from './api';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data, {
      timeout: 45000, // 45 segundos para registro (incluye envío de email)
    });
    return response.data;
  },

  /**
   * Renovar access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  /**
   * Verificar email con token
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  /**
   * Solicitar recuperación de contraseña
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email }, {
      timeout: 45000, // 45 segundos para envío de email de recuperación
    });
    return response.data;
  },

  /**
   * Restablecer contraseña con token
   */
  async resetPassword(token: string, nuevaContrasena: string): Promise<{ message: string }> {
    const response = await api.post(`/auth/reset-password/${token}`, {
      nuevaContrasena,
    });
    return response.data;
  },

  /**
   * Obtener perfil del usuario actual
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/usuario/perfil');
    return response.data;
  },

  /**
   * Enviar código de verificación por email
   */
  async sendVerificationCode(): Promise<{ mensaje: string; expiraEn: string }> {
    const response = await api.post('/auth/send-verification-code', {}, {
      timeout: 60000, // 60 segundos para envío de email (aumentado por problemas en producción)
    });
    return response.data;
  },

  /**
   * Verificar código de 6 dígitos
   */
  async verifyCode(codigo: string): Promise<{ mensaje: string; email_verificado: boolean }> {
    const response = await api.post('/auth/verify-code', { codigo });
    return response.data;
  },

  /**
   * Cerrar sesión (solo limpia localStorage en el cliente)
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};
