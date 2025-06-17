import axios from 'axios';
import type { Pastry, ApiResponse } from '@/types/pastry';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

export const pastryService = {
  async getAllPastries(): Promise<Pastry[]> {
    try {
      const response = await axios.get<ApiResponse<Pastry[]>>(`${API_URL}/pastries`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch pastries');
    } catch (error) {
      console.error('Error fetching pastries:', error);
      throw error;
    }
  },

  async getPastryById(id: string): Promise<Pastry> {
    try {
      const response = await axios.get<ApiResponse<Pastry>>(`${API_URL}/pastries/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch pastry');
    } catch (error) {
      console.error('Error fetching pastry:', error);
      throw error;
    }
  }
}; 