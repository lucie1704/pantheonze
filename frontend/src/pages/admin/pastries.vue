<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import { pastryService } from '@/services'
import type { Pastry } from '@/types'

const router = useRouter()
const toast = useToast()

// Data
const pastries = ref<Pastry[]>([])
const loading = ref(false)
const filters = ref({
  name: { value: null, matchMode: 'contains' },
  category: { value: null, matchMode: 'contains' },
  price: { value: null, matchMode: 'equals' }
})

// Computed
const totalRecords = computed(() => pastries.value.length)

// Methods
const loadPastries = async () => {
  loading.value = true
  try {
    const response = await pastryService.getAllPastries()
    pastries.value = response || []
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger les produits',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  router.push('/admin/pastries/new')
}

const handleEdit = (pastry: Pastry) => {
  router.push(`/admin/pastries/${pastry.id}/edit`)
}

const handleDelete = (pastry: Pastry) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${pastry.name}" ?`)) {
    try {
      // await pastryService.deletePastry(pastry.id)
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Produit supprimé avec succès',
        life: 3000,
      })
      loadPastries()
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de supprimer le produit',
        life: 3000,
      })
    }
  }
}

const handleView = (pastry: Pastry) => {
  router.push(`/pastries/${pastry.slug}`)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatDiets = (diets: any[]) => {
  if (!diets || diets.length === 0) return 'Aucun'
  return diets.map(diet => diet.name).join(', ')
}

onMounted(() => {
  loadPastries()
})
</script>

<template>
  <div class="pastries-admin">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Gestion des Produits</h1>
        <p class="page-subtitle">Administrez vos produits de pâtisserie</p>
      </div>
      <Button
        label="Ajouter un produit"
        icon="pi pi-plus"
        @click="handleAdd"
        class="add-btn"
      />
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-content">
        <div class="filter-item">
          <label for="name-filter">Nom</label>
          <InputText
            id="name-filter"
            v-model="filters.name.value"
            placeholder="Rechercher par nom..."
            class="w-full"
          />
        </div>
        <div class="filter-item">
          <label for="category-filter">Catégorie</label>
          <InputText
            id="category-filter"
            v-model="filters.category.value"
            placeholder="Rechercher par catégorie..."
            class="w-full"
          />
        </div>
        <div class="filter-item">
          <label for="price-filter">Prix</label>
          <InputText
            id="price-filter"
            v-model="filters.price.value"
            placeholder="Filtrer par prix..."
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- DataTable -->
    <div class="table-container">
      <DataTable
        :value="pastries"
        :loading="loading"
        :filters="filters"
        filter-display="menu"
        :global-filter-fields="['name', 'category.name', 'description']"
        data-key="id"
        :paginator="true"
        :rows="10"
        :rows-per-page-options="[5, 10, 20, 50]"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        current-page-report-template="Affichage de {first} à {last} sur {totalRecords} produits"
        :total-records="totalRecords"
        responsive-layout="scroll"
        class="pastries-table"
      >
        <!-- Image -->
        <Column field="image" header="Image" :sortable="false" style="width: 80px">
          <template #body="slotProps">
            <img
              :src="slotProps.data.image || '/no-image.svg'"
              :alt="slotProps.data.name"
              class="w-12 h-12 object-cover rounded"
            />
          </template>
        </Column>

        <!-- Name -->
        <Column
          field="name"
          header="Nom"
          :sortable="true"
          :filter="true"
          filter-placeholder="Rechercher par nom..."
          style="min-width: 200px"
        >
          <template #body="slotProps">
            <div class="product-name">
              <span class="font-medium">{{ slotProps.data.name }}</span>
              <span v-if="slotProps.data.description" class="text-sm text-gray-500 block">
                {{ slotProps.data.description.substring(0, 50) }}{{ slotProps.data.description.length > 50 ? '...' : '' }}
              </span>
            </div>
          </template>
        </Column>

        <!-- Category -->
        <Column
          field="category.name"
          header="Catégorie"
          :sortable="true"
          :filter="true"
          filter-placeholder="Rechercher par catégorie..."
          style="min-width: 120px"
        />

        <!-- Price -->
        <Column
          field="price"
          header="Prix"
          :sortable="true"
          :filter="true"
          filter-placeholder="Filtrer par prix..."
          style="min-width: 100px"
        >
          <template #body="slotProps">
            <span class="font-medium">{{ formatPrice(slotProps.data.price) }}</span>
          </template>
        </Column>

        <!-- Diets -->
        <Column
          field="diets"
          header="Régimes"
          :sortable="false"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span class="text-sm">{{ formatDiets(slotProps.data.diets) }}</span>
          </template>
        </Column>

        <!-- Actions -->
        <Column
          header="Actions"
          :exportable="false"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button
                icon="pi pi-eye"
                text
                size="small"
                @click="handleView(slotProps.data)"
                v-tooltip.top="{ value: 'Voir le produit' }"
              />
              <Button
                icon="pi pi-pencil"
                text
                size="small"
                @click="handleEdit(slotProps.data)"
                v-tooltip.top="{ value: 'Modifier' }"
              />
              <Button
                icon="pi pi-trash"
                text
                severity="danger"
                size="small"
                @click="handleDelete(slotProps.data)"
                v-tooltip.top="{ value: 'Supprimer' }"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.pastries-admin {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #6c757d;
  margin: 0;
}

.add-btn {
  background: #007bff;
  border-color: #007bff;
}

.add-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.filters-section {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filters-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-item label {
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
}

.table-container {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  overflow: hidden;
}

.pastries-table {
  width: 100%;
}

.product-name {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filters-content {
    grid-template-columns: 1fr;
  }
}
</style> 