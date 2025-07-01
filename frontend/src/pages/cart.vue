<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'primevue/usetoast'
import DietIcon from '@/components/DietIcon.vue'
import { DIET_CONFIG } from '@/constants/diets'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const cartStore = useCartStore()

const promoCode = ref('')
const promoApplied = ref(false)
const promoDiscount = ref(0)

onMounted(() => {
  cartStore.fetchCart()
})

watch(() => route.path, (newPath) => {
  if (newPath === '/cart') {
    cartStore.fetchCart()
  }
})

const subtotal = computed(() => {
  return cartStore.items.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const total = computed(() => {
  return subtotal.value - promoDiscount.value
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
      v-if="!cartStore.loading && cartStore.isEmpty"
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
      v-else-if="!cartStore.loading && !cartStore.isEmpty"
      class="grid"
    >
      <!-- Liste des produits -->
      <div class="col-12 lg:col-8">

        <div class="surface-card p-4 border-round mb-4">
          <!-- Version Desktop -->
          <div class="hidden md:block">
            <table class="w-full">
              <thead>
                <tr class="border-bottom-2 surface-border pb-3 mb-3">
                  <th class="text-left font-bold pb-3 border-bottom-1 surface-border" style="width: 30%;">Produit</th>
                  <th class="text-center font-bold pb-3 border-bottom-1 surface-border">Quantité</th>
                  <th class="text-center font-bold pb-3 border-bottom-1 surface-border">Prix</th>
                  <th class="text-center font-bold pb-3 border-bottom-1 surface-border w-3rem"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in cartStore.items"
                  :key="item.id"
                >
                  <!-- Produit -->
                  <td class="py-4 w-6 border-bottom-1 surface-border">
                    <div class="flex align-items-center">
                      <div class="w-6rem h-6rem border-round overflow-hidden bg-gray-100 flex-shrink-0 relative mr-3">
                        <img
                          :src="item.pastry.images[0] || '/no-image.svg'"
                          :alt="item.pastry.name"
                          class="cart-product-image"
                        />
                      </div>
                      <div class="flex flex-column gap-2">
                        <h3 class="text-xl mb-0 mt-0">{{ item.pastry.name }}</h3>
                        <div 
                          v-if="item.pastry.diets && item.pastry.diets.length > 0"
                          class="" 
                        >
                          <DietIcon
                            v-for="(diet, index) in item.pastry.diets"
                            :key="diet.id"
                            :diet-name="DIET_CONFIG[diet.name]?.dietName"
                            :label="DIET_CONFIG[diet.name]?.label"
                            :class="index < item.pastry.diets.length - 1 ? 'mb-1' : ''"
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Quantité -->
                  <td class="py-4 text-center border-bottom-1 surface-border">
                    <div
                      class="quantity-control flex align-items-center justify-content-between border-1 surface-border border-round mx-auto"
                      style="max-width: 8rem;"
                    >
                      <Button
                        icon="pi pi-minus"
                        text
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="quantity-button flex-none"
                      />
                      <input
                        v-model="item.quantity"
                        min="1"
                        class="quantity-input flex-none"
                      />
                      <Button
                        icon="pi pi-plus"
                        text
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="quantity-button flex-none"
                      />
                    </div>
                  </td>

                  <!-- Prix -->
                  <td class="py-4 text-center border-bottom-1 surface-border">
                    <span class="font-medium text-lg">{{ (item.price * item.quantity).toFixed(2) }}€</span>
                  </td>

                  <!-- Actions -->
                  <td class="py-4 text-center border-bottom-1 surface-border">
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      @click="removeItem(item.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Version Mobile -->
          <div class="md:hidden">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="surface-card p-4 border-round mb-3 border-1 surface-border"
            >
              <!-- Produit -->
              <div class="flex align-items-start mb-3">
                <div class="w-5rem h-5rem border-round overflow-hidden bg-gray-100 flex-shrink-0 relative mr-3">
                  <img
                    :src="item.pastry.images[0] || '/no-image.svg'"
                    :alt="item.pastry.name"
                    class="cart-product-image"
                  />
                </div>
                <div class="flex-1 flex flex-column gap-2">
                  <h3 class="text-lg mb-0 mt-0">{{ item.pastry.name }}</h3>
                  <div 
                    v-if="item.pastry.diets && item.pastry.diets.length > 0"
                    class="" 
                  >
                    <DietIcon
                      v-for="(diet, index) in item.pastry.diets"
                      :key="diet.id"
                      :diet-name="DIET_CONFIG[diet.name]?.dietName"
                      :label="DIET_CONFIG[diet.name]?.label"
                      :class="index < item.pastry.diets.length - 1 ? 'mb-1' : ''"
                    />
                  </div>
                </div>
              </div>

              <!-- Quantité et Prix -->
              <div class="flex align-items-center justify-content-between mb-3">
                <div
                  class="quantity-control flex align-items-center justify-content-between border-1 surface-border border-round"
                  style="width: 8rem;"
                >
                  <Button
                    icon="pi pi-minus"
                    text
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                    class="quantity-button flex-none"
                  />
                  <input
                    v-model="item.quantity"
                    min="1"
                    class="quantity-input flex-none"
                  />
                  <Button
                    icon="pi pi-plus"
                    text
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    class="quantity-button flex-none"
                  />
                </div>
                <span class="font-medium text-lg">{{ (item.price * item.quantity).toFixed(2) }}€</span>
              </div>

              <!-- Bouton supprimer -->
              <Button
                label="Supprimer"
                icon="pi pi-trash"
                severity="danger"
                outlined
                @click="removeItem(item.id)"
                class="w-full"
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
              label="Commander"
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

<style scoped>
.cart-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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
