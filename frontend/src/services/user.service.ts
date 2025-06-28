import axios from 'axios'
import { API_URL } from '@/constants/api.ts'

export interface UserPreferences {
  favoriteCategories: string[]
  dietaryRestrictions: string[]
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  addresses: string[]
  preferences?: UserPreferences
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axios.get<User>(`${API_URL}/user/profile`)
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  },

  updateUserPreferences: async (preferences: UserPreferences): Promise<void> => {
    try {
      await axios.patch(`${API_URL}/user/preferences`, { preferences })
    } catch (error) {
      console.error('Error updating user preferences:', error)
      throw error
    }
  },

  getUserDietaryPreferences: (): string[] => {
    // Récupère les préférences depuis le localStorage en attendant l'authentification
    const preferences = localStorage.getItem('userDietaryPreferences')
    return preferences ? JSON.parse(preferences) : []
  },

  setUserDietaryPreferences: (diets: string[]): void => {
    // Sauvegarde temporaire dans le localStorage
    localStorage.setItem('userDietaryPreferences', JSON.stringify(diets))
  }
} 