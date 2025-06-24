<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { ProductCard } from '@/components'
import Drawer from 'primevue/drawer'
import FiltersPanel from '@/components/FiltersPanel.vue'
import { pastryService } from '@/services/pastry.service'
import type { Pastry } from '@/types/pastry'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Select from 'primevue/select'
import type { Filter } from '@/types'

const toast = useToast()
const showFilters = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const searchQuery = ref('')
const sortBy = ref()

const filters = ref<Filter>({
  categories: [],
  diets: [],
  priceRange: [0, 40],
  availability: false,
})

// Options de tri
const sortOptions = [
  { value: 'popularity', label: 'Popularité' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'rating', label: 'Meilleures notes' },
]

const products = ref<Pastry[]>([])

const handleAddToCart = ({ pastryId, quantity }: { pastryId: string; quantity: number }) => {
  const pastry = products.value.find((pastry) => pastry.id === pastryId)
  if (pastry) {
    toast.add({
      severity: 'success',
      summary: 'Produit ajouté',
      detail: `${quantity} × ${pastry.name} ajouté(s) au panier`,
      life: 3000,
    })
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const clearFilters = () => {
  filters.value = {
    categories: [],
    diets: [],
    priceRange: [0, 40],
    availability: false,
  }
}

const fetchPastries = async () => {
  loading.value = true
  error.value = null

  try {
    const params = new URLSearchParams()
    let hasFilters = false

    if (searchQuery.value) {
      params.append('q', searchQuery.value)
      hasFilters = true
    }
    if (filters.value.categories.length) {
      params.append('categories', filters.value.categories.join(','))
      hasFilters = true
    }
    if (filters.value.diets.length) {
      params.append('diets', filters.value.diets.join(','))
      hasFilters = true
    }
    if (filters.value.priceRange[0]) {
      params.append('minPrice', filters.value.priceRange[0].toString())
      hasFilters = true
    }
    if (filters.value.priceRange[1]) {
      params.append('maxPrice', filters.value.priceRange[1].toString())
      hasFilters = true
    }
    if (filters.value.availability !== true) {
      params.append('availability', filters.value.availability ? 'true' : 'false')
      hasFilters = true
    }
    if (sortBy.value) {
      params.append('sortBy', sortBy.value)
      hasFilters = true
    }

    products.value = hasFilters ? await pastryService.getAllPastries(params) : await pastryService.getAllPastries()
  } catch (err) {
    error.value = 'Erreur lors du chargement des pâtisseries'
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: error.value,
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPastries()
})
</script>

<template>
  <div class="grid py-3">
    <!-- Drawer filtres (version mobile) -->
    <Drawer
      v-model:visible="showFilters"
      position="left"
      class="lg:hidden"
      :modal="true"
      :dismissable="true"
      :showCloseIcon="true"
      style="width: 20rem"
    >
      <template #header>
        <h2 class="text-xl font-bold m-0">Filtres</h2>
      </template>
      <div class="p-3">
        <FiltersPanel
          v-model:filters="filters"
          @reset-filters="clearFilters"
          @update:filters="fetchPastries"
        />
      </div>
    </Drawer>

    <!-- Sidebar filtres (version desktop) -->
    <div class="hidden lg:block col-4 xl:col-3">
      <div class="surface-card border-round-xl p-4">
        <div class="flex align-items-center gap-2 mb-2">
          <i class="pi pi-filter text-primary-500"></i>
          <h2 class="text-xl font-bold m-0 text-primary-500">Filtres</h2>
        </div>
        <FiltersPanel
          v-model:filters="filters"
          @reset-filters="clearFilters"
          @update:filters="fetchPastries"
        />
      </div>
    </div>

    <!-- Liste des produits -->
    <div class="col-12 lg:col-8 xl:col-9">
      <!-- Barre de recherche et contrôles -->
      <div class="flex flex-column gap-3 mb-4">
        <div class="flex align-items-center gap-3">
          <Button
            icon="pi pi-filter"
            severity="primary"
            class="lg:hidden w-2"
            @click="showFilters = true"
          />
          <div class="flex align-items-center w-full flex-grow-1">
            <InputText
              v-model="searchQuery"
              icon="pi pi-search"
              placeholder="Rechercher..."
              class="w-full rounded-xl shadow-sm"
            />
            <Button
              v-if="searchQuery"
              icon="pi pi-times"
              class="text-500 bg-transparent"
              text
              plain
              style="margin-left: -3rem"
              @click="clearSearch"
            />
            <Button
              v-else
              icon="pi pi-search"
              class="text-500 bg-transparent"
              text
              plain
              style="margin-left: -3rem"
            />
          </div>
        </div>

        <div class="flex flex-column lg:flex-row justify-content-between align-items-start lg:align-items-center gap-3">
          <div class="flex flex-column gap-2">
            <span
              v-if="searchQuery"
              class="text-500"
              ><strong>"{{ searchQuery }}"</strong> {{ products.length }} résultats</span
            >

            <span
              v-else
              class="text-500"
              >{{ products.length }} résultats</span
            >
          </div>
          <div class="flex-grow-1 lg:flex-grow-0"></div>
          <div class="flex flex-column lg:flex-row align-items-start lg:align-items-center gap-2 w-full lg:w-auto">
            <label
              for="sort-select"
              class="text-900"
            >
              Résultats triés par
            </label>
            <Select
              id="sort-select"
              v-model="sortBy"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Trier par"
              class="w-full lg:w-10rem"
            />
          </div>
        </div>
      </div>

      <div
        v-if="loading"
        class="flex justify-content-center"
      >
        <ProgressSpinner />
      </div>

      <div
        v-else-if="error"
        class="flex justify-content-center"
      >
        <Message
          severity="error"
          :text="error"
        />
      </div>

      <!-- Grille des produits -->
      <div class="grid">
        <div
          v-for="product in products"
          :key="product.id"
          class="col-12 md:col-6 xl:col-4"
        >
          <ProductCard
            :pastry="product"
            @add-to-cart="handleAddToCart"
            class="h-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
