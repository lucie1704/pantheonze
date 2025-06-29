<script setup lang="ts">
import { ref, computed } from 'vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import DietIcon from './DietIcon.vue'
import { DIET_CONFIG } from '@/constants/diets'
import type { Pastry } from '@/types/pastry'

const props = defineProps<{
  pastry: Pastry
}>()

const quantity = ref(1)

const emit = defineEmits<{
  (e: 'add-to-cart', data: { pastryId: string; quantity: number }): void
}>()

const addToCart = () => {
  emit('add-to-cart', {
    pastryId: props.pastry.id,
    quantity: quantity.value,
  })
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const incrementQuantity = () => {
  quantity.value++
}
</script>

<template>
  <div
    class="surface-card border-round-xl overflow-hidden flex flex-column min-h-24rem min-w-16rem flex-shrink-0 product-card"
  >
    <!-- Lien vers la page détail (zone cliquable) -->
    <RouterLink
      :to="`/pastries/${pastry.slug}`"
      class="product-link flex flex-column flex-1 no-underline text-inherit"
    >
      <!-- Image ou Fallback -->
      <div class="p-3 pb-0">
        <div
          class="relative border-round-xl overflow-hidden"
          style="aspect-ratio: 1"
        >
          <img
            :src="pastry.images[0] || '/no-image.svg'"
            :alt="pastry.name"
            class="w-full h-full product-image"
          />
          <div
            v-if="pastry.tags.length > 0"
            class="absolute top-0 right-0 m-2"
          >
            <Tag
              :value="pastry.tags[0]"
              severity="warning"
            />
          </div>
        </div>
      </div>

      <!-- Contenu cliquable -->
      <div class="p-3 pb-0 flex flex-column flex-1">
        <!-- Nom -->
        <div class="product-header mb-2">
          <h3 class="text-900 font-medium text-xl m-0 line-height-3 product-title">{{ pastry.name }}</h3>
        </div>

        <!-- Espace flexible -->
        <div class="flex-1"></div>

        <!-- Prix et Diets (même ligne) -->
        <div class="flex justify-content-between align-items-center mb-2">
          <!-- Icônes des régimes alimentaires -->
          <div class="diet-icons-container">
            <div
              v-if="pastry.diets && pastry.diets.length > 0"
              class="flex gap-2 flex-wrap"
            >
              <DietIcon
                v-for="diet in pastry.diets"
                :key="diet.id"
                :icon-path="DIET_CONFIG[diet.name]?.iconPath"
                :label="DIET_CONFIG[diet.name]?.label"
                :icon-only="true"
              />
            </div>
          </div>

          <!-- Prix -->
          <div class="text-right">
            <span class="text-primary font-medium text-xl">{{ pastry.price.toFixed(2).replace('.', ',') }}€</span>
          </div>
        </div>
      </div>
    </RouterLink>

    <!-- Zone non-cliquable pour les contrôles -->
    <div class="p-3 pt-0">
      <div
        v-if="pastry.stockCount > 0"
        class="flex gap-2"
      >
        <div
          class="quantity-control flex align-items-center justify-content-between border-1 surface-border border-round flex-1"
          @click.stop
        >
          <Button
            icon="pi pi-minus"
            text
            @click.stop="decrementQuantity"
            :disabled="quantity <= 1"
            class="quantity-button flex-none"
          />
          <input
            type="number"
            v-model="quantity"
            min="1"
            class="quantity-input flex-none"
            @click.stop
          />
          <Button
            icon="pi pi-plus"
            text
            @click.stop="incrementQuantity"
            class="quantity-button flex-none"
          />
        </div>
        <Button
          class="flex-1"
          severity="primary"
          @click.stop="addToCart"
          v-tooltip="'Ajouter au panier'"
        >
          <i class="pi pi-shopping-cart"></i>
        </Button>
      </div>
      <div
        v-else
        class="text-center"
      >
        <Tag
          severity="secondary"
          value="Rupture de stock"
          class="w-full justify-content-center py-2"
        />
      </div>
    </div>
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
  padding: 0.5rem 0;
  appearance: textfield;
  -moz-appearance: textfield;
  flex: none;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input:focus {
  outline: none;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 4rem; 
}

.diet-icons-container {
  min-height: 2rem; /* Espace réservé pour les icônes même si vide */
  display: flex;
  align-items: flex-start;
  margin-top: 0.5rem;
}

.product-card {
  cursor: pointer;
}

.product-link {
  color: inherit;
  text-decoration: none;
}

.product-link:hover {
  color: inherit;
  text-decoration: none;
}
</style>
