import axios from 'axios'
import type { Pastry } from '@/types/pastry'
import { API_URL } from '@/constants/api.ts'

export const pastryService = {
  getAllPastries: async (params?: URLSearchParams): Promise<Pastry[]> => {
    try {
      const response = await axios.get<Pastry[]>(`${API_URL}/pastries`, {
        params,
      })
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
