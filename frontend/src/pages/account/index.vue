<template>
  <div class="surface-ground">
    <div class="surface-section border-round-xl m-4 p-4">
      <!-- Header avec navigation -->
      <div class="flex justify-content-between align-items-center mb-4">
        <h1 class="text-4xl font-bold m-0 text-primary">Mon Profil</h1>
        <Button
          label="Paramètres"
          icon="pi pi-cog"
          severity="secondary"
          size="small"
          @click="$router.push('/account/settings')"
        />
      </div>

      <!-- Informations personnelles -->
      <div class="surface-card p-4 border-round mb-4">
        <h2 class="text-2xl font-bold mb-4">Informations personnelles</h2>
        <div class="flex flex-column gap-3">
          <div class="field">
            <label
              for="firstName"
              class="block mb-2"
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
              class="block mb-2"
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
              class="block mb-2"
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
              class="block mb-2"
              >Téléphone</label
            >
            <InputText
              id="phone"
              v-model="user.phone"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <Divider />

      <!-- Changement de mot de passe -->
      <div class="surface-card p-4 border-round mb-4">
        <h2 class="text-2xl font-bold mb-4">Changement de mot de passe</h2>
        <div class="flex flex-column gap-3">
          <div class="field">
            <label
              for="currentPassword"
              class="block mb-2"
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
              class="block mb-2"
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
              class="block mb-2"
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
            icon="pi pi-key"
            class="align-self-start"
            @click="changePassword"
          />
        </div>
      </div>

      <Divider />

      <!-- Adresses de livraison -->
      <div class="surface-card p-4 border-round">
        <div class="flex justify-content-between align-items-center mb-4">
          <h2 class="text-2xl font-bold m-0">Adresses de livraison</h2>
          <Button
            label="Ajouter une adresse"
            icon="pi pi-plus"
            size="small"
            @click="addAddress"
          />
        </div>
        <div class="flex flex-column gap-3">
          <div
            v-for="(address, index) in user.addresses"
            :key="index"
            class="surface-border border-1 border-round p-3"
          >
            <div class="flex justify-content-between align-items-start">
              <div class="flex-1">
                <h3 class="text-lg font-semibold m-0 mb-2">{{ address.name }}</h3>
                <p class="m-0 text-600">{{ address.street }}</p>
                <p class="m-0 text-600">{{ address.city }}, {{ address.postalCode }}</p>
              </div>
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  severity="secondary"
                  text
                  size="small"
                  @click="editAddress(index)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  size="small"
                  @click="removeAddress(index)"
                />
              </div>
            </div>
          </div>
          <div
            v-if="user.addresses.length === 0"
            class="text-center text-500 py-4"
          >
            Aucune adresse enregistrée
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

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

const changePassword = () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  // Logique de changement de mot de passe
  console.log('Changement de mot de passe')
  passwordForm.value = { current: '', new: '', confirm: '' }
}

const addAddress = () => {
  // Logique d'ajout d'adresse
  console.log('Ajouter une adresse')
}

const editAddress = (index: number) => {
  // Logique d'édition d'adresse
  console.log("Éditer l'adresse", index)
}

const removeAddress = (index: number) => {
  user.value.addresses.splice(index, 1)
}
</script>
