<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { ProductCard } from '@/components'

const toast = useToast()

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
const viewMode = ref<'grid' | 'list'>('grid')
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
  categories: [
    'Gâteaux',
    'Tartes',
    'Macarons',
    'Viennoiseries',
    'Pièces montées',
  ],
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
    tag: 'Populaire',
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
    tag: 'Nouveau',
  },
  {
    id: 4,
    name: 'Tarte aux Fraises',
    price: 6.5,
  },
])

const handleAddToCart = ({
  productId,
  quantity,
}: {
  productId: number
  quantity: number
}) => {
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
  <div>
    <!-- En-tête avec recherche et contrôles -->
    <div
      class="flex flex-column md:flex-row justify-content-between align-items-center mb-4"
    >
      <h1 class="text-4xl font-bold mb-3 md:mb-0">Nos Pâtisseries</h1>

      <div class="flex gap-3 align-items-center">
        <span class="p-input-icon-left flex-grow-1">
          <i class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="Rechercher..."
            class="w-full"
          />
        </span>

        <div class="flex gap-2">
          <Button
            icon="pi pi-th-large"
            :severity="viewMode === 'grid' ? 'primary' : 'secondary'"
            @click="viewMode = 'grid'"
          />
          <Button
            icon="pi pi-list"
            :severity="viewMode === 'list' ? 'primary' : 'secondary'"
            @click="viewMode = 'list'"
          />
        </div>
      </div>
    </div>

    <!-- Filtres et contenu principal -->
    <div class="grid">
      <!-- Sidebar filtres -->
      <div class="col-12 md:col-3">
        <Panel
          header="Filtres"
          class="mb-3"
        >
          <!-- Catégories -->
          <div class="mb-4">
            <h3 class="text-xl mb-2">Catégories</h3>
            <div class="flex flex-column gap-2">
              <div
                v-for="category in filterOptions.categories"
                :key="category"
                class="flex align-items-center"
              >
                <Checkbox
                  v-model="filters.categories"
                  :value="category"
                  :inputId="category"
                />
                <label
                  :for="category"
                  class="ml-2"
                  >{{ category }}</label
                >
              </div>
            </div>
          </div>

          <!-- Régimes alimentaires -->
          <div class="mb-4">
            <h3 class="text-xl mb-2">Régimes alimentaires</h3>
            <div class="flex flex-column gap-2">
              <div
                v-for="diet in filterOptions.diets"
                :key="diet"
                class="flex align-items-center"
              >
                <Checkbox
                  v-model="filters.diets"
                  :value="diet"
                  :inputId="diet"
                />
                <label
                  :for="diet"
                  class="ml-2"
                  >{{ diet }}</label
                >
              </div>
            </div>
          </div>

          <!-- Prix -->
          <div class="mb-4">
            <h3 class="text-xl mb-2">Prix</h3>
            <Slider
              v-model="filters.priceRange"
              range
              class="mt-3"
            />
            <div class="flex justify-content-between mt-2">
              <span>{{ filters.priceRange[0] }}€</span>
              <span>{{ filters.priceRange[1] }}€</span>
            </div>
          </div>

          <!-- Saison -->
          <div class="mb-4">
            <h3 class="text-xl mb-2">Saison</h3>
            <Dropdown
              v-model="filters.season"
              :options="filterOptions.seasons"
              placeholder="Sélectionner une saison"
              class="w-full"
            />
          </div>

          <!-- Région -->
          <div class="mb-4">
            <h3 class="text-xl mb-2">Région</h3>
            <Dropdown
              v-model="filters.region"
              :options="filterOptions.regions"
              placeholder="Sélectionner une région"
              class="w-full"
            />
          </div>

          <!-- Disponibilité -->
          <div class="mb-4">
            <div class="flex align-items-center">
              <Checkbox
                v-model="filters.availability"
                inputId="availability"
                binary
              />
              <label
                for="availability"
                class="ml-2"
                >En stock uniquement</label
              >
            </div>
          </div>
        </Panel>
      </div>

      <!-- Liste des produits -->
      <div class="col-12 md:col-9">
        <!-- Contrôles de tri et pagination -->
        <div class="flex justify-content-between align-items-center mb-4">
          <Dropdown
            v-model="sortBy"
            :options="sortOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Trier par"
          />
          <Dropdown
            v-model="itemsPerPage"
            :options="[12, 24, 36, 48]"
            placeholder="Produits par page"
          />
        </div>

        <!-- Grille/Liste des produits -->
        <div :class="{ grid: viewMode === 'grid' }">
          <!-- Placeholder pour les produits -->
          <div
            v-for="product in products"
            :key="product.id"
            :class="{ 'col-12 md:col-4': viewMode === 'grid' }"
          >
            <ProductCard
              :product="product"
              @add-to-cart="handleAddToCart"
              class="h-full"
            />
            <!-- <div class="surface-card p-4 border-round mb-4">
              <div class="w-full h-15rem bg-primary-100 border-round mb-3"></div>
              <div class="animate-pulse bg-primary-100 w-8 h-2rem mb-2"></div>
              <div class="animate-pulse bg-primary-50 w-4 h-1rem"></div>
            </div> -->
          </div>
        </div>

        <!-- Pagination -->
        <Paginator
          v-model:first="currentPage"
          :rows="itemsPerPage"
          :totalRecords="100"
          class="mt-4"
        />
      </div>
    </div>
  </div>
</template>
