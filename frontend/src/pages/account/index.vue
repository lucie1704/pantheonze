<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { useToast } from 'primevue'

const user = ref({
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@email.com',
  phone: '06 12 34 56 78',
  addresses: [
    {
      name: 'Domicile',
      street: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
    },
    {
      name: 'Bureau',
      street: '456 Avenue des Champs',
      city: 'Paris',
      postalCode: '75008',
    },
  ],
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

const toast = useToast()

const isLoading = ref(false)

const handleSave = async () => {
  // Logique de sauvegarde des informations personnelles
  isLoading.value = true
  
  try {
    // Simulation d'une sauvegarde réussie
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Informations sauvegardées avec succès',
      life: 3000,
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Erreur lors de la sauvegarde',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

const handlePasswordChange = () => {
  // Logique de changement de mot de passe
}
</script>

<template>
  <div class="surface-ground">
    <div class="surface-section border-round-xl m-2 sm:m-4 p-3 sm:p-4">
      <div class="flex justify-content-between align-items-center mb-4">
        <h1 class="text-2xl sm:text-4xl font-bold m-0 text-primary">Mon Profil</h1>
      </div>

      <div class="surface-card p-3 sm:p-4 border-round mb-4">
        <h2 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Informations personnelles</h2>
        <div class="flex flex-column gap-3">
          <div class="field">
            <label
              for="firstName"
              class="block mb-2 text-sm sm:text-base"
              >Prénom</label
            >
            <InputText
              id="firstName"
              v-model="user.firstName"
              class="w-full"
            />
          </div>
          <div class="field">
            <label
              for="lastName"
              class="block mb-2 text-sm sm:text-base"
              >Nom</label
            >
            <InputText
              id="lastName"
              v-model="user.lastName"
              class="w-full"
            />
          </div>
          <div class="field">
            <label
              for="email"
              class="block mb-2 text-sm sm:text-base"
              >Email</label
            >
            <InputText
              id="email"
              v-model="user.email"
              type="email"
              class="w-full"
            />
          </div>
          <div class="field">
            <label
              for="phone"
              class="block mb-2 text-sm sm:text-base"
              >Téléphone</label
            >
            <InputText
              id="phone"
              v-model="user.phone"
              class="w-full"
            />
          </div>
          <Button
            label="Enregistrer les modifications"
            icon="pi pi-save"
            class="align-self-start w-full sm:w-auto"
            @click="handleSave"
          />
        </div>
      </div>

      <Divider />

      <div class="surface-card p-3 sm:p-4 border-round mb-4">
        <h2 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Changement de mot de passe</h2>
        <div class="flex flex-column gap-3">
          <div class="field">
            <label
              for="currentPassword"
              class="block mb-2 text-sm sm:text-base"
              >Mot de passe actuel</label
            >
            <Password
              id="currentPassword"
              v-model="passwordForm.current"
              class="w-full"
              inputClass="w-full"
              :feedback="false"
            />
          </div>
          <div class="field">
            <label
              for="newPassword"
              class="block mb-2 text-sm sm:text-base"
              >Nouveau mot de passe</label
            >
            <Password
              id="newPassword"
              v-model="passwordForm.new"
              class="w-full"
              inputClass="w-full"
            />
          </div>
          <div class="field">
            <label
              for="confirmPassword"
              class="block mb-2 text-sm sm:text-base"
              >Confirmer le nouveau mot de passe</label
            >
            <Password
              id="confirmPassword"
              v-model="passwordForm.confirm"
              class="w-full"
              inputClass="w-full"
              :feedback="false"
            />
          </div>
          <Button
            label="Changer le mot de passe"
            icon="pi pi-save"
            class="align-self-start w-full sm:w-auto"
            @click="handlePasswordChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>