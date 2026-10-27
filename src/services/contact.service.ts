import api from './api';
import type { ContactData } from '../types';

export const contactService = {
  /**
   * Enviar mensaje de contacto
   */
  async sendContactMessage(data: ContactData): Promise<{ message: string }> {
    const response = await api.post('/publico/contacto', data);
    return response.data;
  },
};
