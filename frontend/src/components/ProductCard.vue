<script setup lang="ts">
import { ref } from 'vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'

const props = defineProps<{
  product: {
    id: number
    name: string
    price: number
    image?: string
    tag?: Array<'Nouveau' | 'Populaire' | 'Vegan' | 'Végétarien' | 'Sans gluten' | 'Sans lactose'>
    inStock?: boolean
  }
}>()

const quantity = ref(1)

const emit = defineEmits<{
  (e: 'add-to-cart', data: { productId: number; quantity: number }): void
}>()

const addToCart = () => {
  emit('add-to-cart', {
    productId: props.product.id,
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
    class="surface-card border-round-xl overflow-hidden flex flex-column min-h-25rem h-full min-w-16rem flex-shrink-0"
  >
    <!-- Image ou Fallback -->
    <div class="p-3 pb-0">
      <div
        class="relative border-round-xl overflow-hidden"
        style="aspect-ratio: 1"
      >
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full bg-primary-100"
        />
        <div
          v-if="product.tag"
          class="absolute top-0 right-0 m-2"
        >
          <Tag
            :value="product.tag[0]"
            severity="warning"
          />
        </div>
      </div>
    </div>

    <!-- Contenu -->
    <div class="p-3 flex flex-column flex-1">
      <!-- Nom -->
      <h3 class="text-900 font-medium text-xl m-0 line-height-3">{{ product.name }}</h3>

      <!-- Espace flexible -->
      <div class="flex-1"></div>

      <!-- Quantité, Prix et Bouton -->
      <div class="mt-3">
        <div class="mb-2 text-right">
          <span class="text-primary font-medium text-xl">{{ product.price.toFixed(2).replace('.', ',') }}€</span>
        </div>
        <div
          v-if="product.inStock !== false"
          class="flex gap-2"
        >
          <div
            class="quantity-control flex align-items-center justify-content-between border-1 surface-border border-round flex-1"
          >
            <Button
              icon="pi pi-minus"
              text
              @click="decrementQuantity"
              :disabled="quantity <= 1"
              class="quantity-button flex-none"
            />
            <input
              type="number"
              v-model="quantity"
              min="1"
              class="quantity-input flex-none"
            />
            <Button
              icon="pi pi-plus"
              text
              @click="incrementQuantity"
              class="quantity-button flex-none"
            />
          </div>
          <Button
            class="flex-1"
            severity="primary"
            @click="addToCart"
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
</style>
