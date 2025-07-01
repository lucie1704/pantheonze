<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'
import { pastryService, categoryService } from '@/services'
import type { Pastry } from '@/types'
import DietIcon from '@/components/DietIcon.vue'
import { DIET_CONFIG } from '@/constants/diets'
import Tag from 'primevue/tag'
import { 
  AddPastryModal, 
  EditPastryModal, 
  DeletePastryModal 
} from '@/components/admin'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Data
const pastries = ref<Pastry[]>([])
const categories = ref<any[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const paginationInfo = ref<any>(null)
const filterTimeout = ref<number | null>(null)

// Filtres DataTable
const filters = ref({
  name: { value: null as string | null, matchMode: 'equals' },
  category: { value: null as { name: string } | null, matchMode: 'equals' },
  tags: { value: null as { value: string } | null, matchMode: 'equals' },
  diets: { value: null as { value: string } | null, matchMode: 'equals' }
})

// Pagination
const first = ref(0)
const rows = ref(10)

// Tri
const sortField = ref('')
const sortOrder = ref(1)

// Tags options
const tagOptions = ref([
  { label: 'Populaire', value: 'Populaire' },
  { label: 'Nouveau', value: 'Nouveau' }
])

// Modals
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showViewModal = ref(false)
const selectedPastry = ref<Pastry | null>(null)

// Menu actions
const actionMenu = ref()
const selectedPastryForMenu = ref<Pastry | null>(null)

// Références aux modals
const addModalRef = ref()

// Computed
const dietOptions = computed(() => Object.keys(DIET_CONFIG).map(key => ({ label: key, value: key })))

// Filtrer les options pour enlever les valeurs vides
const filteredCategories = computed(() => categories.value.filter(cat => cat.name && cat.name.trim() !== ''))
const filteredTagOptions = computed(() => tagOptions.value.filter(tag => tag.value && tag.value.trim() !== ''))
const filteredDietOptions = computed(() => dietOptions.value.filter(diet => diet.value && diet.value.trim() !== ''))

// Methods
const loadPastries = async () => {
  loading.value = true
  try {    
    const params = new URLSearchParams()
    
    // Pagination
    const page = Math.floor(first.value / rows.value) + 1
    params.append('page', page.toString())
    params.append('limit', rows.value.toString())
    
    // Tri
    if (sortField.value) {
      params.append('sortBy', sortField.value)
      params.append('order', sortOrder.value === -1 ? 'desc' : 'asc')
    }
    // Filtres
    if (filters.value.name.value) {
      params.append('query', filters.value.name.value)
    }
    if (filters.value.category.value) {
      params.append('categories', filters.value.category.value.name)
    }
    if (filters.value.tags.value) {
      params.append('tags', filters.value.tags.value.value)
    }
    if (filters.value.diets.value) {
      params.append('diets', filters.value.diets.value.value)
    }
    
    const response = await pastryService.getAllPastries(params)
    pastries.value = response.data
    totalRecords.value = response.pagination.total
    paginationInfo.value = response.pagination
    
    // Mettre à jour l'URL avec les paramètres
    updateURL(params)
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
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

const updateURL = (params: URLSearchParams) => {
  const newQuery = Object.fromEntries(params.entries())
  router.replace({ query: newQuery })
}

const loadCategories = async () => {
  try {
    const categoriesData = await categoryService.getAllCategories()
    categories.value = categoriesData
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger les catégories',
      life: 3000,
    })
  }
}

// Événements DataTable
const onPage = (event: any) => {
  first.value = event.first
  rows.value = event.rows
  loadPastries()
}

const onSort = (event: any) => {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  loadPastries()
}

const onFilter = () => {
  if (filterTimeout.value) {
    clearTimeout(filterTimeout.value)
  }
  
  filterTimeout.value = setTimeout(() => {
    first.value = 0 
    loadPastries()
  }, 300)
}

const handleAdd = () => {
  showAddModal.value = true
}

const handleEdit = (pastry: Pastry) => {
  selectedPastry.value = pastry
  showEditModal.value = true
}

const handleDelete = (pastry: Pastry) => {
  selectedPastry.value = pastry
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!selectedPastry.value) return
  
  try {
    await pastryService.deletePastry(selectedPastry.value.id)
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Produit supprimé avec succès',
      life: 3000,
    })
    await loadPastries()
    showDeleteModal.value = false
    selectedPastry.value = null
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de supprimer le produit',
      life: 3000,
    })
  }
}

const handleView = (pastry: Pastry) => {
  selectedPastry.value = pastry
  showViewModal.value = true
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatTags = (tags: string[]) => {
  if (!tags || tags.length === 0) return []
  
  const tagMap: { [key: string]: string } = {
    'popular': 'Populaire',
    'new': 'Nouveau',
    'sale': 'Promo',
    'featured': 'Mis en avant'
  }
  
  return tags.map(tag => ({
    value: tag,
    label: tagMap[tag] || tag
  }))
}

const openActionMenu = (event: Event, pastry: Pastry) => {
  selectedPastryForMenu.value = pastry
  actionMenu.value?.toggle(event)
}

// Ajout d'une méthode pour reset les filtres
const resetFilters = () => {
  filters.value = {
    name: { value: null as string | null, matchMode: 'equals' },
    category: { value: null as { name: string } | null, matchMode: 'equals' },
    tags: { value: null as { value: string } | null, matchMode: 'equals' },
    diets: { value: null as { value: string } | null, matchMode: 'equals' }
  }
  first.value = 0
  loadPastries()
}

// Charger les paramètres depuis l'URL au montage
const loadParamsFromURL = () => {
  const query = route.query
  
  if (query.page) {
    const page = parseInt(query.page as string)
    first.value = (page - 1) * rows.value
  }
  
  if (query.limit) {
    rows.value = parseInt(query.limit as string)
  }
  
  if (query.sortBy) {
    sortField.value = query.sortBy as string
  }
  
  if (query.order) {
    sortOrder.value = query.order === 'desc' ? -1 : 1
  }
  
  if (query.query) {
    filters.value.name.value = query.query as string
  }
  
  if (query.categories) {
    filters.value.category.value = { name: query.categories as string }
  }
  
  if (query.tags) {
    filters.value.tags.value = { value: query.tags as string }
  }
  
  if (query.diets) {
    filters.value.diets.value = { value: query.diets as string }
  }
}

onMounted(() => {
  loadParamsFromURL()
  loadPastries()
  loadCategories()
})

// Fonction pour gérer la sauvegarde d'un pastry
const handleSavePastry = async (pastry: Pastry) => {
  try {
    await pastryService.updatePastry(pastry)
    await loadPastries()
    
    // Mettre à jour selectedPastry avec les nouvelles données
    const updatedPastry = pastries.value.find(p => p.id === pastry.id)
    if (updatedPastry) {
      selectedPastry.value = updatedPastry
    }
    
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Produit mis à jour avec succès',
      life: 3000,
    })
  } catch (error: any) {
    console.error('Erreur lors de la sauvegarde:', error)
    
    // Récupérer le message d'erreur du backend
    const errorMessage = error.response?.data?.error || 'Impossible de mettre à jour le produit'
    
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: errorMessage,
      life: 5000,
    })
    
    // Ne pas fermer le modal en cas d'erreur, laisser l'utilisateur corriger
  }
}

// Fonction pour gérer la création d'un pastry
const handleCreatePastry = async (pastry: Partial<Pastry>) => {
  try {
    await pastryService.createPastry(pastry)
    await loadPastries()
    
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Produit créé avec succès',
      life: 3000,
    })
    
    addModalRef.value?.resetForm()
    showAddModal.value = false
  } catch (error: any) {
    console.error('Erreur lors de la création:', error)
    
    // Récupérer le message d'erreur du backend
    const errorMessage = error.response?.data?.error || 'Impossible de créer le produit'
    
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: errorMessage,
      life: 5000,
    })
    
    // Ne pas fermer le modal en cas d'erreur, laisser l'utilisateur corriger
  }
}
</script>

<template>
  <div class="p-0">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4 pb-3 border-bottom-1 surface-border">
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-900 mb-2">Produits</h1>
        <p class="text-600 m-0">Administrez vos produits de pâtisserie</p>
      </div>
      <div class="flex gap-2">
        <Button
          label="Réinitialiser les filtres"
          icon="pi pi-refresh"
          @click="resetFilters"
          class="p-button-outlined"
        />
        <Button
          label="Ajouter un produit"
          icon="pi pi-plus"
          @click="handleAdd"
          class="bg-gray-900 border-gray-900 text-white hover:bg-gray-800 hover:border-gray-800"
        />
      </div>
    </div>
    
    <!-- DataTable -->
    <div class="bg-white border-1 surface-border border-round overflow-hidden min-w-0">
      <DataTable
        v-model:filters="filters"
        :value="pastries"
        :loading="loading"
        filter-display="row"
        data-key="id"
        :paginator="true"
        :rows="rows"
        :total-records="totalRecords"
        :first="first"
        :rows-per-page-options="[5, 10, 20, 50]"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        current-page-report-template="Affichage de {first} à {last} sur {totalRecords} produits"
        responsive-layout="scroll"
        class="w-full min-w-800"
        @page="onPage"
        @sort="onSort"
        @filter="onFilter"
        lazy
      >
        <!-- Image -->
        <Column field="image" header="Image" :sortable="false" style="width: 80px">
          <template #body="slotProps">
            <div class="w-3rem h-3rem border-round overflow-hidden bg-gray-100">
              <img
                :src="slotProps.data.images && slotProps.data.images.length > 0 ? slotProps.data.images[0] : '/no-image.svg'"
                :alt="slotProps.data.name"
                class="w-full h-full object-cover"
                @error="(e) => (e.target as HTMLImageElement).src = '/no-image.svg'"
              />
            </div>
          </template>
        </Column>

        <!-- Name -->
        <Column
          field="name"
          header="Nom"
          :sortable="true"
          :showFilterMenu="false"
          style="min-width: 200px"
        >
          <template #body="slotProps">
            <div class="max-w-200 overflow-hidden">
              <span class="font-medium block text-ellipsis overflow-hidden whitespace-nowrap" :title="slotProps.data.name">{{ slotProps.data.name }}</span>
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText 
              v-model="filterModel.value" 
              type="text" 
              @input="filterCallback()" 
              placeholder="Rechercher par nom..." 
              class="w-full"
            />
          </template>
        </Column>

        <!-- Category -->
        <Column
          field="category"
          header="Catégorie"
          :showFilterMenu="false"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <span>{{ slotProps.data.category.name }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Select 
              v-model="filterModel.value" 
              @change="filterCallback()" 
              :options="filteredCategories" 
              option-label="name" 
              placeholder="Catégorie..." 
              :show-clear="true"
              class="w-full"
            />
          </template>
        </Column>

        <!-- Price -->
        <Column
          field="price"
          header="Prix"
          :sortable="true"
          style="min-width: 100px"
        >
          <template #body="slotProps">
            <span class="font-medium">{{ formatPrice(slotProps.data.price) }}</span>
          </template>
        </Column>

        <!-- Stock -->
        <Column
          field="stockCount"
          header="Stock"
          :sortable="true"
          style="min-width: 80px"
          body-class="text-center"
        >
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.stockCount.toString()"
              :severity="
                slotProps.data.stockCount > 10 ? 'success' :
                slotProps.data.stockCount >= 3 ? 'warn' : 'danger'
              "
            />
          </template>
        </Column>

        <!-- Diets -->
        <Column
          field="diets"
          header="Régimes alimentaires"
          :sortable="false"
          :showFilterMenu="false"
          style="min-width: 150px"
        >
          <template #body="slotProps">
            <div class="flex gap-1 flex-wrap">
              <DietIcon
                v-for="diet in slotProps.data.diets"
                :key="diet.id"
                :name="DIET_CONFIG[diet.name]?.name"
                :label="diet.name"
              />
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Select 
              v-model="filterModel.value" 
              @change="filterCallback()" 
              :options="filteredDietOptions" 
              option-label="label"
              placeholder="Régime..." 
              :show-clear="true"
              class="w-full"
            />
          </template>
        </Column>

        <!-- Tags -->
        <Column
          field="tags"
          header="Tags"
          :sortable="false"
          :showFilterMenu="false"
          style="min-width: 120px"
        >
          <template #body="slotProps">
            <div class="flex gap-1 flex-wrap">
              <Tag
                v-for="tag in formatTags(slotProps.data.tags)"
                :key="tag.value"
                :value="tag.label"
              />
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Select 
              v-model="filterModel.value" 
              @change="filterCallback()" 
              :options="filteredTagOptions" 
              option-label="label" 
              placeholder="Tag..." 
              :show-clear="true"
              class="w-full"
            />
          </template>
        </Column>

        <!-- Actions -->
        <Column
          header="Actions"
          :exportable="false"
          class="text-center"
          body-class="actions-cell"
          style="width: 120px"
        >
          <template #body="slotProps">
            <div class="flex justify-content-center align-items-center gap-2">
              <Button
                icon="pi pi-pencil"
                text
                rounded
                size="small"
                aria-label="Modifier"
                @click="handleEdit(slotProps.data)"
                class="p-button-outlined"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                size="small"
                aria-label="Supprimer"
                @click="handleDelete(slotProps.data)"
                class="p-button-outlined p-button-danger"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="text-center py-8">
            <i class="pi pi-search text-4xl text-gray-400 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-600 mb-2">Aucun résultat trouvé</h3>
            <p class="text-gray-500 mb-4">Essayez de modifier vos critères de recherche</p>
            <Button label="Réinitialiser les filtres" icon="pi pi-refresh" @click="resetFilters" class="p-button-outlined" />
          </div>
        </template>
      </DataTable>
    </div>

    <AddPastryModal
      ref="addModalRef"
      v-model:visible="showAddModal"
      @save="handleCreatePastry"
    />

    <EditPastryModal
      v-model:visible="showEditModal"
      :pastry="selectedPastry"
      @save="handleSavePastry"
    />

    <DeletePastryModal
      v-model:visible="showDeleteModal"
      :pastry="selectedPastry"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
@media (max-width: 1200px) {
  .min-w-800 {
    min-width: 700px;
  }
}

@media (max-width: 768px) {
  .flex.justify-content-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .bg-white.border-1 {
    margin: 0 -1rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  
  .min-w-800 {
    min-width: 600px;
  }
}

:deep(.p-dropdown-trigger) {
  display: none;
}

/* Styles pour les images du tableau */
:deep(.p-datatable .p-datatable-tbody img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Conteneur des images */
:deep(.p-datatable .p-datatable-tbody .w-3rem.h-3rem) {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style> 