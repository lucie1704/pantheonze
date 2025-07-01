import axios from 'axios'
import type { Pastry } from '@/types/pastry'
import { API_URL } from '@/constants/api.ts'

// Type pour la réponse paginée
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export const pastryService = {
  getAllPastries: async (params?: URLSearchParams): Promise<PaginatedResponse<Pastry>> => {
    try {
      const response = await axios.get<PaginatedResponse<Pastry>>(`${API_URL}/pastries`, {
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

  getPastryBySlug: async (slug: string): Promise<Pastry> => {
    try {
      const response = await axios.get<Pastry>(`${API_URL}/pastries/slug/${slug}`)
      return response.data
    } catch (error) {
      console.error('Error fetching pastry by slug:', error)
      throw error
    }
  },

  getPopularPastries: async (limit?: number): Promise<Pastry[]> => {
    try {
      const params = limit ? { limit: limit.toString() } : {}
      const response = await axios.get<Pastry[]>(`${API_URL}/pastries/popular`, {
        params,
      })
      return response.data
    } catch (error) {
      console.error('Error fetching popular pastries:', error)
      throw error
    }
  },

  updatePastry: async (pastry: Partial<Pastry> & { id: string }): Promise<Pastry> => {
    try {
      const response = await axios.put<Pastry>(`${API_URL}/pastries/${pastry.id}`, pastry)
      return response.data
    } catch (error) {
      console.error('Error updating pastry:', error)
      throw error
    }
  },

  createPastry: async (pastry: Partial<Pastry>): Promise<Pastry> => {
    try {
      const response = await axios.post<Pastry>(`${API_URL}/pastries`, pastry)
      return response.data
    } catch (error) {
      console.error('Error creating pastry:', error)
      throw error
    }
  },

  deletePastry: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/pastries/${id}`)
    } catch (error) {
      console.error('Error deleting pastry:', error)
      throw error
    }
  },
}
