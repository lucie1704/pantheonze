<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import RadioButton from 'primevue/radiobutton'
import { useOrderStore, type Store, type PickupSlot } from '@/stores/order'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'primevue/usetoast'
import OrderStepper from '@/components/OrderStepper.vue'

const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const toast = useToast()

const selectedStoreId = ref<string>('')
const selectedSlotId = ref<string>('')

onMounted(() => {
  // Vérifier que les informations client sont remplies
  if (!orderStore.orderData.customerName) {
    router.push('/order/informations')
    return
  }

  // Pré-sélectionner la boutique et le créneau s'ils existent déjà
  if (orderStore.orderData.selectedStore) {
    selectedStoreId.value = orderStore.orderData.selectedStore.id
  }
  if (orderStore.orderData.selectedSlot) {
    selectedSlotId.value = orderStore.orderData.selectedSlot.id
  }
})

const onStoreSelect = (store: Store) => {
  selectedStoreId.value = store.id.toString()
  selectedSlotId.value = '' // Reset slot selection when store changes
  orderStore.setStore(store)
}

const onSlotSelect = (slot: PickupSlot) => {
  selectedSlotId.value = slot.id.toString()
  orderStore.setSlot(slot)
}

const selectedStore = computed(() => {
  return orderStore.stores.find(store => store.id.toString() === selectedStoreId.value)
})

const availableSlots = computed(() => {
  if (!selectedStore.value) return []
  return orderStore.availableSlots.filter(slot => slot.available)
})

const groupedSlots = computed(() => {
  const groups: { [date: string]: PickupSlot[] } = {}
  
  availableSlots.value.forEach(slot => {
    if (!groups[slot.date]) {
      groups[slot.date] = []
    }
    groups[slot.date].push(slot)
  })
  
  return groups
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const formattedDay = day === 1 ? '1er' : day.toString()
  
  const weekday = date.toLocaleDateString('fr-FR', { weekday: 'long' })
  const month = date.toLocaleDateString('fr-FR', { month: 'long' })
  
  return `${weekday} ${formattedDay} ${month}`
}

const canProceed = computed(() => {
  return selectedStoreId.value && selectedSlotId.value
})

const proceedToPayment = () => {
  if (!canProceed.value) {
    toast.add({
      severity: 'error',
      summary: 'Sélection incomplète',
      detail: 'Veuillez sélectionner une boutique et un créneau',
      life: 3000,
    })
    return
  }

  router.push('/order/payment')
}

const goBackToInfo = () => {
  router.push('/order/informations')
}
</script>

<template>
  <div class="max-w-screen-lg mx-auto p-4">
    <!-- Order Stepper -->
    <OrderStepper />
    
    <!-- Navigation breadcrumb -->
    <div class="mb-6">
      <h1 class="text-4xl font-bold mb-2">Récupération en boutique</h1>
      <p class="text-lg text-600">Choisissez votre boutique et votre créneau de récupération</p>
    </div>

    <div class="grid">
      <!-- Sélection boutique et créneau -->
      <div class="col-12 lg:col-8">
        <!-- Sélection de la boutique -->
        <Card class="mb-4">
          <template #header>
            <div class="p-4 pb-0">
              <h3 class="text-xl font-bold mb-0">Choisissez votre boutique</h3>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div 
                v-for="store in orderStore.stores" 
                :key="store.id"
                class="border-1 surface-border border-round p-3 cursor-pointer transition-all duration-200"
                :class="{ 
                  'border-primary bg-primary-50': selectedStoreId === store.id.toString(),
                  'hover:border-primary-300': selectedStoreId !== store.id.toString()
                }"
                @click="onStoreSelect(store)"
              >
                <div class="flex align-items-start gap-3">
                  <RadioButton 
                     :modelValue="selectedStoreId" 
                     :value="store.id.toString()" 
                     @update:modelValue="onStoreSelect(store)"
                   />
                  <div class="flex-1">
                    <h4 class="text-lg font-bold mt-0 mb-1">{{ store.name }}</h4>
                    <div class="flex align-items-center gap-2 mb-2">
                      <i class="pi pi-map-marker text-500"></i>
                      <span class="text-600">{{ store.address }}</span>
                    </div>
                    <div class="text-sm text-600 mt-3">
                      <div class="inline-block">
                        <div class="flex flex-column gap-1">
                          <div class="flex gap-4">
                            <span class="font-medium w-8rem">Lundi - Jeudi</span>
                            <span>{{ store.openingHours.monday }}</span>
                          </div>
                          <div class="flex gap-4">
                            <span class="font-medium w-8rem">Vendredi</span>
                            <span>{{ store.openingHours.friday }}</span>
                          </div>
                          <div class="flex gap-4">
                            <span class="font-medium w-8rem">Samedi</span>
                            <span>{{ store.openingHours.saturday }}</span>
                          </div>
                          <div class="flex gap-4">
                            <span class="font-medium w-8rem">Dimanche</span>
                            <span>{{ store.openingHours.sunday }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Sélection du créneau -->
        <Card v-if="selectedStore">
          <template #header>
            <div class="p-4 pb-0">
              <h3 class="text-xl font-bold mb-0">Choisissez votre créneau</h3>
              <p class="text-600 m-0">{{ selectedStore.name }}</p>
            </div>
          </template>
          <template #content>
            <div v-if="Object.keys(groupedSlots).length === 0" class="text-center py-4">
              <i class="pi pi-calendar-times text-4xl text-400 mb-3"></i>
              <p class="text-600">Aucun créneau disponible pour cette boutique</p>
            </div>
            
            <div v-else class="flex flex-column gap-4">
              <div 
                v-for="(slots, date) in groupedSlots" 
                :key="date"
                class="border-1 surface-border border-round p-3"
              >
                <h5 class="text-lg mt-0 font-bold mb-3 text-primary">{{ formatDate(String(date)) }}</h5>
                <div class="grid gap-2">
                  <div 
                    v-for="slot in slots" 
                    :key="slot.id"
                    class="col-6 md:col-4 lg:col-3"
                  >
                    <div 
                      class="border-1 surface-border border-round p-2 text-center cursor-pointer transition-all duration-200"
                      :class="{ 
                        'border-primary bg-primary-50': selectedSlotId === slot.id.toString(),
                        'hover:border-primary-300': selectedSlotId !== slot.id.toString() && slot.available,
                        'opacity-50 cursor-not-allowed': !slot.available
                      }"
                      @click="slot.available && onSlotSelect(slot)"
                    >
                      <div class="flex align-items-center justify-content-center gap-2">
                        <RadioButton 
                          v-if="slot.available"
                          :modelValue="selectedSlotId" 
                          :value="slot.id.toString()" 
                          @update:modelValue="onSlotSelect(slot)"
                        />
                        <span class="font-medium">{{ slot.startTime }} - {{ slot.endTime }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Boutons de navigation -->
        <div class="flex justify-content-between pt-4">
          <Button 
            label="Retour aux informations" 
            icon="pi pi-arrow-left"
            class="p-button-outlined"
            @click="goBackToInfo"
          />
          <Button 
            label="Procéder au paiement" 
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="proceedToPayment"
            :disabled="!canProceed"
          />
        </div>
      </div>

      <!-- Résumé de commande -->
      <div class="col-12 lg:col-4">
        <Card>
          <template #header>
            <div class="p-4 pb-0">
              <h3 class="text-xl font-bold mb-0">Résumé de votre commande</h3>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <!-- Articles -->
              <div v-for="item in cartStore.items" :key="item.id" class="flex justify-content-between align-items-center">
                <div class="flex align-items-center gap-2">
                  <span class="font-medium">{{ item.quantity }}x</span>
                  <span>{{ item.pastry.name }}</span>
                </div>
                <span class="font-bold">{{ (item.price * item.quantity).toFixed(2) }}€</span>
              </div>

              <!-- Récupération sélectionnée -->
              <div v-if="selectedStore && selectedSlotId" class="border-top-1 surface-border pt-3">
                <h4 class="text-sm font-bold text-600 mb-2">RÉCUPÉRATION</h4>
                <div class="text-sm">
                  <div class="font-medium">{{ selectedStore.name }}</div>
                  <div class="text-600 mb-2">{{ selectedStore.address }}</div>
                  <div v-if="orderStore.orderData.selectedSlot" class="font-medium text-primary">
                    {{ formatDate(orderStore.orderData.selectedSlot.date) }}
                    <br>
                    {{ orderStore.orderData.selectedSlot.startTime }} - {{ orderStore.orderData.selectedSlot.endTime }}
                  </div>
                </div>
              </div>

              <div class="border-top-1 surface-border pt-3">
                <div class="flex justify-content-between align-items-center">
                  <span class="text-lg font-bold">Total</span>
                  <span class="text-lg font-bold text-primary">{{ cartStore.totalPrice.toFixed(2) }}€</span>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.transition-all {
  transition: all 0.2s ease;
}
</style>
