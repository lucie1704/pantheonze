<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pastryService } from '@/services'
import { ProductCard, DietIcon } from '@/components'
import { DIET_CONFIG } from '@/constants/diets'
import Carousel from 'primevue/carousel'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'primevue/usetoast'
import { CartSuccessToast }  from '@/components'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()
const quantity = ref(1)
const pastry = ref<any>(null)
const similarPastries = ref<any[]>([])
const loading = ref(true)

// Galerie photos
const images = ref<any[]>([])
const currentImageIndex = ref(0)

const loadPastryData = async () => {
  try {
    loading.value = true
    // Charger les données du produit par slug
    const pastryData = await pastryService.getPastryBySlug(route.params.slug as string)
    pastry.value = pastryData

    // Charger les produits similaires (populaires pour l'instant)
    const popularPastries = await pastryService.getPopularPastries(8)
    similarPastries.value = popularPastries.filter((p) => p.id !== pastryData.id).slice(0, 8)
  } catch (error) {
    console.error('Erreur lors du chargement du produit:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadPastryData)

// Surveiller les changements de route
watch(() => route.params.slug, () => {
  loadPastryData()
})

const addToCart = async () => {
  if (!pastry.value) return
  
  try {
    await cartStore.addToCart(pastry.value.id, quantity.value)
    toast.add({
      severity: 'success',
      summary: 'Produit ajouté',
      detail: `${quantity.value} × ${pastry.value.name} ajouté(s) au panier`,
      life: 5000,
      closable: true,
      group: 'cart'
    })
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible d\'ajouter le produit au panier',
      life: 3000,
    })
  }
}

const handleAddToCart = async (pastryData: any) => {
  try {
    await cartStore.addToCart(pastryData.id, 1)
    toast.add({
      severity: 'success',
      summary: 'Produit ajouté',
      detail: `${pastryData.name} ajouté au panier`,
      life: 5000,
      closable: true,
      group: 'cart'
    })
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible d\'ajouter le produit au panier',
      life: 3000,
    })
  }
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

const previousImage = () => {
  if (pastry.value.images && pastry.value.images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value - 1 + pastry.value.images.length) % pastry.value.images.length
  }
}

const nextImage = () => {
  if (pastry.value.images && pastry.value.images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % pastry.value.images.length
  }
}

const navigateToProduct = (slug: string) => {
  router.push(`/pastries/${slug}`)
}

const handleAddToCartFromCarousel = async (cartData: any) => {
  try {
    await cartStore.addToCart(cartData.pastryId, cartData.quantity)
    const pastry = similarPastries.value.find(p => p.id === cartData.pastryId)
    if (pastry) {
      toast.add({
        severity: 'success',
        summary: 'Produit ajouté',
        detail: `${cartData.quantity} × ${pastry.name} ajouté(s) au panier`,
        life: 5000,
        closable: true,
        group: 'cart'
      })
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible d\'ajouter le produit au panier',
      life: 3000,
    })
  }
}
</script>

<template>
  <div :key="String(route.params.slug)" class="max-w-screen-xl mx-auto p-4">
    <div v-if="loading" class="flex justify-content-center py-6">
      <ProgressSpinner style="width: 50px; height: 50px" />
    </div>
    <div v-else-if="pastry" class="grid">
      <!-- Galerie photos (gauche sur desktop) -->
      <div class="col-12 lg:col-6">
        <div class="relative w-full">
          <!-- Image principale -->
          <div class="relative border-round-xl overflow-hidden" style="aspect-ratio: 1">
            <img :src="pastry.images && pastry.images.length > 0 ? pastry.images[currentImageIndex] : '/no-image.svg'"
              :alt="pastry.name" class="w-full h-full product-image" />

            <!-- Flèches de navigation -->
            <Button v-if="pastry.images && pastry.images.length > 1" icon="pi pi-chevron-left"
              class="absolute left-2 top-50 transform-translate-y-n50 p-button-rounded p-button-text surface-200"
              @click="previousImage" />
            <Button v-if="pastry.images && pastry.images.length > 1"
              class="absolute right-2 top-50 transform-translate-y-n50 p-button-rounded p-button-text surface-200"
              @click="nextImage">
              <i class="pi pi-chevron-right"></i>
            </Button>
          </div>

          <!-- Points indicateurs -->
          <div v-if="pastry.images && pastry.images.length > 1" class="flex justify-content-center gap-2 mt-3">
            <div v-for="(image, index) in pastry.images" :key="index"
              class="w-2 h-2 border-round cursor-pointer transition-colors"
              :class="index === currentImageIndex ? 'bg-primary' : 'bg-300'" @click="currentImageIndex = index"></div>
          </div>
        </div>
      </div>

      <!-- Informations principales (droite sur desktop) -->
      <div class="col-12 lg:col-6 px-4">
        <div class="flex flex-column h-full">
          <h1 class="text-4xl font-bold mb-3">{{ pastry.name }}</h1>


          <div class="flex align-items-center gap-2">
            <!-- Icônes des régimes alimentaires -->
            <div v-if="pastry.diets && pastry.diets.length > 0" class="flex flex-wrap gap-2 mb-4">
              <DietIcon
                v-for="diet in pastry.diets"
                :key="diet.id"
                :diet-name="DIET_CONFIG[diet.name]?.dietName"
                :label="DIET_CONFIG[diet.name]?.label"
                :icon-only="false"
              />
            </div>
            <!-- Tags -->
            <div v-if="pastry.tags && pastry.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
              <Tag v-for="tag in pastry.tags" :key="tag" :value="tag" />
            </div>
          </div>


          <p class="text-lg mb-4">{{ pastry.description }}</p>

          <!-- Espace flexible pour aligner les boutons avec le bas de l'image -->
          <div class="flex-1"></div>

          <div class="text-3xl text-primary font-bold mb-3 text-right">{{ pastry.price.toFixed(2).replace('.', ',') }}€
          </div>


          <!-- Contrôles de quantité -->
          <div class="align-items-center gap-4">
            <div v-if="pastry.stockCount > 0" class="flex gap-2">
              <div
                class="quantity-control flex align-items-center justify-content-between border-1 surface-border border-round flex-1"
                @click.stop>
                <Button icon="pi pi-minus" text @click.stop="decreaseQuantity" :disabled="quantity <= 1"
                  class="quantity-button flex-none" />
                <input type="number" v-model="quantity" min="1" class="quantity-input flex-none" @click.stop />
                <Button icon="pi pi-plus" text @click.stop="increaseQuantity" class="quantity-button flex-none" />
              </div>
              <Button class="flex-1" severity="primary" @click.stop="addToCart">
                <i class="pi pi-shopping-cart"></i>
                <span class="hidden sm:inline">Ajouter au panier</span>
              </Button>
            </div>
            <div v-else class="text-center">
              <Tag severity="secondary" value="Rupture de stock" class="w-full justify-content-center py-2" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Accordéons de détails -->
    <div v-if="pastry" class="mt-6">
      <Accordion :value="['0']" multiple>
        <AccordionPanel value="0">
          <AccordionHeader>Ingrédients, Allergènes & Valeurs nutritionnelles</AccordionHeader>
          <AccordionContent>
            <div class="p-3">
              <p class="text-lg mt-0 leading-relaxed mb-4">Ingrédients : {{ pastry.ingredients.join(', ') }}</p>

              <p v-if="pastry.nutrition?.allergens && pastry.nutrition.allergens.length > 0"
                class="text-lg leading-relaxed mb-4">
                Allergènes : {{ pastry.nutrition.allergens.join(', ') }}
              </p>

              <p class="text-lg leading-relaxed mb-4">
                Valeurs nutritionnelles (pour 100g) :
              </p>

              <div class="surface-card border-round">
                <div class="overflow-x-auto">
                  <table class="w-auto border-round overflow-hidden border-1 surface-border min-w-full">
                    <thead>
                      <tr>
                        <th
                          class="text-center p-2 sm:p-3 font-medium border-right-1 surface-border border-bottom-1 surface-border text-sm sm:text-base">
                          Énergie
                        </th>
                        <th
                          class="text-center p-2 sm:p-3 font-medium border-right-1 surface-border border-bottom-1 surface-border text-sm sm:text-base">
                          Matières grasses
                        </th>
                        <th
                          class="text-center p-2 sm:p-3 font-medium border-right-1 surface-border border-bottom-1 surface-border text-sm sm:text-base">
                          Glucides
                        </th>
                        <th
                          class="text-center p-2 sm:p-3 font-medium border-bottom-1 surface-border text-sm sm:text-base">
                          Protéines</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          class="p-2 sm:p-3 text-center border-right-1 surface-border surface-border text-sm sm:text-base">
                          {{ pastry.nutrition?.calories || 0 }} kcal
                        </td>
                        <td
                          class="p-2 sm:p-3 text-center border-right-1 surface-border surface-border text-sm sm:text-base">
                          {{ pastry.nutrition?.fat || 0 }}g
                        </td>
                        <td
                          class="p-2 sm:p-3 text-center border-right-1 surface-border surface-border text-sm sm:text-base">
                          {{ pastry.nutrition?.carbs || 0 }}g
                        </td>
                        <td class="p-2 sm:p-3 text-center surface-border text-sm sm:text-base">{{
                          pastry.nutrition?.protein || 0 }}g</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <!-- Produits similaires -->
    <div v-if="similarPastries.length > 0" class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Vous aimerez aussi</h2>
      <Carousel :value="similarPastries" :numVisible="4" :numScroll="4" :showNavigators="false" :showIndicators="true"
        :responsiveOptions="[
          {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
          },
          {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
          },
          {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
          }
        ]" class="carousel-container">
        <template #item="slotProps">
          <div class="p-2">
            <div @click="navigateToProduct(slotProps.data.slug)" class="cursor-pointer">
              <ProductCard :pastry="slotProps.data" @add-to-cart="handleAddToCartFromCarousel" />
            </div>
          </div>
        </template>
      </Carousel>
    </div>
    <CartSuccessToast />
  </div>
</template>

<style scoped>
.quantity-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 8rem;
}

.quantity-button {
  width: 2.25rem !important;
  height: 2.25rem !important;
  flex: none;
}

.quantity-input {
  width: 2rem;
  border: none;
  text-align: center;
  background: transparent;
  font-size: 1rem;
  font-weight: 600;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Masquer les flèches du carousel sur mobile */
@media (max-width: 768px) {
  .carousel-container .p-carousel-prev,
  .carousel-container .p-carousel-next {
    display: none !important;
  }
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
