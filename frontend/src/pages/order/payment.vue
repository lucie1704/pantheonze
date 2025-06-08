<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// État
const cart = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const paymentMethod = ref('card')

// Options de paiement
const paymentMethods = [
  { label: 'Carte bancaire', value: 'card', icon: 'pi pi-credit-card' },
  { label: 'PayPal', value: 'paypal', icon: 'pi pi-paypal' },
]

// Formulaire carte bancaire
const cardForm = ref({
  number: '',
  expiry: '',
  cvc: '',
  name: '',
})

onMounted(() => {
  // Récupération du panier et calcul du total
  const cartData = localStorage.getItem('cart')
  if (cartData) {
    cart.value = JSON.parse(cartData)
    total.value = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  // Initialisation de Stripe (à implémenter)
  // loadStripe()
})

const handlePayment = async () => {
  loading.value = true
  try {
    // Simulation du paiement
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Génération d'un numéro de commande
    const orderNumber = `CMD${Date.now()}`

    // Sauvegarde du numéro de commande
    localStorage.setItem('orderNumber', orderNumber)

    // Redirection vers la confirmation
    router.push('/commande/confirmation')
  } catch (error) {
    console.error('Erreur de paiement:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-screen-lg mx-auto p-4">
    <div class="surface-card p-4 border-round">
      <h1 class="text-4xl font-bold text-center mb-6">Paiement sécurisé</h1>

      <div class="grid">
        <!-- Formulaire de paiement -->
        <div class="col-12 lg:col-8">
          <!-- Sélection du mode de paiement -->
          <div class="mb-4">
            <h2 class="text-xl font-bold mb-3">Mode de paiement</h2>
            <div class="flex gap-3">
              <div
                v-for="method in paymentMethods"
                :key="method.value"
                class="flex-1 surface-card border-1 surface-border border-round p-3 cursor-pointer"
                :class="{ 'border-primary': paymentMethod === method.value }"
                @click="paymentMethod = method.value"
              >
                <div class="flex align-items-center gap-2">
                  <i
                    :class="method.icon"
                    class="text-xl"
                  ></i>
                  <span>{{ method.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulaire carte bancaire -->
          <div
            v-if="paymentMethod === 'card'"
            class="surface-ground p-4 border-round"
          >
            <h3 class="text-lg font-bold mb-4">Informations de carte</h3>

            <div class="flex flex-column gap-3">
              <div class="flex flex-column gap-2">
                <label for="card-name">Nom sur la carte</label>
                <InputText
                  id="card-name"
                  v-model="cardForm.name"
                  placeholder="JEAN DUPONT"
                  class="w-full"
                  required
                />
              </div>

              <div class="flex flex-column gap-2">
                <label for="card-number">Numéro de carte</label>
                <InputMask
                  id="card-number"
                  v-model="cardForm.number"
                  mask="9999 9999 9999 9999"
                  placeholder="4242 4242 4242 4242"
                  class="w-full"
                  required
                />
              </div>

              <div class="grid">
                <div class="col-6">
                  <label for="card-expiry">Date d'expiration</label>
                  <InputMask
                    id="card-expiry"
                    v-model="cardForm.expiry"
                    mask="99/99"
                    placeholder="MM/AA"
                    class="w-full"
                    required
                  />
                </div>

                <div class="col-6">
                  <label for="card-cvc">CVC</label>
                  <InputMask
                    id="card-cvc"
                    v-model="cardForm.cvc"
                    mask="999"
                    placeholder="123"
                    class="w-full"
                    required
                  />
                </div>
              </div>
            </div>

            <p class="text-500 text-sm mt-3">
              <i class="pi pi-lock mr-2"></i>
              Vos informations de paiement sont sécurisées
            </p>
          </div>

          <!-- PayPal -->
          <div
            v-else-if="paymentMethod === 'paypal'"
            class="surface-ground p-4 border-round text-center"
          >
            <i class="pi pi-paypal text-4xl mb-3"></i>
            <p>Vous allez être redirigé vers PayPal pour finaliser votre paiement</p>
          </div>
        </div>

        <!-- Résumé de la commande -->
        <div class="col-12 lg:col-4">
          <div
            class="surface-card p-4 border-round border-1 surface-border sticky"
            style="top: 1rem"
          >
            <h2 class="text-2xl font-bold mb-4">Résumé</h2>

            <!-- Liste des articles -->
            <div class="mb-4">
              <div
                v-for="item in cart"
                :key="item.id"
                class="flex justify-content-between mb-2"
              >
                <span>{{ item.quantity }}x {{ item.name }}</span>
                <span>{{ (item.price * item.quantity).toFixed(2) }}€</span>
              </div>
            </div>

            <!-- Total -->
            <div class="flex justify-content-between font-bold text-xl border-top-1 surface-border pt-3">
              <span>Total</span>
              <span>{{ total.toFixed(2) }}€</span>
            </div>

            <!-- Bouton de paiement -->
            <Button
              label="Payer maintenant"
              icon="pi pi-check"
              class="w-full mt-4"
              @click="handlePayment"
              :loading="loading"
            />

            <!-- Sécurité -->
            <div class="flex align-items-center justify-content-center gap-2 mt-4">
              <i class="pi pi-lock text-green-500"></i>
              <i class="pi pi-verified text-green-500"></i>
              <span class="text-500 text-sm">Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Boutons de navigation -->
      <div class="flex justify-content-between mt-4 pt-4 border-top-1 surface-border">
        <Button
          label="Retour"
          icon="pi pi-arrow-left"
          outlined
          @click="router.push('/commande/recap')"
        />
      </div>
    </div>
  </div>
</template>
