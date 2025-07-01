<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { ProductCard } from '@/components'
import FiltersPanel from '@/components/FiltersPanel.vue'
import { pastryService } from '@/services'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useCartStore } from '@/stores/cart'
import type { Pastry } from '@/types/pastry'
import type { Filter } from '@/types'
import { CartSuccessToast } from '@/components'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userPreferencesStore = useUserPreferencesStore()
const cartStore = useCartStore()
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

// Flag pour ignorer temporairement les préférences utilisateur
const ignoreUserPreferences = ref(false)

// Options de tri
const sortOptions = [
  { value: 'Populaire', label: 'Popularité' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'Nouveau', label: 'Nouveautés' },
]

const products = ref<Pastry[]>([])
const allProducts = ref<Pastry[]>([]) // Tous les produits chargés
const currentPage = ref(1)
const hasMore = ref(true)
const loadingMore = ref(false)
const limit = 10 // Nombre de produits par page

// Fonction pour mettre à jour l'URL avec les paramètres de recherche
const updateURL = () => {
  const query: Record<string, string> = {}

  if (searchQuery.value) {
    query.query = searchQuery.value
  }
  if (filters.value.categories.length) {
    query.categories = filters.value.categories.join(',')
  }
  if (filters.value.diets.length) {
    query.diets = filters.value.diets.join(',')
  }
  if (filters.value.priceRange[0] !== 0) {
    query.minPrice = filters.value.priceRange[0].toString()
  }
  if (filters.value.priceRange[1] !== 40) {
    query.maxPrice = filters.value.priceRange[1].toString()
  }
  if (filters.value.availability) {
    query.availability = 'true'
  }
  if (sortBy.value === 'price-asc') {
    query.sortBy = 'price'
    query.order = 'asc'
  } else if (sortBy.value === 'price-desc') {
    query.sortBy = 'price'
    query.order = 'desc'
  } else if (sortBy.value) {
    query.sortBy = sortBy.value
  }

  router.replace({ query })
}

// Fonction pour charger les paramètres depuis l'URL
const loadFromURL = async () => {
  const query = route.query

  if (query.query) {
    searchQuery.value = query.query as string
  }
  if (query.categories) {
    filters.value.categories = (query.categories as string).split(',')
  }
  if (query.diets) {
    filters.value.diets = (query.diets as string).split(',')
  }
  if (query.minPrice) {
    filters.value.priceRange[0] = parseInt(query.minPrice as string)
  }
  if (query.maxPrice) {
    filters.value.priceRange[1] = parseInt(query.maxPrice as string)
  }
  if (query.availability) {
    filters.value.availability = query.availability === 'true'
  }
  if (query.sortBy === 'price' && query.order === 'asc') {
    sortBy.value = 'price-asc'
  } else if (query.sortBy === 'price' && query.order === 'desc') {
    sortBy.value = 'price-desc'
  } else if (query.sortBy) {
    sortBy.value = query.sortBy as string
  }
}

// Fonction pour appliquer les préférences utilisateur par défaut
const applyUserPreferences = async () => {
  if (!route.query.diets && !ignoreUserPreferences.value) {
    if (userPreferencesStore.userDietaryPreferences.length > 0 && filters.value.diets.length === 0) {
      filters.value.diets = userPreferencesStore.userDietaryPreferences.map(diet => diet.name)
    }
  }
}

const handleAddToCart = async ({ pastryId, quantity }: { pastryId: string; quantity: number }) => {
  const pastry = products.value.find((pastry) => pastry.id === pastryId)
  if (pastry) {
    try {
      await cartStore.addToCart(pastryId, quantity)
      toast.add({
        severity: 'success',
        summary: 'Produit ajouté',
        detail: `${quantity} × ${pastry.name} ajouté(s) au panier`,
        life: 5000,
        closable: true,
        group: 'cart'
      })
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible d\'ajouter le produit au panier',
        life: 3000,
      })
    }
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  updateURL()
}

const clearFilters = async () => {
  filters.value = {
    categories: [],
    diets: [],
    priceRange: [0, 40],
    availability: false,
  }
  searchQuery.value = ''
  sortBy.value = undefined
  ignoreUserPreferences.value = false // Reset du flag
  updateURL()
}

// Fonction pour supprimer les préférences appliquées automatiquement
const removeAppliedPreferences = () => {
  ignoreUserPreferences.value = true
  filters.value.diets = []
  updateURL()
}

const fetchPastries = async () => {
  loading.value = true
  error.value = null

  try {
    const params = new URLSearchParams()
    let hasFilters = false

    if (searchQuery.value) {
      params.append('query', searchQuery.value)
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
    if (filters.value.priceRange[0] !== 0) {
      params.append('minPrice', filters.value.priceRange[0].toString())
      hasFilters = true
    }
    if (filters.value.priceRange[1] !== 40) {
      params.append('maxPrice', filters.value.priceRange[1].toString())
      hasFilters = true
    }
    if (filters.value.availability) {
      params.append('availability', 'true')
      hasFilters = true
    }
    if (sortBy.value === 'price-asc') {
      params.append('sortBy', 'price')
      params.append('order', 'asc')
      hasFilters = true
    } else if (sortBy.value === 'price-desc') {
      params.append('sortBy', 'price')
      params.append('order', 'desc')
      hasFilters = true
    } else if (sortBy.value) {
      params.append('sortBy', sortBy.value)
      hasFilters = true
    }

    // Charger tous les produits sans limite pour l'infinite scroll
    params.append('limit', '1000') // Limite élevée pour charger tout
    params.append('page', '1')
    
    const response = hasFilters ? await pastryService.getAllPastries(params) : await pastryService.getAllPastries(params)
    allProducts.value = response.data
    products.value = allProducts.value.slice(0, limit)
    hasMore.value = allProducts.value.length > limit
  } catch {
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

// Fonction pour charger plus de produits
const loadMore = () => {
  if (loadingMore.value || !hasMore.value) return
  
  loadingMore.value = true
  
  setTimeout(() => {
    const start = products.value.length
    const end = start + limit
    const newProducts = allProducts.value.slice(start, end)
    
    products.value.push(...newProducts)
    hasMore.value = end < allProducts.value.length
    loadingMore.value = false
  }, 300) // Petit délai pour l'animation
}

// Intersection Observer pour détecter quand on arrive en bas
const loadMoreTrigger = ref<HTMLElement>()

onMounted(async () => {
  await userPreferencesStore.initialize()
  
  await loadFromURL()
  
  await applyUserPreferences()
  
  await fetchPastries()
})

// Initialiser l'intersection observer après le rendu
const initIntersectionObserver = () => {
  nextTick(() => {
    if (loadMoreTrigger.value) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && hasMore.value && !loadingMore.value) {
              loadMore()
            }
          })
        },
        { threshold: 0.1 }
      )
      
      observer.observe(loadMoreTrigger.value)
    }
  })
}

// Watcher pour les changements dans l'URL
watch(
  () => route.query,
  () => {
    // Reset du flag si des filtres diet sont explicitement définis dans l'URL
    if (route.query.diets) {
      ignoreUserPreferences.value = false
    }
    loadFromURL()
    fetchPastries()
  },
)

// Watchers pour mettre à jour l'URL quand les filtres changent
watch(searchQuery, () => {
  updateURL()
})

watch(
  filters,
  () => {
    updateURL()
  },
  { deep: true },
)

watch(sortBy, () => {
  updateURL()
})

// Watcher pour initialiser l'intersection observer quand les produits changent
watch(products, () => {
  initIntersectionObserver()
}, { deep: true })
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
        />
      </div>
    </div>

    <!-- Liste des produits -->
    <div class="col-12 lg:col-8 xl:col-9">
      <!-- Barre de recherche et contrôles -->
      <div class="flex flex-column gap-3 mb-4">
        <div class="flex flex-column lg:flex-row align-items-start lg:align-items-center gap-3">
          <div class="flex align-items-center flex-grow-1 w-full">
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
          <div class="flex align-items-center gap-3 w-full lg:w-auto">
            <Button
              icon="pi pi-filter"
              severity="primary"
              class="lg:hidden w-4rem"
              @click="showFilters = true"
            />
            <Select
              v-model="sortBy"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Trier par"
              class="w-full lg:w-16rem"
              :show-clear="true"
            />
          </div>
        </div>

        <div class="flex flex-column lg:flex-row justify-content-between align-items-start lg:align-items-center gap-3">
          <div class="flex flex-column gap-2">
            <span
              v-if="searchQuery"
              class="text-500"
              ><strong>"{{ searchQuery }}"</strong> {{ allProducts.length }} résultats</span
            >

            <span
              v-else
              class="text-500"
              >{{ allProducts.length }} résultats</span
            >

            <!-- Message informatif pour les préférences appliquées -->
            <div
              v-if="
                userPreferencesStore.userDietaryPreferences.length > 0 && filters.diets.length > 0 && !ignoreUserPreferences
              "
              class="flex align-items-center gap-2 text-sm text-primary"
            >
              <i class="pi pi-info-circle"></i>
              <span>Vos préférences alimentaires sont appliquées :</span>
              <a
                href="#"
                class="text-primary cursor-pointer no-underline hover:underline"
                @click.prevent="removeAppliedPreferences"
              >
                supprimer
              </a>
            </div>
          </div>
          <div class="flex-grow-1 lg:flex-grow-0"></div>
        </div>
      </div>

      <div
        v-if="loading"
        class="flex justify-content-center"
      >
        <ProgressSpinner
          style="width: 40px; height: 40px"
          strokeWidth="4"
          fill="transparent"
        />
      </div>

      <div
        v-else-if="error"
        class="flex justify-content-center"
      >
        <Toast
          severity="error"
          :text="error"
        />
      </div>

      <!-- Message aucun résultat -->
      <div
        v-else-if="products.length === 0"
        class="flex flex-column align-items-center justify-content-center py-8"
      >
        <div class="text-center">
          <i class="pi pi-search text-6xl text-400 mb-4"></i>
          <h3 class="text-2xl font-bold text-900 mb-2">Aucun résultat trouvé</h3>
          <p class="text-600 mb-4">
            Aucune pâtisserie ne correspond à vos critères de recherche.
          </p>
          <Button
            label="Réinitialiser les filtres"
            icon="pi pi-refresh"
            severity="primary"
            @click="clearFilters"
            class="mb-3"
          />
          <p class="text-sm text-500">
            Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
          </p>
        </div>
      </div>

      <!-- Grille des produits -->
      <div
        class="grid"
        v-else
      >
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

      <!-- Trigger pour l'infinite scroll -->
      <div
        v-if="hasMore"
        ref="loadMoreTrigger"
        class="flex justify-content-center mt-4"
      >
        <div v-if="loadingMore" class="flex align-items-center gap-2">
          <ProgressSpinner style="width: 20px; height: 20px" />
          <span class="text-sm">Chargement...</span>
        </div>
      </div>

      <!-- Message fin de liste -->
      <div v-else-if="products.length > 0" class="flex justify-content-center mt-4">
        <span class="text-sm text-500">Tous les produits ont été chargés</span>
      </div>
    </div>
  </div>

  <CartSuccessToast />
</template>
