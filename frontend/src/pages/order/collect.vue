<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// État
const selectedDate = ref<Date | null>(null)
const selectedTimeSlot = ref<string | null>(null)
const specialInstructions = ref('')

// Calcul des créneaux disponibles
const timeSlots = computed(() => {
  if (!selectedDate.value) return []

  // Simulation de créneaux disponibles
  const slots = []
  const day = selectedDate.value.getDay()

  // Horaires selon le jour
  if (day === 0) {
    // Dimanche
    for (let hour = 8; hour <= 12; hour++) {
      slots.push(`${hour}:00`)
      if (hour < 12) slots.push(`${hour}:30`)
    }
  } else {
    // Lundi-Samedi
    for (let hour = 7; hour <= 19; hour++) {
      slots.push(`${hour}:00`)
      slots.push(`${hour}:30`)
    }
  }

  return slots
})

// Informations du magasin
const storeInfo = {
  name: 'PanthéOnze Paris',
  address: '123 Rue de la Pâtisserie',
  postalCode: '75005',
  city: 'Paris',
  phone: '01 23 45 67 89',
  coordinates: {
    lat: 48.8566,
    lng: 2.3522,
  },
}

// Configuration du calendrier
const today = new Date()
const minDate = new Date()
minDate.setDate(today.getDate() + 1) // Commande possible à partir de demain

const maxDate = new Date()
maxDate.setDate(today.getDate() + 14) // Jusqu'à 2 semaines à l'avance

// Jours de fermeture (exemple)
const invalidDates = [
  new Date(2024, 2, 25), // 25 mars 2024
  new Date(2024, 3, 1), // 1er avril 2024
]

const isDateValid = (date: Date) => {
  // Vérifie si la date n'est pas dans les jours de fermeture
  return !invalidDates.some(
    (invalid) =>
      invalid.getDate() === date.getDate() &&
      invalid.getMonth() === date.getMonth() &&
      invalid.getYear() === date.getYear(),
  )
}

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    // Simulation d'une requête API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Sauvegarde des informations de retrait
    localStorage.setItem(
      'pickupInfo',
      JSON.stringify({
        date: selectedDate.value,
        timeSlot: selectedTimeSlot.value,
        specialInstructions: specialInstructions.value,
      }),
    )

    // Navigation vers l'étape suivante
    router.push('/commande/recap')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-screen-lg mx-auto p-4">
    <div class="surface-card p-4 border-round">
      <h1 class="text-4xl font-bold text-center mb-6">
        Choisir votre créneau de retrait
      </h1>

      <form
        @submit.prevent="handleSubmit"
        class="flex flex-column gap-4"
      >
        <div class="grid">
          <!-- Sélection de la date -->
          <div class="col-12 md:col-6">
            <Panel
              header="Date de retrait"
              class="h-full"
            >
              <Calendar
                v-model="selectedDate"
                :minDate="minDate"
                :maxDate="maxDate"
                :disabledDates="invalidDates"
                :disabledDays="[0]"
                dateFormat="dd/mm/yy"
                showIcon
                class="w-full"
                required
              />
              <small class="block mt-2 text-500">
                <i class="pi pi-info-circle mr-1"></i>
                Commande possible jusqu'à 2 semaines à l'avance
              </small>
            </Panel>
          </div>

          <!-- Sélection du créneau -->
          <div class="col-12 md:col-6">
            <Panel
              header="Créneau horaire"
              class="h-full"
            >
              <div
                v-if="selectedDate"
                class="grid"
              >
                <div
                  v-for="slot in timeSlots"
                  :key="slot"
                  class="col-6"
                >
                  <div
                    class="p-3 border-round cursor-pointer text-center mb-2"
                    :class="{
                      'surface-hover': selectedTimeSlot !== slot,
                      'bg-primary text-white': selectedTimeSlot === slot,
                    }"
                    @click="selectedTimeSlot = slot"
                  >
                    {{ slot }}
                  </div>
                </div>
              </div>
              <div
                v-else
                class="text-500 text-center p-4"
              >
                Veuillez d'abord sélectionner une date
              </div>
            </Panel>
          </div>

          <!-- Instructions spéciales -->
          <div class="col-12">
            <Panel header="Instructions spéciales">
              <Textarea
                v-model="specialInstructions"
                rows="3"
                placeholder="Exemple : Je souhaite que la commande soit emballée séparément..."
                class="w-full"
              />
            </Panel>
          </div>

          <!-- Informations du magasin -->
          <div class="col-12">
            <Panel header="Point de retrait">
              <div class="grid">
                <div class="col-12 md:col-6">
                  <h3 class="text-xl mb-3">{{ storeInfo.name }}</h3>
                  <p class="mb-2">{{ storeInfo.address }}</p>
                  <p class="mb-2">
                    {{ storeInfo.postalCode }} {{ storeInfo.city }}
                  </p>
                  <p class="mb-3">
                    <i class="pi pi-phone mr-2"></i>
                    {{ storeInfo.phone }}
                  </p>

                  <h4 class="font-bold mb-2">Horaires d'ouverture :</h4>
                  <ul class="list-none p-0 m-0">
                    <li class="mb-2">Lundi - Vendredi : 7h30 - 19h30</li>
                    <li class="mb-2">Samedi : 7h30 - 20h00</li>
                    <li>Dimanche : 8h00 - 13h00</li>
                  </ul>
                </div>

                <div class="col-12 md:col-6">
                  <!-- Placeholder pour la carte -->
                  <div
                    class="w-full h-15rem bg-primary-50 border-round flex align-items-center justify-content-center"
                  >
                    <i class="pi pi-map-marker text-4xl text-primary"></i>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>

        <!-- Boutons de navigation -->
        <div class="flex justify-content-between">
          <Button
            label="Retour"
            icon="pi pi-arrow-left"
            outlined
            @click="router.push('/commande/informations')"
          />
          <Button
            type="submit"
            label="Continuer"
            icon="pi pi-arrow-right"
            iconPos="right"
            :loading="loading"
            :disabled="!selectedDate || !selectedTimeSlot"
          />
        </div>
      </form>
    </div>
  </div>
</template>
