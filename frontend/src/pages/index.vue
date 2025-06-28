<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'
import Carousel from 'primevue/carousel'
import ProgressSpinner from 'primevue/progressspinner'
import { ProductCard } from '@/components'
import { pastryService } from '@/services/pastry.service'
import type { Pastry } from '@/types/pastry'

const router = useRouter()
const toast = useToast()
const searchQuery = ref('')
const loading = ref(false)
const popularProducts = ref<Pastry[]>([])

// Configuration responsive du carrousel
const carouselResponsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: '768px',
    numVisible: 1,
    numScroll: 1,
  },
])

// Fonction pour effectuer une recherche
const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/pastries',
      query: { query: searchQuery.value.trim() },
    })
  } else {
    router.push('/pastries')
  }
}

// Fonction pour gérer l'ajout au panier
const handleAddToCart = (data: { pastryId: string; quantity: number }) => {
  const pastry = popularProducts.value.find((p) => p.id === data.pastryId)
  if (pastry) {
    toast.add({
      severity: 'success',
      summary: 'Ajouté au panier',
      detail: `${pastry.name} (${data.quantity}) a été ajouté au panier`,
      life: 3000,
    })
  }
}

// Charger les produits populaires
const loadPopularProducts = async () => {
  loading.value = true
  try {
    // Utiliser la nouvelle API pour récupérer les produits populaires
    popularProducts.value = await pastryService.getPopularPastries(6)
  } catch (error) {
    console.error('Erreur lors du chargement des produits populaires:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPopularProducts()
})
</script>

<template>
  <div class="home-page">
    <!-- Barre de recherche -->
    <section class="my-6">
      <div class="container mx-auto px-4">
        <div class="flex justify-content-center">
          <div class="w-8">
            <div class="flex gap-2">
              <IconField
                iconPosition="left"
                class="flex-1"
              >
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model="searchQuery"
                  placeholder="Rechercher vos pâtisseries préférées..."
                  class="w-full"
                  @keyup.enter="performSearch"
                />
              </IconField>
              <Button
                label="Rechercher"
                icon="pi pi-search"
                @click="performSearch"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Produits Populaires -->
    <section class="popular-section surface-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-3">
          <h2 class="text-4xl font-bold text-900 mb-3">Nos Créations Populaires</h2>
          <p class="text-xl text-600">Découvrez les pâtisseries préférées de nos clients</p>
        </div>

        <div
          v-if="loading"
          class="text-center py-8"
        >
          <ProgressSpinner />
        </div>

        <div v-else-if="popularProducts.length > 0">
          <Carousel
            :value="popularProducts"
            :numVisible="3"
            :numScroll="1"
            :responsiveOptions="carouselResponsiveOptions"
            circular
            :autoplayInterval="4000"
            class="popular-carousel"
          >
            <template #item="{ data: product }">
              <div class="p-3">
                <ProductCard
                  :pastry="product"
                  @add-to-cart="handleAddToCart"
                  class="h-full"
                />
              </div>
            </template>
          </Carousel>
        </div>

        <div class="text-center my-3">
          <Button
            label="Voir toutes nos créations"
            icon="pi pi-arrow-right"
            outlined
            @click="$router.push('/pastries')"
          />
        </div>
      </div>
    </section>

    <!-- Section Savoir-faire -->
    <section class="about-section py-3">
      <div class="container mx-auto px-4">
        <div class="text-center mb-3">
          <h2 class="text-4xl font-bold text-900 mb-3">Notre Savoir-faire</h2>
          <p class="text-xl text-600">L'excellence artisanale au service de vos papilles</p>
        </div>

        <div class="grid">
          <div class="col-12 md:col-4">
            <div class="service-card surface-0 text-center p-6 h-full">
              <div class="service-icon mb-4">
                <i class="pi pi-clock text-5xl text-primary"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">Fraîcheur quotidienne</h3>
              <p class="text-600 line-height-3">
                Nos pâtisseries sont préparées chaque matin avec des ingrédients frais pour vous garantir une qualité
                exceptionnelle.
              </p>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="service-card surface-0 text-center p-6 h-full">
              <div class="service-icon mb-4">
                <i class="pi pi-heart text-5xl text-primary"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">Ingrédients premium</h3>
              <p class="text-600 line-height-3">
                Beurre AOP, chocolat Valrhona, fruits de saison... Nous sélectionnons uniquement les meilleurs produits
                pour nos créations.
              </p>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="service-card surface-0 text-center p-6 h-full">
              <div class="service-icon mb-4">
                <i class="pi pi-star text-5xl text-primary"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">Tradition artisanale</h3>
              <p class="text-600 line-height-3">
                Techniques traditionnelles françaises transmises de génération en génération pour des pâtisseries
                d'exception.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Notre Histoire -->
    <section class="history-section my-3 surface-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-6">
          <h2 class="text-4xl font-bold text-900 mb-3">L'art pâtissier réinventé</h2>
          <p class="text-2xl text-primary font-semibold">Créativité moderne au cœur du 11e arrondissement</p>
        </div>

        <div class="grid align-items-center">
          <div class="col-12 lg:col-8">
            <div class="pr-0 lg:pr-6">
              <p class="text-lg text-700 mb-4 line-height-3">
                Au cœur du 11e arrondissement parisien, Panthéonze réinvente la pâtisserie française avec audace et
                créativité. Notre approche moderne allie techniques innovantes et ingrédients d'exception pour créer des
                expériences gustatives uniques.
              </p>
              <p class="text-lg text-600 mb-6 line-height-3">
                Dans ce quartier vibrant et créatif, nous cultivons l'art de la pâtisserie contemporaine, où chaque
                création reflète l'esprit avant-gardiste de notre époque tout en respectant l'excellence française.
              </p>
              <div class="flex justify-content-between align-items-center mb-4">
                <div class="flex gap-6">
                  <div class="text-center">
                    <div class="text-3xl font-bold text-primary">50+</div>
                    <div class="text-sm text-600">Créations originales</div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-primary">11e</div>
                    <div class="text-sm text-600">Arrondissement</div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-primary">2020</div>
                    <div class="text-sm text-600">Depuis</div>
                  </div>
                </div>
              </div>
              <Button
                label="Découvrir notre univers"
                icon="pi pi-arrow-right"
                outlined
                @click="$router.push('/about')"
              />
            </div>
          </div>
          <div class="col-12 lg:col-4">
            <div class="history-image-container">
              <img
                src="https://www.maisonmichaud.fr/wp-content/uploads/2025/04/IMG_5144-683x1024.jpg"
                alt="Pâtisseries modernes et créatives"
                class="history-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

.service-card {
  transition: all 0.3s ease;
  border-radius: 1rem;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.service-icon {
  transition: all 0.3s ease;
}

.service-card:hover .service-icon {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .flex.gap-2 {
    flex-direction: column;
  }
}

.history-image-container {
  height: 400px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.history-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
