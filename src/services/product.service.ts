import api from './api';
import type { Producto, FiltrosProductos, PaginatedResponse } from '../types';

export const productService = {
  /**
   * Listar productos públicos con filtros
   */
  async getProducts(filtros?: FiltrosProductos): Promise<PaginatedResponse<Producto>> {
    const params = new URLSearchParams();
    
    if (filtros?.categoria) params.append('categoria', filtros.categoria);
    if (filtros?.temporada) params.append('temporada', filtros.temporada.toString());
    if (filtros?.precio_min) params.append('precio_min', filtros.precio_min.toString());
    if (filtros?.precio_max) params.append('precio_max', filtros.precio_max.toString());
    if (filtros?.buscar) params.append('q', filtros.buscar);
    if (filtros?.orden) params.append('orden', filtros.orden);
    if (filtros?.pagina) params.append('pagina', filtros.pagina.toString());
    if (filtros?.limite) params.append('limite', filtros.limite.toString());

    const response = await api.get<PaginatedResponse<Producto>>(
      `/publico/productos?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Buscar productos por texto
   */
  async searchProducts(q: string, limite?: number): Promise<Producto[]> {
    const params = new URLSearchParams({ q });
    if (limite) params.append('limite', limite.toString());
    
    const response = await api.get<Producto[]>(`/publico/productos/buscar?${params.toString()}`);
    return response.data;
  },

  /**
   * Obtener producto por slug
   */
  async getProductBySlug(slug: string): Promise<Producto> {
    const response = await api.get<Producto>(`/publico/productos/slug/${slug}`);
    return response.data;
  },

  /**
   * Obtener productos por categoría
   */
  async getProductsByCategory(
    identificador: string,
    pagina?: number,
    limite?: number
  ): Promise<PaginatedResponse<Producto>> {
    const params = new URLSearchParams();
    if (pagina) params.append('pagina', pagina.toString());
    if (limite) params.append('limite', limite.toString());

    const response = await api.get<PaginatedResponse<Producto>>(
      `/publico/productos/categoria/${identificador}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Obtener productos por temporada
   */
  async getProductsBySeason(
    id: number,
    pagina?: number,
    limite?: number
  ): Promise<PaginatedResponse<Producto>> {
    const params = new URLSearchParams();
    if (pagina) params.append('pagina', pagina.toString());
    if (limite) params.append('limite', limite.toString());

    const response = await api.get<PaginatedResponse<Producto>>(
      `/publico/productos/temporada/${id}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Obtener productos nuevos
   */
  async getNewProducts(limite?: number): Promise<Producto[]> {
    const params = limite ? `?limite=${limite}` : '';
    const response = await api.get<Producto[]>(`/publico/productos/nuevos${params}`);
    return response.data;
  },

  /**
   * Obtener productos populares
   */
  async getPopularProducts(limite?: number): Promise<Producto[]> {
    const params = limite ? `?limite=${limite}` : '';
    const response = await api.get<Producto[]>(`/publico/productos/populares${params}`);
    return response.data;
  },

  /**
   * Obtener datos para la portada
   */
  async getHomeData(): Promise<{
    destacados: Producto[];
    nuevos: Producto[];
    populares: Producto[];
  }> {
    const response = await api.get('/publico/portada');
    return response.data;
  },

  // ===== ENDPOINTS DE ADMINISTRACIÓN =====

  /**
   * Obtener producto por ID (admin)
   */
  async getById(id: number): Promise<Producto> {
    const response = await api.get<Producto>(`/productos/${id}`);
    return response.data;
  },

  /**
   * Crear producto (admin)
   */
  async create(data: any): Promise<Producto> {
    const response = await api.post<Producto>('/productos', data);
    return response.data;
  },

  /**
   * Crear producto (admin) - alias
   */
  async createProduct(data: any): Promise<Producto> {
    return this.create(data);
  },

  /**
   * Actualizar producto (admin)
   */
  async update(id: number, data: any): Promise<Producto> {
    const response = await api.patch<Producto>(`/productos/${id}`, data);
    return response.data;
  },

  /**
   * Actualizar producto (admin) - alias
   */
  async updateProduct(id: number, data: any): Promise<Producto> {
    return this.update(id, data);
  },

  /**
   * Eliminar producto (admin)
   */
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/productos/${id}`);
  },

  /**
   * Listar todos los productos (admin) - con paginación y filtros
   */
  async getAllProducts(
    pagina: number = 1, 
    limite: number = 20, 
    categoria?: string, 
    busqueda?: string
  ): Promise<PaginatedResponse<Producto>> {
    const params = new URLSearchParams();
    params.append('pagina', pagina.toString());
    params.append('limite', limite.toString());
    params.append('admin', 'true'); // Ver todos los productos en admin
    if (categoria) params.append('categoria', categoria);
    if (busqueda) params.append('buscar', busqueda);
    
    const response = await api.get<PaginatedResponse<Producto>>(
      `/productos?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Cambiar estado del producto (admin)
   */
  async toggleProductStatus(id: number, activo: boolean): Promise<Producto> {
    const response = await api.patch<Producto>(`/admin/productos/${id}/estado`, { activo });
    return response.data;
  },

  /**
   * Actualizar estado activo del producto (admin)
   */
  async updateEstado(id: number, activo: boolean): Promise<Producto> {
    const response = await api.patch<Producto>(`/productos/${id}/estado`, { activo });
    return response.data;
  },

  /**
   * Actualizar destacado del producto (admin)
   */
  async updateDestacado(id: number, destacado: boolean): Promise<Producto> {
    const response = await api.patch<Producto>(`/productos/${id}/recomendado`, { recomendado: destacado });
    return response.data;
  },

  /**
   * Obtener productos destacados
   */
  async getFeaturedProducts(limite?: number): Promise<Producto[]> {
    const params = limite ? `?limite=${limite}` : '';
    const response = await api.get<Producto[]>(`/productos/recomendado/list${params}`);
    return response.data;
  },
};
