import api from './api';

export const uploadService = {
  /**
   * Subir una imagen al servidor
   */
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ url: string; filename: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 segundos para upload de imágenes
    });

    return response.data;
  },

  /**
   * Subir múltiples imágenes
   */
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post<{ urls: string[] }>('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 120 segundos (2 minutos) para múltiples imágenes
    });

    return response.data.urls;
  },

  /**
   * Eliminar una imagen del servidor
   */
  async deleteImage(filename: string): Promise<{ message: string }> {
    const response = await api.delete(`/upload/${filename}`);
    return response.data;
  },
};
