import axios from 'axios'
import { API_URL } from '@/constants/api'
import { authService } from './auth.service'

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

  getUserDietaryPreferences: async (): Promise<string[]> => {
    try {
      const token = authService.getToken()
      if (!token) {
        return []
      }

      const response = await fetch(`${API_URL}/user/dietary-preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const preferences = await response.json()
        return preferences.map((pref: { name: string }) => pref.name)
      }
      
      return []
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error)
      return []
    }
  },

  setUserDietaryPreferences: async (dietNames: string[]): Promise<boolean> => {
    try {
      const token = authService.getToken()
      if (!token) {
        return false
      }

      const dietsResponse = await fetch(`${API_URL}/diets`)
      if (!dietsResponse.ok) {
        return false
      }

      const availableDiets = await dietsResponse.json()
      const dietIds = dietNames
        .map(name => availableDiets.find((diet: { name: string }) => diet.name === name)?.id)
        .filter(id => id !== undefined)

      const response = await fetch(`${API_URL}/user/dietary-preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dietIds })
      })

      return response.ok
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error)
      return false
    }
  },

  addDietaryPreference: async (dietName: string): Promise<boolean> => {
    try {
      const token = authService.getToken()
      if (!token) {
        return false
      }

      const dietsResponse = await fetch(`${API_URL}/diets`)
      if (!dietsResponse.ok) {
        return false
      }

      const availableDiets = await dietsResponse.json()
      const diet = availableDiets.find((d: { name: string }) => d.name === dietName)
      if (!diet) {
        return false
      }

      const response = await fetch(`${API_URL}/user/dietary-preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dietId: diet.id })
      })

      return response.ok
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la préférence:', error)
      return false
    }
  },

  removeDietaryPreference: async (dietName: string): Promise<boolean> => {
    try {
      const token = authService.getToken()
      if (!token) {
        return false
      }

      const dietsResponse = await fetch(`${API_URL}/diets`)
      if (!dietsResponse.ok) {
        return false
      }

      const availableDiets = await dietsResponse.json()
      const diet = availableDiets.find((d: { name: string }) => d.name === dietName)
      if (!diet) {
        return false
      }

      const response = await fetch(`${API_URL}/user/dietary-preferences/${diet.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      return response.ok
    } catch (error) {
      console.error('Erreur lors de la suppression de la préférence:', error)
      return false
    }
  }
} 