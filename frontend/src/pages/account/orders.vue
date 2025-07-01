<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import { orderService, type Order } from '@/services/order.service'
import { useToast } from 'primevue/usetoast'
import DietIcon from '@/components/DietIcon.vue'
import { DIET_CONFIG } from '@/constants/diets'

const router = useRouter()
const toast = useToast()

const orders = ref<Order[]>([])
const loading = ref(false)
const selectedOrder = ref<Order | null>(null)
const showOrderDetail = ref(false)

onMounted(() => {
  fetchOrders()
})

const fetchOrders = async () => {
  loading.value = true
  try {
    orders.value = await orderService.getUserOrders()
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger l\'historique des commandes',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const openOrderDetail = async (order: Order) => {
  try {
    const fullOrder = await orderService.getOrderById(order.id)
    selectedOrder.value = fullOrder
    showOrderDetail.value = true
  } catch (error) {
    console.error('Error fetching order details:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger les détails de la commande',
      life: 3000,
    })
  }
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return 'success'
    case 'OUT_FOR_DELIVERY':
      return 'info'
    case 'READY':
      return 'warning'
    case 'PREPARING':
      return 'warning'
    case 'CONFIRMED':
      return 'info'
    case 'PENDING':
      return 'secondary'
    case 'CANCELLED':
      return 'danger'
    default:
      return 'secondary'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'En attente'
    case 'CONFIRMED':
      return 'Confirmée'
    case 'PREPARING':
      return 'En préparation'
    case 'READY':
      return 'Prête'
    case 'OUT_FOR_DELIVERY':
      return 'En livraison'
    case 'DELIVERED':
      return 'Livrée'
    case 'CANCELLED':
      return 'Annulée'
    case 'REFUNDED':
      return 'Remboursée'
    default:
      return status
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getItemCount = (order: Order) => {
  return order.items.reduce((total, item) => total + item.quantity, 0)
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-4">
    <div class="flex align-items-center justify-content-between mb-4">
      <h1 class="text-3xl font-bold">Historique des commandes</h1>
      <Button
        label="Retour au compte"
        icon="pi pi-arrow-left"
        outlined
        @click="router.push('/account')"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
      <p class="mt-2">Chargement de l'historique...</p>
    </div>

    <!-- Aucune commande -->
    <div v-else-if="orders.length === 0" class="text-center py-8">
      <i class="pi pi-shopping-bag text-6xl text-400 mb-4"></i>
      <h2 class="text-2xl font-bold mb-2">Aucune commande</h2>
      <p class="text-500 mb-4">Vous n'avez pas encore passé de commande</p>
      <Button
        label="Voir nos pâtisseries"
        icon="pi pi-arrow-right"
        @click="router.push('/pastries')"
      />
    </div>

    <!-- Liste des commandes -->
    <div v-else class="grid gap-4">
      <Card
        v-for="order in orders"
        :key="order.id"
        class="cursor-pointer hover:shadow-lg transition-shadow"
        @click="openOrderDetail(order)"
      >
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <!-- Informations de base -->
            <div class="flex-1">
              <div class="flex align-items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold mb-0">Commande #{{ order.id.slice(-6) }}</h3>
                <Tag
                  :value="getStatusLabel(order.status)"
                  :severity="getStatusSeverity(order.status)"
                />
              </div>
              <p class="text-500 mb-1">{{ formatDate(order.createdAt) }}</p>
              <p class="text-500 mb-2">{{ getItemCount(order) }} article(s) • {{ order.total.toFixed(2) }}€</p>
            </div>

            <!-- Bouton voir détails -->
            <Button
              icon="pi pi-eye"
              text
              @click.stop="openOrderDetail(order)"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Modal de détail de commande -->
    <Dialog
      v-model:visible="showOrderDetail"
      modal
      :header="selectedOrder ? `Commande #${selectedOrder.id.slice(-6)}` : ''"
      :style="{ width: '90vw', maxWidth: '800px' }"
      :closable="true"
    >
      <div v-if="selectedOrder" class="space-y-4">
        <!-- Informations générales -->
        <div class="surface-card p-4 border-round">
          <h3 class="text-xl font-bold mb-3">Informations de la commande</h3>
          <div class="grid">
            <div class="col-12 md:col-6">
              <p><strong>Date :</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
              <p><strong>Statut :</strong> 
                <Tag
                  :value="getStatusLabel(selectedOrder.status)"
                  :severity="getStatusSeverity(selectedOrder.status)"
                />
              </p>
              <p><strong>Total :</strong> {{ selectedOrder.total.toFixed(2) }}€</p>
            </div>
            <div class="col-12 md:col-6">
              <p><strong>Nom :</strong> {{ selectedOrder.customerName }}</p>
              <p><strong>Email :</strong> {{ selectedOrder.customerEmail }}</p>
              <p v-if="selectedOrder.customerPhone"><strong>Téléphone :</strong> {{ selectedOrder.customerPhone }}</p>
            </div>
          </div>
        </div>

        <!-- Articles -->
        <div class="surface-card p-4 border-round">
          <h3 class="text-xl font-bold mb-3">Articles commandés</h3>
          <div class="space-y-3">
            <div
              v-for="item in selectedOrder.items"
              :key="item.id"
              class="flex align-items-center gap-3 p-3 border-1 surface-border border-round"
            >
              <img
                :src="item.pastry.images[0] || '/no-image.svg'"
                :alt="item.pastry.name"
                class="w-4rem h-4rem object-cover border-round"
              />
              <div class="flex-1">
                <h4 class="text-lg font-semibold mb-1">{{ item.pastry.name }}</h4>
                <p class="text-500 mb-1">{{ item.pastry.category.name }}</p>
                <div 
                  v-if="item.pastry.diets && item.pastry.diets.length > 0"
                  class="flex gap-1 mb-1" 
                >
                  <DietIcon
                    v-for="diet in item.pastry.diets"
                    :key="diet.id"
                    :diet-name="DIET_CONFIG[diet.name]?.dietName"
                    :label="DIET_CONFIG[diet.name]?.label"
                  />
                </div>
                <p class="text-sm text-500">{{ item.pastry.description }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold">{{ item.quantity }} × {{ item.price.toFixed(2) }}€</p>
                <p class="text-lg font-bold">{{ (item.quantity * item.price).toFixed(2) }}€</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="selectedOrder.notes" class="surface-card p-4 border-round">
          <h3 class="text-xl font-bold mb-3">Notes</h3>
          <p>{{ selectedOrder.notes }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>
