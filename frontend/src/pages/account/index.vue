<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

const router = useRouter()

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

const savePersonalInfo = () => {
  console.log('Sauvegarde des informations personnelles', user.value)
  alert('Informations personnelles sauvegardées avec succès !')
}

const changePassword = () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  console.log('Changement de mot de passe')
  passwordForm.value = { current: '', new: '', confirm: '' }
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
            @click="savePersonalInfo"
          />
        </div>
      </div>

      <Divider />

      <div class="surface-card p-3 sm:p-4 border-round mb-4">
        <h2 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Historique des commandes</h2>
        <p class="text-500 mb-3">Consultez l'historique de vos commandes passées</p>
        <Button
          label="Voir l'historique"
          icon="pi pi-shopping-bag"
          outlined
          @click="router.push('/account/orders')"
        />
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
            @click="changePassword"
          />
        </div>
      </div>
    </div>
  </div>
</template>