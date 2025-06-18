import axios from 'axios'
import type { Pastry, ApiResponse } from '@/types/pastry'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api'

export const pastryService = {
  getAllPastries: async (): Promise<Pastry[]> => {
    try {
      const response = await axios.get<Pastry[]>(`${API_URL}/pastries`)
      return response.data
    } catch (error) {
      console.error('Error fetching pastries:', error)
      throw error
    }
  },

  getPastryById: async (id: string): Promise<Pastry> => {
    try {
      const response = await axios.get<Pastry>(`${API_URL}/pastries/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching pastry:', error)
      throw error
    }
  },
}
