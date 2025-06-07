<script setup lang="ts">
import { ref } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Tag from 'primevue/tag'

const props = defineProps<{
  product: {
    id: number
    name: string
    price: number
    image?: string
    tag?: Array<
      | 'Nouveau'
      | 'Populaire'
      | 'Vegan'
      | 'Végétarien'
      | 'Sans gluten'
      | 'Sans lactose'
    >
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
</script>

<template>
  <div class="surface-card border-round-xl overflow-hidden">
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
            :value="product.tag"
            severity="warning"
          />
        </div>
      </div>
    </div>

    <!-- Contenu -->
    <div class="p-3">
      <!-- Nom et Prix -->
      <div class="flex justify-content-between align-items-center mb-3">
        <h3 class="text-900 font-medium text-xl m-0">{{ product.name }}</h3>
        <span class="text-primary font-medium text-xl"
          >{{ product.price }}€</span
        >
      </div>

      <!-- Quantité et Bouton -->
      <div>
        <div>
          <InputNumber
            v-model="quantity"
            :min="1"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            class="w-full"
            size="small"
            decrementButtonClass="p-button-text p-button-sm"
            incrementButtonClass="p-button-text p-button-sm"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
          />
        </div>
        <div>
          <Button
            class="w-full"
            severity="primary"
            @click="addToCart"
          >
            <i class="pi pi-shopping-cart mr-2"></i>
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
