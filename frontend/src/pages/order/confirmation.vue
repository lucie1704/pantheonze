<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// État
const orderNumber = ref('')
const customerInfo = ref<any>(null)
const pickupInfo = ref<any>(null)

onMounted(() => {
  // Récupération des informations de commande
  const orderNum = localStorage.getItem('orderNumber')
  const customerData = localStorage.getItem('customerInfo')
  const pickupData = localStorage.getItem('pickupInfo')

  if (orderNum) orderNumber.value = orderNum
  if (customerData) customerInfo.value = JSON.parse(customerData)
  if (pickupData) pickupInfo.value = JSON.parse(pickupData)

  // Envoi de l'email de confirmation (simulation)
  sendConfirmationEmail()

  // Nettoyage du localStorage
  localStorage.removeItem('cart')
  localStorage.removeItem('customerInfo')
  localStorage.removeItem('pickupInfo')
  localStorage.removeItem('orderNumber')
})

const sendConfirmationEmail = async () => {
  // Simulation d'envoi d'email
  console.log('Email de confirmation envoyé')
}

const downloadInvoice = () => {
  // Simulation de téléchargement de facture
  console.log('Téléchargement de la facture')
}

const returnToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="max-w-screen-lg mx-auto p-4">
    <div class="surface-card p-4 border-round text-center">
      <!-- En-tête -->
      <div class="mb-6">
        <i class="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
        <h1 class="text-4xl font-bold mb-3">Commande confirmée !</h1>
        <p class="text-xl text-700">Merci pour votre commande n°{{ orderNumber }}</p>
      </div>

      <!-- Email de confirmation -->
      <div class="surface-ground p-4 border-round mb-6 inline-block">
        <div class="flex align-items-center gap-3">
          <i class="pi pi-envelope text-xl"></i>
          <div class="text-left">
            <p class="font-bold mb-1">Email de confirmation envoyé</p>
            <p class="text-600 m-0">Un récapitulatif a été envoyé à {{ customerInfo?.personal.email }}</p>
          </div>
        </div>
      </div>

      <!-- Détails de retrait -->
      <div class="grid">
        <div class="col-12 md:col-6 mb-4">
          <div class="surface-ground p-4 border-round h-full">
            <h2 class="text-2xl font-bold mb-4">Informations de retrait</h2>

            <div class="flex flex-column gap-3">
              <div>
                <p class="font-bold mb-1">Date et heure</p>
                <p class="m-0">
                  {{ new Date(pickupInfo?.date).toLocaleDateString() }}
                  à {{ pickupInfo?.timeSlot }}
                </p>
              </div>

              <div>
                <p class="font-bold mb-1">Adresse</p>
                <p class="m-0">PanthéOnze Paris</p>
                <p class="m-0">123 Rue de la Pâtisserie</p>
                <p class="m-0">75005 Paris</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6 mb-4">
          <div class="surface-ground p-4 border-round h-full">
            <h2 class="text-2xl font-bold mb-4">Instructions</h2>

            <ul class="list-none p-0 m-0">
              <li class="flex align-items-center mb-3">
                <i class="pi pi-id-card text-primary mr-2"></i>
                Présentez-vous avec une pièce d'identité
              </li>
              <li class="flex align-items-center mb-3">
                <i class="pi pi-clock text-primary mr-2"></i>
                Arrivez 5 minutes avant l'heure de retrait
              </li>
              <li class="flex align-items-center">
                <i class="pi pi-phone text-primary mr-2"></i>
                Appelez-nous en cas de retard
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-column align-items-center gap-3 mt-6">
        <Button
          label="Télécharger la facture"
          icon="pi pi-download"
          outlined
          @click="downloadInvoice"
        />

        <Button
          label="Retour à l'accueil"
          icon="pi pi-home"
          text
          @click="returnToHome"
        />
      </div>

      <!-- Support -->
      <div class="mt-6 pt-6 border-top-1 surface-border">
        <p class="text-600 mb-2">Une question sur votre commande ?</p>
        <div class="flex justify-content-center gap-3">
          <Button
            label="Nous contacter"
            icon="pi pi-envelope"
            text
            @click="router.push('/contact')"
          />
          <Button
            label="FAQ"
            icon="pi pi-question-circle"
            text
            @click="router.push('/faq')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
