import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService, type Diet, authService } from '@/services'

export const useUserPreferencesStore = defineStore('userPreferences', () => {
  // State
  const userDietaryPreferences = ref<Diet[]>([])
  const availableDiets = ref<Diet[]>([])
  const isLoading = ref(false)
  const isLoaded = ref(false)

  // Getters
  const hasPreferences = computed(() => userDietaryPreferences.value.length > 0)
  const preferenceNames = computed(() => userDietaryPreferences.value.map(diet => diet.name))

  // Actions
  const loadAvailableDiets = async () => {
    try {
      isLoading.value = true
      const diets = await userService.getAvailableDiets()
      availableDiets.value = diets
    } catch (error) {
      console.error('Erreur lors du chargement des régimes disponibles:', error)
    } finally {
      isLoading.value = false
    }
  }

  const loadUserPreferences = async () => {
    if (!authService.isAuthenticated()) {
      userDietaryPreferences.value = []
      isLoaded.value = true
      return
    }

    try {
      isLoading.value = true
      const preferences = await userService.getUserDietaryPreferences()
      userDietaryPreferences.value = preferences
      isLoaded.value = true
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error)
      // Si erreur 401, reset les préférences
      if (error instanceof Error && error.message.includes('401')) {
        userDietaryPreferences.value = []
        isLoaded.value = true
      }
    } finally {
      isLoading.value = false
    }
  }

  const updatePreferences = async (dietIds: string[]) => {
    if (!authService.isAuthenticated()) return false
    
    try {
      isLoading.value = true
      await userService.updateUserDietaryPreferences(dietIds)
      // Reload preferences after update
      await loadUserPreferences()
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const addPreference = async (diet: Diet) => {
    if (!authService.isAuthenticated()) return false
    
    try {
      isLoading.value = true
      await userService.addDietaryPreference(diet)
      // Reload preferences after adding
      await loadUserPreferences()
      return true
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la préférence:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const removePreference = async (diet: Diet) => {
    if (!authService.isAuthenticated()) return false
    
    try {
      isLoading.value = true
      await userService.removeDietaryPreference(diet)
      // Reload preferences after removing
      await loadUserPreferences()
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la préférence:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearPreferences = async () => {
    if (!authService.isAuthenticated()) return false
    
    try {
      isLoading.value = true
      await userService.updateUserDietaryPreferences([])
      userDietaryPreferences.value = []
      return true
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