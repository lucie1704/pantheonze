<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { ProductCard } from '@/components'
import Sidebar from 'primevue/sidebar'
import FiltersPanel from '@/components/FiltersPanel.vue'

const toast = useToast()
const showFilters = ref(false)

type ProductTag = 'Nouveau' | 'Populaire' | 'Vegan' | 'Végétarien' | 'Sans gluten' | 'Sans lactose'

// Types
interface Filter {
  categories: string[]
  diets: string[]
  priceRange: [number, number]
  season: string
  region: string
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
  season: '',
  region: '',
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
  },
  {
    id: 2,
    name: 'Paris-Brest',
    price: 5.0,
  },
  {
    id: 3,
    name: 'Mille-feuille',
    price: 4.8,
    tag: ['Nouveau' as ProductTag],
  },
  {
    id: 4,
    name: 'Tarte aux Fraises',
    price: 6.5,
  },
])

const filteredProducts = computed(() => {
  return products.value.filter((product) => product.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
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
</script>

<template>
  <div class="grid">
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
        />
      </div>
    </Sidebar>

    <!-- Sidebar filtres (version desktop) -->
    <div class="hidden lg:block col-3">
      <div class="surface-card border-round-xl p-4">
        <h2 class="text-xl font-bold mb-4">Filtres</h2>
        <FiltersPanel
          v-model:filters="filters"
          :options="filterOptions"
        />
      </div>
    </div>

    <!-- Liste des produits -->
    <div class="col-12 lg:col-9">
      <!-- Barre de recherche et contrôles -->
      <div class="flex flex-column md:flex-row justify-content-between align-items-center mb-4">
        <div class="flex align-items-center w-full">
          <Button
            icon="pi pi-filter"
            label="Filtres"
            severity="secondary"
            class="lg:hidden"
            @click="showFilters = true"
          />
          <div class="flex align-items-center w-full flex-grow-1">
            <InputText
              v-model="searchQuery"
              placeholder="Rechercher une pâtisserie..."
              class="w-full rounded-xl shadow-sm"
            />
            <Button
              icon="pi pi-search"
              class="text-primary-900"
              text
              style="margin-left: -3rem"
            />
          </div>
        </div>

        <div class="flex gap-2 w-full md:w-auto">
          <Dropdown
            v-model="sortBy"
            :options="sortOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Trier par"
            class="w-full md:w-auto"
          />
          <Dropdown
            v-model="itemsPerPage"
            :options="[12, 24, 36, 48]"
            placeholder="Par page"
            class="w-full md:w-auto"
          />
        </div>
      </div>

      <div class="text-500 mb-4">{{ resultsCount }} résultats trouvés</div>

      <!-- Grille des produits -->
      <div class="grid">
        <div
          v-for="product in filteredProducts"
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
      <Paginator
        v-model:first="currentPage"
        :rows="itemsPerPage"
        :totalRecords="resultsCount"
        class="mt-4"
      />
    </div>
  </div>
</template>
