<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import { useOrderStore } from '@/stores/order'
import { useCartStore } from '@/stores/cart'
import OrderStepper from '@/components/OrderStepper.vue'

const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()

const orderNumber = ref(`PZ${Date.now().toString().slice(-6)}`)

onMounted(() => {
  if (!orderStore.orderData.customerName || !orderStore.orderData.selectedStore) {
    router.push('/')
    return
  }
})

onUnmounted(() => {
  cartStore.clearCart()
  orderStore.resetOrder()
})

const returnToHome = () => {
  router.push('/')
}

const viewOrders = () => {
  router.push('/account/orders')
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
      <h1 class="text-4xl font-bold mb-2">Confirmation</h1>
      <p class="text-lg text-600">Votre commande <strong>#{{ orderNumber }}</strong> est confirmée
      </p>
    </div>

    <div class="grid">
      <!-- Order Details -->
      <div class="col-12 lg:col-8">
        <!-- Cart Items -->
        <Card class="mb-4">
          <template #header>
            <div class="p-4 pb-0">
              <h3 class="text-xl mt-0 font-bold mb-0">Articles commandés</h3>
            </div>
          </template>
          <template #content>
            <div class="divide-y divide-surface-border">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="py-4 first:pt-0 last:pb-0 border-bottom-1 surface-border last:border-bottom-0"
              >
                <div class="flex align-items-center gap-4">
                  <!-- Image -->
                  <img
                    :src="item.pastry.images[0] || '/no-image.svg'"
                    :alt="item.pastry.name"
                    class="w-4rem h-4rem object-cover border-round flex-shrink-0"
                  />
                  
                  <!-- Product Info -->
                  <div class="flex-1">
                    <div class="flex flex-column gap-2">
                      <h4 class="text-lg font-semibold m-0">{{ item.pastry.name }}</h4>
                      
                      <!-- Diets -->
                      <div 
                        v-if="item.pastry.diets && item.pastry.diets.length > 0"
                        class="flex gap-2" 
                      >
                        <Tag
                          v-for="diet in item.pastry.diets"
                          :key="diet.id"
                          :value="diet.name"
                          class="text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Price and Quantity -->
                  <div class="text-right flex-shrink-0">
                    <p class="text-sm text-500 mt-0 mb-1">{{ item.quantity }} × {{ item.price.toFixed(2) }}€</p>
                    <p class="text-lg font-bold text-primary m-0">{{ (item.quantity * item.price).toFixed(2) }}€</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Total -->
            <div class="flex justify-content-end align-items-center gap-4 pt-4 border-top-1 surface-border">
              <h3 class="text-xl font-bold m-0">Total</h3>
              <p class="text-2xl font-bold text-primary mt-0 mb-0">{{ cartStore.totalPrice.toFixed(2) }}€</p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Payment and Pickup Info -->
      <div class="col-12 lg:col-4">
        <!-- Payment Status -->
        <Card class="mb-4">
          <template #content>
            <div>
                <div v-if="orderStore.orderData.paymentMethod === 'card'" class="flex align-items-center gap-2">
                  <i class="pi pi-check-circle text-green-500"></i>
                  <div>
                    <p class="mt-0 font-medium mb-1">Déjà payé</p>
                    <p class="text-sm text-600 mt-0 m-0">Carte bancaire</p>
                  </div>
                </div>
                <div v-else>
                  <Tag value="Paiement en espèces" severity="warning" class="mb-2" />
                  <p class="text-sm text-600 mt-0 m-0">À régler en boutique</p>
                </div>
            </div>
          </template>
        </Card>

        <!-- Pickup Details -->
        <Card class="mb-4">
          <template #content>
            <p class="font-medium mt-0 mb-2">Récupérer à</p>

            <div v-if="orderStore.orderData.selectedStore" class="flex gap-3">
              <i class="pi pi-map-marker text-primary mt-1"></i>
              
              <div class="flex flex-column gap-2">
                <div>
                  <p class="text-sm font-bold mt-0 mb-0">{{ orderStore.orderData.selectedStore.name }}</p>
                  <p class="text-sm text-500 mt-0 mb-2">{{ orderStore.orderData.selectedStore.address }}</p>
                </div>
              </div>
            </div>

            <div v-if="orderStore.orderData.selectedStore && orderStore.orderData.selectedSlot" class="flex align-items-center gap-3">
              <i class="pi pi-calendar text-primary"></i>

              <p class="text-sm mt-0 mb-0">
                  {{ formatDate(orderStore.orderData.selectedSlot.date) }} à {{ orderStore.orderData.selectedSlot.startTime }}
                </p>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-check-circle {
  color: #22c55e;
}
</style>
