<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import RadioButton from 'primevue/radiobutton'
import InputText from 'primevue/inputtext'
import { useOrderStore } from '@/stores/order'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'primevue/usetoast'
import OrderStepper from '@/components/OrderStepper.vue'

const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const toast = useToast()

const selectedPaymentMethod = ref<'card' | 'cash'>('card')
const isProcessing = ref(false)

// Mock card form data
const cardForm = ref({
  number: '',
  expiry: '',
  cvv: '',
  name: ''
})

onMounted(() => {
  // Vérifier que les étapes précédentes sont complètes
  if (!orderStore.orderData.customerName || !orderStore.orderData.selectedStore || !orderStore.orderData.selectedSlot) {
    router.push('/order/informations')
    return
  }

  // Pré-sélectionner la méthode de paiement si elle existe
  if (orderStore.orderData.paymentMethod) {
    selectedPaymentMethod.value = orderStore.orderData.paymentMethod
  }
})

const onPaymentMethodSelect = (method: 'card' | 'cash') => {
  selectedPaymentMethod.value = method
  orderStore.setPaymentMethod(method)
}

const canProceed = computed(() => {
  if (selectedPaymentMethod.value === 'cash') {
    return true
  }
  
  if (selectedPaymentMethod.value === 'card') {
    return cardForm.value.number && 
           cardForm.value.expiry && 
           cardForm.value.cvv && 
           cardForm.value.name
  }
  
  return false
})

const processPayment = async () => {
  isProcessing.value = true
  
  try {
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.add({
      severity: 'success',
      summary: 'Paiement confirmé',
      detail: 'Votre commande a été validée avec succès',
      life: 3000,
    })
    
    router.push('/order/confirmation')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur de paiement',
      detail: 'Une erreur est survenue lors du paiement',
      life: 3000,
    })
  } finally {
    isProcessing.value = false
  }
}

const goBackToCollect = () => {
  router.push('/order/collect')
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const formattedDay = day === 1 ? '1er' : day.toString()
  
  const weekday = date.toLocaleDateString('fr-FR', { weekday: 'long' })
  const month = date.toLocaleDateString('fr-FR', { month: 'long' })
  
  return `${weekday} ${formattedDay} ${month}`
}
</script>

<template>
  <div class="max-w-screen-lg mx-auto p-4">
    <!-- Order Stepper -->
    <OrderStepper />
    
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-4xl font-bold mb-2">Paiement</h1>
      <p class="text-lg text-600">Choisissez votre mode de paiement</p>
    </div>

    <div class="grid">
      <!-- Payment Methods -->
      <div class="col-12 lg:col-8">
        <!-- Payment Method Selection -->
        <Card class="mb-4">
          <template #header>
            <div class="p-4 pb-0">
              <h3 class="text-xl font-bold mb-0">Mode de paiement</h3>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <!-- Card Payment -->
              <div 
                class="border-1 surface-border border-round p-3 cursor-pointer transition-all duration-200"
                :class="{ 
                  'border-primary bg-primary-50': selectedPaymentMethod === 'card',
                  'hover:border-primary-300': selectedPaymentMethod !== 'card'
                }"
                @click="onPaymentMethodSelect('card')"
              >
                <div class="flex align-items-center gap-3">
                  <RadioButton 
                    :modelValue="selectedPaymentMethod" 
                    value="card" 
                    @update:modelValue="onPaymentMethodSelect('card')"
                  />
                  <div class="flex-1">
                    <div class="flex align-items-center gap-2">
                      <span class="text-lg font-bold">Paiement par carte</span>
                    </div>
                    <p class="text-sm text-600 m-0 mt-1">Visa, Mastercard, American Express</p>
                  </div>
                </div>
              </div>

              <!-- Cash Payment -->
              <div 
                class="border-1 surface-border border-round p-3 cursor-pointer transition-all duration-200"
                :class="{ 
                  'border-primary bg-primary-50': selectedPaymentMethod === 'cash',
                  'hover:border-primary-300': selectedPaymentMethod !== 'cash'
                }"
                @click="onPaymentMethodSelect('cash')"
              >
                <div class="flex align-items-center gap-3">
                  <RadioButton 
                    :modelValue="selectedPaymentMethod" 
                    value="cash" 
                    @update:modelValue="onPaymentMethodSelect('cash')"
                  />
                  <div class="flex-1">
                    <div class="flex align-items-center gap-2">
                      <span class="text-lg font-bold">Paiement en espèces</span>
                    </div>
                    <p class="text-sm text-600 m-0 mt-1">Règlement à la récupération en boutique</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Card Form (if card payment selected) -->
        <Card v-if="selectedPaymentMethod === 'card'" class="mb-4">
          <template #header>
            <div class="p-4 pb-0">
              <h3 class="text-xl font-bold mb-0">Informations de carte</h3>
            </div>
          </template>
          <template #content>
            <div class="grid">
              <!-- Card Number -->
              <div class="col-12">
                <label for="cardNumber" class="block text-900 font-medium mb-2">Numéro de carte *</label>
                <InputText 
                  id="cardNumber"
                  v-model="cardForm.number"
                  class="w-full"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <!-- Expiry and CVV -->
              <div class="col-6">
                <label for="expiry" class="block text-900 font-medium mb-2">Date d'expiration *</label>
                <InputText 
                  id="expiry"
                  v-model="cardForm.expiry"
                  class="w-full"
                  placeholder="MM/AA"
                />
              </div>
              <div class="col-6">
                <label for="cvv" class="block text-900 font-medium mb-2">CVV *</label>
                <InputText 
                  id="cvv"
                  v-model="cardForm.cvv"
                  class="w-full"
                  placeholder="123"
                  type="password"
                />
              </div>

              <!-- Cardholder Name -->
              <div class="col-12">
                <label for="cardName" class="block text-900 font-medium mb-2">Nom du porteur *</label>
                <InputText 
                  id="cardName"
                  v-model="cardForm.name"
                  class="w-full"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Navigation Buttons -->
        <div class="flex justify-content-between pt-4">
          <Button 
            label="Retour à la récupération" 
            icon="pi pi-arrow-left"
            class="p-button-outlined"
            @click="goBackToCollect"
          />
          <Button 
            :label="selectedPaymentMethod === 'card' ? 'Payer maintenant' : 'Confirmer la commande'"
            iconPos="right"
            @click="processPayment"
            :disabled="!canProceed"
            :loading="isProcessing"
          />
        </div>
      </div>

      <!-- Order Summary -->
      <div class="col-12 lg:col-4">
        <Card>
          <template #header>
            <div class="p-4 pb-0">
              <h3 class="text-xl font-bold mb-0">Résumé de votre commande</h3>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <!-- Items -->
              <div v-for="item in cartStore.items" :key="item.id" class="flex justify-content-between align-items-center">
                <div class="flex align-items-center gap-2">
                  <span class="font-medium">{{ item.quantity }}x</span>
                  <span>{{ item.pastry.name }}</span>
                </div>
                <span class="font-bold">{{ (item.price * item.quantity).toFixed(2) }}€</span>
              </div>

              <!-- Pickup Info -->
              <div v-if="orderStore.orderData.selectedStore && orderStore.orderData.selectedSlot" class="border-top-1 surface-border pt-3">
                <h4 class="text-sm font-bold text-600 mb-2">RÉCUPÉRATION</h4>
                <div class="text-sm">
                  <div class="font-medium">{{ orderStore.orderData.selectedStore.name }}</div>
                  <div class="text-600 mb-2">{{ orderStore.orderData.selectedStore.address }}</div>
                  <div class="font-medium text-primary">
                    {{ formatDate(orderStore.orderData.selectedSlot.date) }}
                    <br>
                    {{ orderStore.orderData.selectedSlot.startTime }} - {{ orderStore.orderData.selectedSlot.endTime }}
                  </div>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="border-top-1 surface-border pt-3">
                <h4 class="text-sm font-bold text-600 mb-2">PAIEMENT</h4>
                <div class="text-sm">
                  <div class="flex align-items-center gap-2">
                    <i :class="selectedPaymentMethod === 'card' ? 'pi pi-credit-card' : 'pi pi-money-bill'"></i>
                    <span>{{ selectedPaymentMethod === 'card' ? 'Paiement par carte' : 'Paiement en espèces' }}</span>
                  </div>
                </div>
              </div>

              <!-- Total -->
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
