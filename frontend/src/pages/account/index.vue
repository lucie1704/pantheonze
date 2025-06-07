<template>
  <div class="surface-ground">
    <div class="surface-section border-round-xl m-4 p-4">
      <h1 class="text-4xl font-bold mb-4 text-primary">Mon compte</h1>

      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="surface-card p-4 border-round">
            <h2 class="text-2xl font-bold mb-4">Informations personnelles</h2>
            <div class="flex flex-column gap-3">
              <div class="field">
                <label
                  for="name"
                  class="block mb-2"
                  >Nom</label
                >
                <InputText
                  id="name"
                  v-model="user.name"
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
              <Button
                label="Enregistrer les modifications"
                class="w-full md:w-auto"
              />
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="surface-card p-4 border-round">
            <h2 class="text-2xl font-bold mb-4">Changer le mot de passe</h2>
            <div class="flex flex-column gap-3">
              <div class="field">
                <label
                  for="currentPassword"
                  class="block mb-2"
                  >Mot de passe actuel</label
                >
                <Password
                  id="currentPassword"
                  v-model="passwords.current"
                  class="w-full"
                  toggleMask
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
                  v-model="passwords.new"
                  class="w-full"
                  toggleMask
                />
              </div>
              <div class="field">
                <label
                  for="confirmPassword"
                  class="block mb-2"
                  >Confirmer le mot de passe</label
                >
                <Password
                  id="confirmPassword"
                  v-model="passwords.confirm"
                  class="w-full"
                  toggleMask
                />
              </div>
              <Button
                label="Changer le mot de passe"
                severity="secondary"
                class="w-full md:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: '',
  email: '',
  phone: '',
})

const passwords = ref({
  current: '',
  new: '',
  confirm: '',
})
</script>
