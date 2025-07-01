<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Tag from 'primevue/tag'
import Breadcrumb from 'primevue/breadcrumb'
import ProgressSpinner from 'primevue/progressspinner'
import { orderService, type Order } from '@/services/order.service'
import { useToast } from 'primevue/usetoast'
import { ORDER_STATUS_LABELS, ORDER_STATUS_SEVERITY } from '@/constants/orders'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const order = ref<Order | null>(null)
const loading = ref(false)

const breadcrumbItems = ref([
  { label: 'Mes commandes', route: '/account/orders' }
] as Array<{ label: string; route?: string }>)

onMounted(() => {
  fetchOrderDetail()
})

const fetchOrderDetail = async () => {
  const orderId = route.params.id as string
  loading.value = true
  
  try {
    order.value = await orderService.getOrderById(orderId)
    // Update breadcrumb with order number - add the order title to breadcrumb
    breadcrumbItems.value.push({ label: `Commande #${order.value.id.slice(-6)}` })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger les détails de la commande',
      life: 3000,
    })
    router.push('/account/orders')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const formattedDay = day === 1 ? '1er' : day.toString()
  
  const month = date.toLocaleDateString('fr-FR', { month: 'long' })
  const year = date.getFullYear()
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  
  return `${formattedDay} ${month} ${year} à ${time}`
}
</script>

<template>
  <div class="surface-ground min-h-screen">
    <div class="surface-section border-round-xl m-2 sm:m-4 p-3 sm:p-4">
      <!-- Breadcrumb -->
      <div class="mb-4">
        <Breadcrumb :model="breadcrumbItems" class="mb-2">
          <template #item="{ item }">
            <router-link
              v-if="item.route"
              :to="item.route"
              class="text-primary hover:text-primary-600 no-underline hover:underline"
            >
              {{ item.label }}
            </router-link>
            <span v-else class="text-500">{{ item.label }}</span>
          </template>
        </Breadcrumb>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-content-center align-items-center py-8">
        <div class="text-center">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
          <p class="text-500 mt-3">Chargement des détails...</p>
        </div>
      </div>

      <!-- Détail de la commande -->
      <div v-else-if="order">
        <!-- En-tête -->
        <div class="flex flex-column sm:flex-row justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1 class="text-2xl sm:text-4xl font-bold m-0 text-primary">Commande #{{ order.id.slice(-6) }}</h1>
            <p class="text-500 mt-1">Passée le {{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="flex flex-column align-items-end gap-2">
            <Tag
              :value="ORDER_STATUS_LABELS[order.status] || order.status"
              :severity="ORDER_STATUS_SEVERITY[order.status] || 'secondary'"
              class="text-lg px-3 py-2"
            />
            <div v-if="order.status === 'PICKED_UP' && order.pickedUpAt" class="text-sm text-500">
              Récupérée le {{ formatDate(order.pickedUpAt) }}
            </div>
          </div>
        </div>

        <!-- Articles commandés -->
        <div class="surface-card p-4 border-round mb-4">
          <h2 class="text-xl font-bold mb-3">Articles commandés</h2>
          <div class="divide-y divide-surface-border">
            <div
              v-for="item in order.items"
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
                
                <!-- Informations produit -->
                <div class="flex-1">
                  <div class="flex flex-column gap-2">
                    <h3 class="text-lg font-semibold m-0">{{ item.pastry.name }}</h3>
                    
                    <!-- Régimes alimentaires -->
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

                <!-- Prix et quantité -->
                <div class="text-right flex-shrink-0">
                  <p class="text-sm text-500 mt-0 mb-1">{{ item.quantity }} × {{ item.price.toFixed(2) }}€</p>
                  <p class="text-lg font-bold text-primary m-0">{{ (item.quantity * item.price).toFixed(2) }}€</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total de la commande -->
        <div class="surface-card p-4 border-round mb-4">
          <div class="flex justify-content-end align-items-center gap-4">
            <h2 class="text-xl font-bold m-0">Total</h2>
            <p class="text-3xl font-bold text-primary m-0">{{ order.total.toFixed(2) }}€</p>
          </div>
        </div>

        <!-- Notes (si présentes) -->
        <div v-if="order.notes" class="surface-card p-4 border-round">
          <h2 class="text-xl font-bold mb-3">Notes</h2>
          <p class="m-0">{{ order.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template> 