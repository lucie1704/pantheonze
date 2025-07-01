<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { orderService, type Order } from '@/services/order.service'
import { useToast } from 'primevue/usetoast'
import { ORDER_STATUS_LABELS, ORDER_STATUS_SEVERITY } from '@/constants/orders'

const router = useRouter()
const toast = useToast()

const orders = ref<Order[]>([])
const loading = ref(false)
const showPagination = ref(false)

onMounted(() => {
  fetchOrders()
})

const fetchOrders = async () => {
  loading.value = true
  try {
    orders.value = await orderService.getUserOrders()
    showPagination.value = orders.value.length > 10
  } catch (error) {
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

const goToOrderDetail = (order: Order) => {
  router.push(`/account/orders/${order.id}`)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const formattedDay = day === 1 ? '1er' : day.toString()
  
  const month = date.toLocaleDateString('fr-FR', { month: 'long' })
  const year = date.getFullYear()
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  
  return `Le ${formattedDay} ${month} ${year} à ${time}`
}

const getItemCount = (order: Order) => {
  return order.items.reduce((total, item) => total + item.quantity, 0)
}
</script>

<template>
  <div class="surface-ground min-h-screen">
    <div class="surface-section border-round-xl m-2 sm:m-4 p-3 sm:p-4">
      <div class="flex justify-content-between align-items-center mb-4">
        <h1 class="text-2xl sm:text-4xl font-bold m-0 text-primary">Mes commandes</h1>
      </div>

      <!-- Aucune commande -->
      <div v-if="!loading && orders.length === 0" class="text-center py-8">
        <i class="pi pi-shopping-bag text-6xl text-400 mb-4"></i>
        <h2 class="text-2xl font-bold mb-2">Aucune commande</h2>
        <p class="text-500 mb-4">Vous n'avez pas encore passé de commande</p>
        <Button
          label="Voir nos pâtisseries"
          icon="pi pi-arrow-right"
          @click="router.push('/pastries')"
        />
      </div>

      <!-- Tableau des commandes -->
      <div v-else class="surface-card border-round">
        <DataTable
          :value="orders"
          :loading="loading"
          :paginator="showPagination"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} à {last} sur {totalRecords} commandes"
          @rowClick="goToOrderDetail($event.data)"
          class="cursor-pointer"
          :pt="{
            bodyRow: 'hover:bg-primary-50',
          }"
        >
          <Column field="id" header="N° Commande">
            <template #body="{ data }">
              <span class="font-semibold text-primary">#{{ data.id.slice(-6) }}</span>
            </template>
          </Column>

          <Column field="status" header="Statut">
            <template #body="{ data }">
              <Tag
                :value="ORDER_STATUS_LABELS[data.status] || data.status"
                :severity="ORDER_STATUS_SEVERITY[data.status] || 'secondary'"
              />
            </template>
          </Column>

          <Column field="createdAt" header="Date">
            <template #body="{ data }">
              {{ formatDate(data.createdAt) }}
            </template>
          </Column>

          <Column field="items" header="Articles">
            <template #body="{ data }">
              {{ getItemCount(data) }}
            </template>
          </Column>

          <Column field="total" header="Total">
            <template #body="{ data }">
              <span class="font-bold text-primary">{{ data.total.toFixed(2) }}€</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
