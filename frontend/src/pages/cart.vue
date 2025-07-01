<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()

const promoCode = ref('')
const promoApplied = ref(false)
const promoDiscount = ref(0)

// Charger le panier au montage
onMounted(() => {
  cartStore.fetchCart()
})

// Calculs
const subtotal = computed(() => {
  return cartStore.items.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const preparationFees = computed(() => {
  return subtotal.value > 50 ? 0 : 5
})

const total = computed(() => {
  return subtotal.value + preparationFees.value - promoDiscount.value
})

// Actions
const updateQuantity = async (itemId: string, newQuantity: number) => {
  try {
    await cartStore.updateQuantity(itemId, newQuantity)
  } catch (error) {
    console.error('Error updating quantity:', error)
  }
}

const removeItem = async (itemId: string) => {
  try {
    await cartStore.removeFromCart(itemId)
  } catch (error) {
    console.error('Error removing item:', error)
  }
}

const applyPromoCode = () => {
  if (promoCode.value === 'BIENVENUE') {
    promoDiscount.value = subtotal.value * 0.1 // 10% de réduction
    promoApplied.value = true
    toast.add({
      severity: 'success',
      summary: 'Code promo appliqué',
      detail: 'Réduction de 10% appliquée',
      life: 3000,
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Code promo invalide',
      detail: 'Le code promo n\'est pas valide',
      life: 3000,
    })
  }
}

const clearCart = async () => {
  try {
    await cartStore.clearCart()
    promoApplied.value = false
    promoDiscount.value = 0
    promoCode.value = ''
  } catch (error) {
    console.error('Error clearing cart:', error)
  }
}

const proceedToCheckout = () => {
  if (cartStore.isEmpty) {
    toast.add({
      severity: 'warn',
      summary: 'Panier vide',
      detail: 'Votre panier est vide',
      life: 3000,
    })
    return
  }
  
  router.push('/order/informations')
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-4">
    <h1 class="text-4xl font-bold mb-4">Votre Panier</h1>

    <!-- Panier vide -->
    <div
      v-if="cartStore.isEmpty && !cartStore.loading"
      class="text-center py-8"
    >
      <i class="pi pi-shopping-cart text-6xl text-400 mb-4"></i>
      <h2 class="text-2xl font-bold mb-2">Votre panier est vide</h2>
      <p class="text-500 mb-4">Découvrez nos délicieuses pâtisseries et ajoutez-les à votre panier</p>
      <Button
        label="Voir nos pâtisseries"
        icon="pi pi-arrow-right"
        @click="$router.push('/pastries')"
      />
    </div>

    <!-- Panier avec articles -->
    <div
      v-else-if="cartStore.items.length > 0"
      class="grid"
    >
      <!-- Liste des produits -->
      <div class="col-12 lg:col-8">
        <div class="surface-card p-4 border-round mb-4">
          <!-- En-tête -->
          <div class="flex justify-content-between border-bottom-1 surface-border pb-3 mb-3">
            <span class="font-bold">Produit</span>
            <div class="flex gap-4">
              <span class="font-bold">Quantité</span>
              <span class="font-bold">Prix</span>
            </div>
          </div>

          <!-- Articles -->
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex align-items-center py-3 border-bottom-1 surface-border"
          >
            <!-- Image et infos -->
            <div class="flex align-items-center flex-grow-1">
              <img
                :src="item.pastry.images[0] || '/no-image.svg'"
                :alt="item.pastry.name"
                class="w-8rem h-6rem object-cover border-round mr-3"
              />
              <div>
                <h3 class="text-xl mb-2">{{ item.pastry.name }}</h3>
                <p class="text-500 mb-2">{{ item.pastry.category.name }}</p>
                <p class="text-500 mb-2">{{ item.pastry.description }}</p>
              </div>
            </div>

            <!-- Quantité et prix -->
            <div class="flex align-items-center gap-4">
              <InputNumber
                v-model="item.quantity"
                :min="1"
                :max="10"
                showButtons
                @change="updateQuantity(item.id, $event)"
                class="w-8rem"
              />
              <div
                class="text-right"
                style="width: 100px"
              >
                {{ (item.price * item.quantity).toFixed(2) }}€
              </div>
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                @click="removeItem(item.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Récapitulatif -->
      <div class="col-12 lg:col-4">
        <div class="surface-card p-4 border-round">
          <h2 class="text-2xl font-bold mb-4">Récapitulatif</h2>

          <!-- Code promo -->
          <div class="mb-4">
            <div class="flex gap-2">
              <InputText
                v-model="promoCode"
                placeholder="Code promo"
                :disabled="promoApplied"
                class="w-full"
              />
              <Button
                label="OK"
                @click="applyPromoCode"
                :disabled="promoApplied || !promoCode"
              />
            </div>
            <small
              v-if="promoApplied"
              class="text-success"
              >Code promo appliqué !</small
            >
          </div>

          <!-- Détails -->
          <div class="flex justify-content-between mb-3">
            <span>Sous-total</span>
            <span>{{ subtotal.toFixed(2) }}€</span>
          </div>

          <div class="flex justify-content-between mb-3">
            <span>Frais de préparation</span>
            <span>{{ preparationFees.toFixed(2) }}€</span>
          </div>

          <div
            v-if="promoDiscount > 0"
            class="flex justify-content-between mb-3 text-success"
          >
            <span>Réduction</span>
            <span>-{{ promoDiscount.toFixed(2) }}€</span>
          </div>

          <div class="flex justify-content-between font-bold text-xl border-top-1 surface-border pt-3">
            <span>Total</span>
            <span>{{ total.toFixed(2) }}€</span>
          </div>

          <div class="flex flex-column gap-2 mt-4">
            <Button
              label="Passer la commande"
              icon="pi pi-arrow-right"
              @click="proceedToCheckout"
              :loading="cartStore.loading"
            />
            <Button
              label="Vider le panier"
              icon="pi pi-trash"
              severity="danger"
              outlined
              @click="clearCart"
              :loading="cartStore.loading"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-else-if="cartStore.loading"
      class="text-center py-8"
    >
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
      <p class="mt-2">Chargement du panier...</p>
    </div>
  </div>
</template>
