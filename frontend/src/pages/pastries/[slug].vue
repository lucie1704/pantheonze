<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pastryService } from '@/services/pastry.service'
import { ProductCard, DietIcon } from '@/components'
import Carousel from 'primevue/carousel'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

const route = useRoute()
const router = useRouter()
const quantity = ref(1)
const pastry = ref<any>(null)
const similarPastries = ref<any[]>([])
const loading = ref(true)

// Galerie photos
const images = ref<any[]>([])

onMounted(async () => {
  try {
    // Charger les données du produit par slug
    const pastryData = await pastryService.getPastryBySlug(route.params.slug as string)
    pastry.value = pastryData

    // Mettre à jour les images avec les vraies images du produit
    if (pastryData.images && pastryData.images.length > 0) {
      images.value = pastryData.images.map((img: string, index: number) => ({
        itemImageSrc: img,
        thumbnailImageSrc: img,
        alt: `${pastryData.name} - Vue ${index + 1}`,
      }))
    } else {
      // Image par défaut si pas d'images
      images.value = [
        {
          itemImageSrc: '/no-image.svg',
          thumbnailImageSrc: '/no-image.svg',
          alt: pastryData.name,
        },
      ]
    }

    // Charger les produits similaires (populaires pour l'instant)
    const popularPastries = await pastryService.getPopularPastries(8)
    similarPastries.value = popularPastries.filter((p) => p.id !== pastryData.id).slice(0, 8)
  } catch (error) {
    console.error('Erreur lors du chargement du produit:', error)
  } finally {
    loading.value = false
  }
})

const addToCart = () => {
  // Logique d'ajout au panier
  console.log('Ajout au panier:', {
    productSlug: route.params.slug,
    quantity: quantity.value,
  })
}

const handleAddToCart = (pastryData: any) => {
  // Navigation vers la page du produit avec slug
  router.push(`/pastries/${pastryData.slug}`)
}

const increaseQuantity = () => {
  if (quantity.value < 10) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-4">
    <div
      v-if="loading"
      class="flex justify-content-center py-6"
    >
      <ProgressSpinner style="width: 50px; height: 50px" />
    </div>

    <div
      v-else-if="pastry"
      class="grid"
    >
      <!-- Galerie photos (gauche sur desktop) -->
      <div class="col-12 lg:col-6 mb-4">
        <Galleria
          :value="images"
          :numVisible="5"
          :showThumbnails="true"
          :showIndicators="true"
          containerClass="w-full"
        >
          <template #item="slotProps">
            <img
              :src="slotProps.item.itemImageSrc"
              :alt="slotProps.item.alt"
              class="w-full h-25rem object-cover"
            />
          </template>
          <template #thumbnail="slotProps">
            <img
              :src="slotProps.item.thumbnailImageSrc"
              :alt="slotProps.item.alt"
              class="w-full h-4rem object-cover"
            />
          </template>
        </Galleria>
      </div>

      <!-- Informations principales (droite sur desktop) -->
      <div class="col-12 lg:col-6">
        <h1 class="text-4xl font-bold mb-3">{{ pastry.name }}</h1>

        <!-- Icônes des régimes alimentaires -->
        <div
          v-if="pastry.diets && pastry.diets.length > 0"
          class="flex flex-wrap gap-2 mb-4"
        >
          <DietIcon
            v-for="diet in pastry.diets"
            :key="diet.id"
            :icon-path="`/diet-icons/${diet.name.toLowerCase().replace(' ', '-')}.svg`"
            :label="diet.name"
          />
        </div>

        <div class="text-3xl text-primary font-bold mb-4">{{ pastry.price }}€</div>
        <p class="text-lg mb-6">{{ pastry.description }}</p>

        <!-- Contrôles de quantité -->
        <div class="flex align-items-center gap-4 mb-6">
          <div class="flex align-items-center gap-2">
            <Button
              icon="pi pi-minus"
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
              class="p-button-rounded p-button-text"
            />
            <span class="text-xl font-bold min-w-3rem text-center">{{ quantity }}</span>
            <Button
              icon="pi pi-plus"
              @click="increaseQuantity"
              :disabled="quantity >= 10"
              class="p-button-rounded p-button-text"
            />
          </div>
          <Button
            label="Ajouter au panier"
            icon="pi pi-shopping-cart"
            size="large"
            class="flex-grow-1"
            @click="addToCart"
            :disabled="!pastry.stockCount || pastry.stockCount <= 0"
          />
        </div>

        <!-- Disponibilité -->
        <div class="mb-6">
          <Tag
            :severity="pastry.stockCount && pastry.stockCount > 0 ? 'success' : 'danger'"
            :value="pastry.stockCount && pastry.stockCount > 0 ? 'En stock' : 'Indisponible'"
            class="text-lg"
          />
        </div>
      </div>
    </div>

    <!-- Accordéons de détails -->
    <div
      v-if="pastry"
      class="mt-6"
    >
      <Accordion>
        <!-- Ingrédients et nutrition -->
        <AccordionTab header="Ingrédients & Valeurs nutritionnelles">
          <div class="grid">
            <div class="col-12 lg:col-6">
              <h3 class="text-xl font-bold mb-3">Ingrédients</h3>
              <ul class="list-none p-0">
                <li
                  v-for="ingredient in pastry.ingredients"
                  :key="ingredient"
                  class="mb-2 p-2 surface-100 border-round"
                >
                  {{ ingredient }}
                </li>
              </ul>
            </div>
            <div class="col-12 lg:col-6">
              <h3 class="text-xl font-bold mb-3">Valeurs nutritionnelles</h3>
              <div class="grid">
                <div class="col-6">
                  <div class="surface-card p-3 border-round text-center">
                    <div class="text-2xl font-bold text-primary">{{ pastry.nutrition?.calories || 0 }}</div>
                    <div class="text-500">Calories</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="surface-card p-3 border-round text-center">
                    <div class="text-2xl font-bold text-primary">{{ pastry.nutrition?.protein || 0 }}g</div>
                    <div class="text-500">Protéines</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="surface-card p-3 border-round text-center">
                    <div class="text-2xl font-bold text-primary">{{ pastry.nutrition?.carbs || 0 }}g</div>
                    <div class="text-500">Glucides</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="surface-card p-3 border-round text-center">
                    <div class="text-2xl font-bold text-primary">{{ pastry.nutrition?.fat || 0 }}g</div>
                    <div class="text-500">Lipides</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionTab>

        <!-- Conservation -->
        <AccordionTab header="Conservation">
          <div class="p-3">
            <p class="text-lg mb-3">À conserver au réfrigérateur</p>
            <ul class="list-none p-0">
              <li class="mb-2 flex align-items-center">
                <i class="pi pi-clock text-primary mr-2"></i>
                À consommer dans les 48h après achat
              </li>
              <li class="mb-2 flex align-items-center">
                <i class="pi pi-snowflake text-primary mr-2"></i>
                Température de conservation : 2-4°C
              </li>
              <li class="mb-2 flex align-items-center">
                <i class="pi pi-exclamation-triangle text-warning mr-2"></i>
                Ne pas congeler
              </li>
            </ul>
          </div>
        </AccordionTab>
      </Accordion>
    </div>

    <!-- Produits similaires -->
    <div
      v-if="similarPastries.length > 0"
      class="mt-8"
    >
      <h2 class="text-2xl font-bold mb-4">Vous aimerez aussi</h2>
      <Carousel
        :value="similarPastries"
        :numVisible="4"
        :numScroll="4"
        :showNavigators="true"
        :showIndicators="true"
        class="carousel-container"
      >
        <template #item="slotProps">
          <div class="p-2">
            <ProductCard
              :pastry="slotProps.data"
              @add-to-cart="handleAddToCart"
            />
          </div>
        </template>
      </Carousel>
    </div>
  </div>
</template>
