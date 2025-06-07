<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// État
const cart = ref<any[]>([])
const customerInfo = ref<any>(null)
const pickupInfo = ref<any>(null)

// Chargement des données
onMounted(() => {
  // Récupération des données du localStorage
  const cartData = localStorage.getItem('cart')
  const customerData = localStorage.getItem('customerInfo')
  const pickupData = localStorage.getItem('pickupInfo')

  if (cartData) cart.value = JSON.parse(cartData)
  if (customerData) customerInfo.value = JSON.parse(customerData)
  if (pickupData) pickupInfo.value = JSON.parse(pickupData)
})

// Calculs
const subtotal = computed(() => {
  return cart.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )
})

const preparationFees = computed(() => {
  return subtotal.value > 50 ? 0 : 5
})

const total = computed(() => {
  return subtotal.value + preparationFees.value
})

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    // Simulation d'une requête API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push('/commande/paiement')
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-screen-lg mx-auto p-4">
    <div class="surface-card p-4 border-round">
      <h1 class="text-4xl font-bold text-center mb-6">
        Récapitulatif de votre commande
      </h1>

      <div class="grid">
        <!-- Détails de la commande -->
        <div class="col-12 lg:col-8">
          <!-- Articles -->
          <Panel
            header="Articles commandés"
            class="mb-4"
          >
            <div
              v-for="item in cart"
              :key="item.id"
              class="flex align-items-center py-3 border-bottom-1 surface-border"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-6rem h-4rem object-cover border-round mr-3"
              />
              <div class="flex-grow-1">
                <h3 class="text-xl mb-2">{{ item.name }}</h3>
                <p class="text-500 mb-2">{{ item.size }}</p>
                <p
                  v-if="item.message"
                  class="text-500"
                >
                  Message : {{ item.message }}
                </p>
              </div>
              <div class="text-right">
                <div class="mb-2">{{ item.quantity }}x</div>
                <div class="font-bold">
                  {{ (item.price * item.quantity).toFixed(2) }}€
                </div>
              </div>
            </div>
          </Panel>

          <!-- Informations client -->
          <Panel
            header="Vos informations"
            class="mb-4"
          >
            <div class="grid">
              <div class="col-12 md:col-6">
                <h3 class="text-lg font-bold mb-3">Contact</h3>
                <p class="mb-2">
                  {{ customerInfo?.personal.firstName }}
                  {{ customerInfo?.personal.lastName }}
                </p>
                <p class="mb-2">{{ customerInfo?.personal.email }}</p>
                <p>{{ customerInfo?.personal.phone }}</p>
              </div>

              <div class="col-12 md:col-6">
                <h3 class="text-lg font-bold mb-3">Adresse de facturation</h3>
                <p class="mb-2">{{ customerInfo?.billing.street }}</p>
                <p
                  v-if="customerInfo?.billing.complement"
                  class="mb-2"
                >
                  {{ customerInfo.billing.complement }}
                </p>
                <p>
                  {{ customerInfo?.billing.postalCode }}
                  {{ customerInfo?.billing.city }}
                </p>
              </div>
            </div>
          </Panel>

          <!-- Informations de retrait -->
          <Panel header="Retrait en magasin">
            <div class="grid">
              <div class="col-12 md:col-6">
                <h3 class="text-lg font-bold mb-3">Date et heure</h3>
                <p class="mb-2">
                  {{ new Date(pickupInfo?.date).toLocaleDateString() }}
                  à {{ pickupInfo?.timeSlot }}
                </p>
                <p
                  v-if="pickupInfo?.specialInstructions"
                  class="text-500"
                >
                  Instructions : {{ pickupInfo.specialInstructions }}
                </p>
              </div>

              <div class="col-12 md:col-6">
                <h3 class="text-lg font-bold mb-3">Point de retrait</h3>
                <p class="mb-2">PanthéOnze Paris</p>
                <p class="mb-2">123 Rue de la Pâtisserie</p>
                <p>75005 Paris</p>
              </div>
            </div>
          </Panel>
        </div>

        <!-- Résumé des coûts -->
        <div class="col-12 lg:col-4">
          <div class="surface-card p-4 border-round border-1 surface-border">
            <h2 class="text-2xl font-bold mb-4">Total</h2>

            <div class="flex justify-content-between mb-3">
              <span>Sous-total</span>
              <span>{{ subtotal.toFixed(2) }}€</span>
            </div>

            <div class="flex justify-content-between mb-3">
              <span>Frais de préparation</span>
              <span>{{ preparationFees.toFixed(2) }}€</span>
            </div>

            <div
              class="flex justify-content-between font-bold text-xl border-top-1 surface-border pt-3"
            >
              <span>Total</span>
              <span>{{ total.toFixed(2) }}€</span>
            </div>

            <Button
              label="Procéder au paiement"
              icon="pi pi-credit-card"
              class="w-full mt-4"
              @click="handleSubmit"
              :loading="loading"
            />

            <p class="text-center text-500 mt-3">
              <i class="pi pi-lock mr-2"></i>
              Paiement sécurisé
            </p>
          </div>

          <!-- Conditions générales -->
          <div class="mt-4">
            <div class="flex align-items-center gap-2">
              <Checkbox
                v-model="termsAccepted"
                binary
                required
              />
              <label class="text-sm">
                J'accepte les
                <a
                  href="/cgv"
                  class="text-primary"
                  >conditions générales de vente</a
                >
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Boutons de navigation -->
      <div
        class="flex justify-content-between mt-4 pt-4 border-top-1 surface-border"
      >
        <Button
          label="Retour"
          icon="pi pi-arrow-left"
          outlined
          @click="router.push('/commande/retrait')"
        />
        <Button
          label="Procéder au paiement"
          icon="pi pi-credit-card"
          @click="handleSubmit"
          :loading="loading"
          :disabled="!termsAccepted"
        />
      </div>
    </div>
  </div>
</template>
