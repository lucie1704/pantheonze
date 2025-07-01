<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import ToggleSwitch from 'primevue/toggleswitch'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import ProgressSpinner from 'primevue/progressspinner'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { authService } from '@/services/auth.service'

const toast = useToast()
const userPreferencesStore = useUserPreferencesStore()
const isLoading = ref(true)

const settings = ref({
  emailNotifications: true,
  promoNotifications: false,
  preferredPayment: 'card',
  dietaryRestrictions: [] as string[],
})

const availableDiets = computed(() => 
  userPreferencesStore.availableDiets.map(diet => diet.name)
)

const saveSettings = async () => {
  try {
    const success = await userPreferencesStore.updatePreferences(settings.value.dietaryRestrictions)
    if (success) {
      toast.add({
        severity: 'success',
        summary: 'Paramètres sauvegardés',
        detail: 'Vos préférences ont été mises à jour avec succès',
        life: 3000,
      })
    } else {
      throw new Error('Failed to save preferences')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de sauvegarder vos préférences',
      life: 3000,
    })
  }
}

const resetSettings = async () => {
  try {
    settings.value = {
      emailNotifications: true,
      promoNotifications: false,
      preferredPayment: 'card',
      dietaryRestrictions: [],
    }
    await userPreferencesStore.clearPreferences()
    toast.add({
      severity: 'info',
      summary: 'Paramètres réinitialisés',
      detail: 'Tous les paramètres ont été remis à zéro',
      life: 3000,
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de réinitialiser les paramètres',
      life: 3000,
    })
  }
}

watch(() => userPreferencesStore.userDietaryPreferences, (newPreferences) => {
  settings.value.dietaryRestrictions = newPreferences.map(diet => diet.name)
}, { immediate: true })

onMounted(async () => {
  try {
    await userPreferencesStore.initialize()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger vos préférences',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="surface-ground">
    <div class="surface-section border-round-xl m-2 sm:m-4 p-3 sm:p-4">
      <div v-if="isLoading" class="flex justify-content-center align-items-center py-8">
        <div class="text-center">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
          <p class="text-500 mt-3">Chargement de vos paramètres...</p>
        </div>
      </div>

      <div v-else>
        <div class="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center mb-4 gap-3">
          <h1 class="text-2xl sm:text-4xl font-bold m-0 text-primary">Paramètres</h1>
          <div class="flex flex-column sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              label="Sauvegarder"
              icon="pi pi-save"
              size="small"
              class="w-full sm:w-auto"
              @click="saveSettings"
            />
            <Button
              label="Réinitialiser"
              icon="pi pi-refresh"
              severity="secondary"
              size="small"
              class="w-full sm:w-auto"
              @click="resetSettings"
            />
          </div>
        </div>

        <div class="surface-card p-3 sm:p-4 border-round mb-4">
          <h2 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Préférences alimentaires</h2>
          <div class="flex flex-column gap-3">
            <p class="text-500 mb-3 text-sm sm:text-base">Sélectionnez vos régimes alimentaires pour personnaliser vos recherches</p>
            <div class="flex flex-column gap-2">
              <div
                v-for="diet in availableDiets"
                :key="diet"
              >
                <div class="flex align-items-center gap-2">
                  <Checkbox
                    v-model="settings.dietaryRestrictions"
                    :inputId="`diet-${diet}`"
                    name="diet"
                    :value="diet"
                  />
                  <label
                    :for="`diet-${diet}`"
                    class="cursor-pointer text-sm sm:text-base"
                  >
                    {{ diet }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div class="surface-card p-3 sm:p-4 border-round mb-4">
          <h2 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Préférences de notification</h2>
          <div class="flex flex-column gap-3">
            <div class="flex flex-column sm:flex-row align-items-start sm:align-items-center gap-3">
              <ToggleSwitch v-model="settings.emailNotifications" />
              <div>
                <p class="text-500 m-0 text-sm sm:text-base">Recevoir des emails pour les mises à jour de commande</p>
              </div>
            </div>
            <div class="flex flex-column sm:flex-row align-items-start sm:align-items-center gap-3">
              <ToggleSwitch v-model="settings.promoNotifications" />
              <div>
                <p class="text-500 m-0 text-sm sm:text-base">Recevoir des offres spéciales et promotions</p>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div class="surface-card p-3 sm:p-4 border-round">
          <h2 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Préférences de paiement</h2>
          <div class="flex flex-column gap-3">
            <div class="field">
              <label class="block mb-2 text-sm sm:text-base">Mode de paiement préféré</label>
              <div class="flex flex-column gap-2">
                <div class="flex align-items-center gap-2">
                  <RadioButton
                    v-model="settings.preferredPayment"
                    value="card"
                    inputId="payment1"
                  />
                  <label for="payment1" class="text-sm sm:text-base">Carte bancaire</label>
                </div>
                <div class="flex align-items-center gap-2">
                  <RadioButton
                    v-model="settings.preferredPayment"
                    value="paypal"
                    inputId="payment2"
                  />
                  <label for="payment2" class="text-sm sm:text-base">PayPal</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>