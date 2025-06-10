<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { ProductCard } from '@/components'
import Sidebar from 'primevue/sidebar'
import FiltersPanel from '@/components/FiltersPanel.vue'
import Paginator from 'primevue/paginator'

const toast = useToast()
const showFilters = ref(false)

type ProductTag = 'Nouveau' | 'Populaire' | 'Vegan' | 'Végétarien' | 'Sans gluten' | 'Sans lactose'

// Types
interface Filter {
  categories: string[]
  diets: string[]
  priceRange: [number, number]
  season: string[]
  region: string[]
  availability: boolean
}

// État
const searchQuery = ref('')
const sortBy = ref('popularity')
const currentPage = ref(1)
const itemsPerPage = ref(12)

const filters = ref<Filter>({
  categories: [],
  diets: [],
  priceRange: [0, 100],
  season: [],
  region: [],
  availability: true,
})

// Options de filtres
const filterOptions = {
  categories: ['Gâteaux', 'Tartes', 'Macarons', 'Viennoiseries', 'Pièces montées'],
  diets: ['Végétarien', 'Vegan', 'Sans gluten', 'Sans lactose'],
  seasons: ['Printemps', 'Été', 'Automne', 'Hiver'],
  regions: ['Paris', 'Lyon', 'Bordeaux', 'Marseille'],
}

// Options de tri
const sortOptions = [
  { value: 'popularity', label: 'Popularité' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'rating', label: 'Meilleures notes' },
]

const products = ref([
  {
    id: 1,
    name: 'Éclair au Chocolat',
    price: 4.5,
    tag: ['Populaire' as ProductTag],
    inStock: true,
  },
  {
    id: 2,
    name: 'Paris-Brest',
    price: 5.0,
    inStock: true,
  },
  {
    id: 3,
    name: 'Mille-feuille',
    price: 4.8,
    tag: ['Nouveau' as ProductTag],
    inStock: false,
  },
  {
    id: 4,
    name: 'Tarte aux Fraises',
    price: 6.5,
    inStock: true,
  },
])

const filteredProducts = computed(() => {
  return products.value.filter((product) => product.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const resultsCount = computed(() => {
  return filteredProducts.value.length
})

const handleAddToCart = ({ productId, quantity }: { productId: number; quantity: number }) => {
  const product = products.value.find((p) => p.id === productId)
  if (product) {
    toast.add({
      severity: 'success',
      summary: 'Produit ajouté',
      detail: `${quantity} × ${product.name} ajouté(s) au panier`,
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
    priceRange: [0, 100],
    season: [],
    region: [],
    availability: true,
  }
}

const hasActiveFilters = computed(() => {
  return (
    filters.value.categories.length > 0 ||
    filters.value.diets.length > 0 ||
    filters.value.season.length > 0 ||
    filters.value.region.length > 0 ||
    filters.value.priceRange[0] > 0 ||
    filters.value.priceRange[1] < 100 ||
    !filters.value.availability
  )
})
</script>

<template>
  <div class="grid py-3">
    <!-- Sidebar filtres (version mobile) -->
    <Sidebar
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
          :options="filterOptions"
          @reset-filters="clearFilters"
        />
      </div>
    </Sidebar>

    <!-- Sidebar filtres (version desktop) -->
    <div class="hidden lg:block col-3">
      <div class="surface-card border-round-xl p-4">
        <div class="flex align-items-center gap-2 mb-2">
          <i class="pi pi-filter text-primary-500"></i>
          <h2 class="text-xl font-bold m-0 text-primary-500">Filtres</h2>
        </div>
        <FiltersPanel
          v-model:filters="filters"
          :options="filterOptions"
          @reset-filters="clearFilters"
        />
      </div>
    </div>

    <!-- Liste des produits -->
    <div class="col-12 lg:col-9">
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
          <div
            v-if="searchQuery"
            class="flex flex-column gap-2"
          >
            <span class="text-500">"{{ searchQuery }}" ({{ resultsCount }})</span>
          </div>
          <div class="flex-grow-1 lg:flex-grow-0"></div>
          <div class="flex flex-column lg:flex-row align-items-start lg:align-items-center gap-2 w-full lg:w-auto">
            <label
              for="sort-select"
              class="text-900"
              >Résultats triés par</label
            >
            <Dropdown
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

      <!-- Grille des produits -->
      <div class="grid">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="col-12 md:col-6 xl:col-4"
        >
          <ProductCard
            :product="product"
            @add-to-cart="handleAddToCart"
            class="h-full"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-content-center mt-4">
        <Paginator
          v-model:first="currentPage"
          :rows="itemsPerPage"
          :totalRecords="resultsCount"
          :rowsPerPageOptions="[12, 24, 36]"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          class="w-full md:w-auto"
        />
      </div>
    </div>
  </div>
</template>
