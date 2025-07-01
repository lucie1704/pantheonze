import axios from 'axios'
import { API_URL } from '@/constants/api'
import { authService } from '@/services'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  dietaryRestrictions: string[]
  allergens: string[]
  favoriteCategories: string[]
}

export interface Diet {
  id: string
  name: string
}

class UserService {
  async getUserProfile(): Promise<User> {
    const response = await axios.get<User>(`${API_URL}/users/profile`)
    return response.data
  }

  async updateUserPreferences(preferences: UserPreferences): Promise<void> {
    await axios.patch(`${API_URL}/users/preferences`, { preferences })
  }

  async getAvailableDiets(): Promise<Diet[]> {
    try {
      const response = await fetch(`${API_URL}/users/available-diets`)
      if (!response.ok) {
        throw new Error('Failed to fetch available diets')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching available diets:', error)
      throw error
    }
  }

  async getUserDietaryPreferences(): Promise<Diet[]> {
    try {
      const response = await fetch(`${API_URL}/users/dietary-preferences`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé')
        }
        throw new Error('Erreur lors de la récupération des préférences')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching user dietary preferences:', error)
      throw error
    }
  }

  async updateUserDietaryPreferences(dietIds: string[]): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/dietary-preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ dietIds })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé')
        }
        throw new Error('Erreur lors de la mise à jour des préférences')
      }
    } catch (error) {
      console.error('Error updating user dietary preferences:', error)
      throw error
    }
  }

  async addDietaryPreference(diet: Diet): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/dietary-preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
          dietId: diet.id,
          name: diet.name
        })
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé')
        }
        if (response.status === 409) {
          throw new Error('Cette préférence alimentaire est déjà ajoutée')
        }
        throw new Error('Erreur lors de l\'ajout de la préférence')
      }
    } catch (error) {
      console.error('Error adding dietary preference:', error)
      throw error
    }
  }

  async removeDietaryPreference(diet: Diet): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/users/dietary-preferences/${diet.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé')
        }
        throw new Error('Erreur lors de la suppression de la préférence')
      }
    } catch (error) {
      console.error('Error removing dietary preference:', error)
      throw error
    }
  }
}

export const userService = new UserService() 