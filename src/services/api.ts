import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://backversyoend.chiqo.site';
const PRODUCTION_API_URL = 'https://backversyoend.chiqo.site';

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 30000, // 30 segundos timeout (aumentado para operaciones de email, uploads, etc.)
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores con fallback automático
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _fallback?: boolean };

    // Fallback automático a producción si localhost falla
    if (
      (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response) &&
      !originalRequest._fallback &&
      API_URL !== PRODUCTION_API_URL
    ) {
      console.log('🔄 Backend local no disponible, intentando con producción...');
      originalRequest._fallback = true;
      originalRequest.baseURL = PRODUCTION_API_URL;
      return api(originalRequest);
    }

    // Si es error 401 y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar renovar el token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No hay refresh token, redirigir al login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const baseUrl = originalRequest._fallback ? PRODUCTION_API_URL : API_URL;
        const response = await axios.post(`${baseUrl}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Guardar nuevos tokens
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Reintentar la petición original con el nuevo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, limpiar todo y redirigir al login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
