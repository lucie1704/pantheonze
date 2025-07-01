<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useOrderStore } from '@/stores/order'
import { useCartStore } from '@/stores/cart'
import { authService } from '@/services/auth.service'
import { useToast } from 'primevue/usetoast'
import OrderStepper from '@/components/OrderStepper.vue'

const router = useRouter()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const toast = useToast()

const formData = ref({
  name: '',
  email: '',
  phone: ''
})

const isEditing = ref(false)

onMounted(async () => {
  // Vérifier que l'utilisateur est connecté
  if (!authService.isAuthenticated()) {
    toast.add({
      severity: 'warn',
      summary: 'Connexion requise',
      detail: 'Vous devez être connecté pour passer commande',
      life: 3000,
    })
    router.push('/login')
    return
  }

  // Vérifier que le panier n'est pas vide
  if (cartStore.isEmpty) {
    toast.add({
      severity: 'warn',
      summary: 'Panier vide',
      detail: 'Votre panier est vide',
      life: 3000,
    })
    router.push('/cart')
    return
  }

  // Récupérer les informations de l'utilisateur connecté
  try {
    const userInfo = authService.getUser()
    if (userInfo) {
      formData.value = {
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || ''
      }
      
      // Si toutes les infos sont présentes, aller directement à l'étape suivante
      if (formData.value.name && formData.value.email) {
        orderStore.setCustomerInfo({
          name: formData.value.name,
          email: formData.value.email,
          phone: formData.value.phone
        })
        router.push('/order/collect')
        return
      }
    }
  } catch (error) {
    console.error('Error getting user info:', error)
  }
})

const proceedToStoreSelection = () => {
  if (!formData.value.name || !formData.value.email) {
    toast.add({
      severity: 'error',
      summary: 'Informations manquantes',
      detail: 'Veuillez remplir tous les champs manquants',
      life: 3000,
    })
    return
  }

  orderStore.setCustomerInfo({
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone
  })

  router.push('/order/collect')
}

const goBackToCart = () => {
  router.push('/cart')
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const enableEditing = () => {
  isEditing.value = true
}
</script>

<template>
  <div class="max-w-screen-lg mx-auto p-4">
    <!-- Order Stepper -->
    <OrderStepper />
    
    <!-- Navigation breadcrumb -->
    <div class="mb-6">
      <h1 class="text-4xl font-bold mb-2">Vos informations</h1>
      <p class="text-lg text-600">Vérifiez vos coordonnées pour la commande</p>
    </div>

    <div class="grid">
      <!-- Formulaire -->
      <div class="col-12 lg:col-8">
        <Card>
          <template #content>
            <div class="flex flex-column gap-4">
              <!-- Informations pré-remplies -->
              <div v-if="!isEditing" class="flex flex-column gap-4">
                <div class="surface-100 p-4 border-round">
                  <div class="flex justify-content-between align-items-start mb-3">
                    <h3 class="text-lg font-bold m-0">Vos informations</h3>
                    <Button 
                      label="Modifier" 
                      icon="pi pi-pencil"
                      class="p-button-text p-button-sm"
                      @click="enableEditing"
                    />
                  </div>
                  
                  <div class="flex flex-column gap-2">
                    <div class="flex align-items-center gap-2">
                      <i class="pi pi-user text-500"></i>
                      <span class="font-medium">{{ formData.name || 'Nom non renseigné' }}</span>
                    </div>
                    <div class="flex align-items-center gap-2">
                      <i class="pi pi-envelope text-500"></i>
                      <span class="font-medium">{{ formData.email || 'Email non renseigné' }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex justify-content-between pt-4">
                  <Button 
                    label="Retour au panier" 
                    icon="pi pi-arrow-left"
                    class="p-button-outlined"
                    @click="goBackToCart"
                  />
                  <Button 
                    label="Choisir la boutique" 
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    @click="proceedToStoreSelection"
                    :disabled="!formData.name || !formData.email"
                  />
                </div>
              </div>

              <!-- Formulaire d'édition -->
              <div v-else class="flex flex-column gap-4">
                <!-- Nom complet -->
                <div class="field">
                  <label for="name" class="block text-900 font-medium mb-2">Nom complet *</label>
                  <InputText 
                    id="name"
                    v-model="formData.name" 
                    class="w-full"
                    placeholder="Votre nom et prénom"
                    :class="{ 'p-invalid': formData.name && formData.name.length < 2 }"
                  />
                  <small v-if="formData.name && formData.name.length < 2" class="p-error">
                    Le nom doit contenir au moins 2 caractères
                  </small>
                </div>

                <!-- Email -->
                <div class="field">
                  <label for="email" class="block text-900 font-medium mb-2">Adresse email *</label>
                  <InputText 
                    id="email"
                    v-model="formData.email" 
                    class="w-full"
                    placeholder="votre@email.com"
                    :class="{ 'p-invalid': formData.email && !validateEmail(formData.email) }"
                  />
                  <small v-if="formData.email && !validateEmail(formData.email)" class="p-error">
                    Veuillez entrer une adresse email valide
                  </small>
                </div>

                <!-- Boutons -->
                <div class="flex justify-content-between pt-4">
                  <Button 
                    label="Annuler" 
                    class="p-button-outlined"
                    @click="isEditing = false"
                  />
                  <Button 
                    label="Confirmer et continuer" 
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    @click="proceedToStoreSelection"
                    :disabled="!formData.name || !formData.email || !validateEmail(formData.email)"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Résumé de commande -->
      <div class="col-12 lg:col-4">
        <Card>
          <template #header>
            <div class="p-4 pb-0">
              <h3 class="text-xl font-bold mb-0">Résumé de votre commande</h3>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <!-- Articles -->
              <div v-for="item in cartStore.items" :key="item.id" class="flex justify-content-between align-items-center">
                <div class="flex align-items-center gap-2">
                  <span class="font-medium">{{ item.quantity }}x</span>
                  <span>{{ item.pastry.name }}</span>
                </div>
                <span class="font-bold">{{ (item.price * item.quantity).toFixed(2) }}€</span>
              </div>

              <div class="border-top-1 surface-border pt-3">
                <div class="flex justify-content-between align-items-center">
                  <span class="text-lg font-bold">Total</span>
                  <span class="text-lg font-bold text-primary">{{ cartStore.totalPrice.toFixed(2) }}€</span>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 1rem;
}

.p-invalid {
  border-color: #f56565;
}

.p-error {
  color: #f56565;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>
