<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const router = useRouter()

// État du panier (à remplacer par un store Pinia)
const cartItems = ref([
  {
    id: 1,
    name: 'Paris-Brest Traditionnel',
    price: 24.9,
    quantity: 1,
    size: '6 personnes',
    image: '/paris-brest.jpg',
    message: 'Joyeux Anniversaire !',
  },
  {
    id: 2,
    name: 'Éclair au Chocolat',
    price: 4.5,
    quantity: 2,
    size: 'Standard',
    image: '/eclair.jpg',
  },
])

const promoCode = ref('')
const promoApplied = ref(false)
const promoDiscount = ref(0)

// Calculs
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

const preparationFees = computed(() => {
  return subtotal.value > 50 ? 0 : 5
})

const total = computed(() => {
  return subtotal.value + preparationFees.value - promoDiscount.value
})

// Actions
const updateQuantity = (itemId: number, newQuantity: number) => {
  const item = cartItems.value.find((item) => item.id === itemId)
  if (item) {
    item.quantity = newQuantity
  }
}

const removeItem = (itemId: number) => {
  const index = cartItems.value.findIndex((item) => item.id === itemId)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
  }
}

const applyPromoCode = () => {
  if (promoCode.value === 'BIENVENUE') {
    promoDiscount.value = subtotal.value * 0.1 // 10% de réduction
    promoApplied.value = true
  }
}

const proceedToCheckout = () => {
  // Sauvegarde du panier dans le localStorage
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
  router.push('/commande/connexion')
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-4">
    <h1 class="text-4xl font-bold mb-4">Votre Panier</h1>

    <div
      v-if="cartItems.length > 0"
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
            v-for="item in cartItems"
            :key="item.id"
            class="flex align-items-center py-3 border-bottom-1 surface-border"
          >
            <!-- Image et infos -->
            <div class="flex align-items-center flex-grow-1">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-8rem h-6rem object-cover border-round mr-3"
              />
              <div>
                <h3 class="text-xl mb-2">{{ item.name }}</h3>
                <p class="text-500 mb-2">{{ item.size }}</p>
                <p
                  v-if="item.message"
                  class="text-500 mb-2"
                >
                  Message : {{ item.message }}
                </p>
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

          <Button
            label="Commander"
            icon="pi pi-check"
            class="w-full mt-4"
            @click="proceedToCheckout"
          />

          <p class="text-center text-500 mt-3">
            <i class="pi pi-lock mr-2"></i>
            Paiement sécurisé
          </p>
        </div>
      </div>
    </div>

    <!-- Panier vide -->
    <div
      v-else
      class="surface-card p-6 text-center"
    >
      <i class="pi pi-shopping-cart text-6xl text-500 mb-4"></i>
      <h2 class="text-2xl font-bold mb-2">Votre panier est vide</h2>
      <p class="text-500 mb-4">Découvrez nos délicieuses pâtisseries !</p>
      <Button
        label="Voir nos produits"
        icon="pi pi-arrow-right"
        @click="router.push('/produits')"
      />
    </div>
  </div>
</template>
