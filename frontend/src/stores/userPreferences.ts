import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '@/services'
import axios from 'axios'
import { API_URL } from '@/constants/api'

export const useUserPreferencesStore = defineStore('userPreferences', () => {
  // State
  const userDietaryPreferences = ref<string[]>([])
  const availableDiets = ref<{ id: string; name: string }[]>([])
  const isLoading = ref(false)
  const isLoaded = ref(false)

  // Getters
  const hasPreferences = computed(() => userDietaryPreferences.value.length > 0)
  const preferenceNames = computed(() => userDietaryPreferences.value)

  // Actions
  const loadAvailableDiets = async () => {
    try {
      isLoading.value = true
      const response = await axios.get(`${API_URL}/diets`)
      availableDiets.value = response.data
    } catch (error) {
      console.error('Erreur lors du chargement des régimes disponibles:', error)
    } finally {
      isLoading.value = false
    }
  }

  const loadUserPreferences = async () => {
    try {
      isLoading.value = true
      const preferences = await userService.getUserDietaryPreferences()
      userDietaryPreferences.value = preferences
      isLoaded.value = true
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updatePreferences = async (dietNames: string[]) => {
    try {
      isLoading.value = true
      const success = await userService.setUserDietaryPreferences(dietNames)
      if (success) {
        userDietaryPreferences.value = dietNames
      }
      return success
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const addPreference = async (dietName: string) => {
    try {
      isLoading.value = true
      const success = await userService.addDietaryPreference(dietName)
      if (success) {
        if (!userDietaryPreferences.value.includes(dietName)) {
          userDietaryPreferences.value.push(dietName)
        }
      }
      return success
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la préférence:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const removePreference = async (dietName: string) => {
    try {
      isLoading.value = true
      const success = await userService.removeDietaryPreference(dietName)
      if (success) {
        userDietaryPreferences.value = userDietaryPreferences.value.filter(name => name !== dietName)
      }
      return success
    } catch (error) {
      console.error('Erreur lors de la suppression de la préférence:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearPreferences = async () => {
    try {
      isLoading.value = true
      const success = await userService.setUserDietaryPreferences([])
      if (success) {
        userDietaryPreferences.value = []
      }
      return success
    } catch (error) {
      console.error('Erreur lors de la suppression des préférences:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const initialize = async () => {
    if (availableDiets.value.length === 0) {
      await loadAvailableDiets()
    }
    
    if (!isLoaded.value) {
      await loadUserPreferences()
    }
  }

  return {
    // State
    userDietaryPreferences,
    availableDiets,
    isLoading,
    isLoaded,
    
    // Getters
    hasPreferences,
    preferenceNames,
    
    // Actions
    loadAvailableDiets,
    loadUserPreferences,
    updatePreferences,
    addPreference,
    removePreference,
    clearPreferences,
    initialize
  }
}) 