<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Formulaire informations personnelles
const personalInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthdate: null as Date | null,
  dietaryPreferences: [] as string[],
})

// Formulaire adresse de facturation
const billingAddress = ref({
  street: '',
  complement: '',
  postalCode: '',
  city: '',
  country: 'FR',
})

// Options
const dietaryOptions = [
  { label: 'Sans gluten', value: 'gluten-free' },
  { label: 'Végétarien', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Sans lactose', value: 'lactose-free' },
]

const countries = [
  { label: 'France', value: 'FR' },
  { label: 'Belgique', value: 'BE' },
  { label: 'Suisse', value: 'CH' },
  { label: 'Luxembourg', value: 'LU' },
]

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    // Simulation d'une requête API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Sauvegarde des informations
    localStorage.setItem(
      'customerInfo',
      JSON.stringify({
        personal: personalInfo.value,
        billing: billingAddress.value,
      }),
    )

    // Navigation vers l'étape suivante
    router.push('/commande/retrait')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-screen-lg mx-auto p-4">
    <div class="surface-card p-4 border-round">
      <h1 class="text-4xl font-bold text-center mb-6">Vos Informations</h1>

      <form
        @submit.prevent="handleSubmit"
        class="flex flex-column gap-4"
      >
        <!-- Informations personnelles -->
        <Panel
          header="Informations personnelles"
          class="mb-3"
        >
          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="flex flex-column gap-2">
                <label for="firstName">Prénom *</label>
                <InputText
                  id="firstName"
                  v-model="personalInfo.firstName"
                  required
                />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="flex flex-column gap-2">
                <label for="lastName">Nom *</label>
                <InputText
                  id="lastName"
                  v-model="personalInfo.lastName"
                  required
                />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="flex flex-column gap-2">
                <label for="email">Email *</label>
                <InputText
                  id="email"
                  v-model="personalInfo.email"
                  type="email"
                  required
                />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="flex flex-column gap-2">
                <label for="phone">Téléphone *</label>
                <InputText
                  id="phone"
                  v-model="personalInfo.phone"
                  type="tel"
                  required
                />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="flex flex-column gap-2">
                <label for="birthdate">Date de naissance</label>
                <Calendar
                  id="birthdate"
                  v-model="personalInfo.birthdate"
                  dateFormat="dd/mm/yy"
                  :showIcon="true"
                />
              </div>
            </div>

            <div class="col-12">
              <div class="flex flex-column gap-2">
                <label>Préférences alimentaires</label>
                <div class="flex flex-wrap gap-3">
                  <div
                    v-for="option in dietaryOptions"
                    :key="option.value"
                    class="flex align-items-center"
                  >
                    <Checkbox
                      v-model="personalInfo.dietaryPreferences"
                      :value="option.value"
                      :inputId="option.value"
                    />
                    <label
                      :for="option.value"
                      class="ml-2"
                      >{{ option.label }}</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <!-- Adresse de facturation -->
        <Panel
          header="Adresse de facturation"
          class="mb-3"
        >
          <div class="grid">
            <div class="col-12">
              <div class="flex flex-column gap-2">
                <label for="street">Rue *</label>
                <InputText
                  id="street"
                  v-model="billingAddress.street"
                  required
                />
              </div>
            </div>

            <div class="col-12">
              <div class="flex flex-column gap-2">
                <label for="complement">Complément d'adresse</label>
                <InputText
                  id="complement"
                  v-model="billingAddress.complement"
                />
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="flex flex-column gap-2">
                <label for="postalCode">Code postal *</label>
                <InputText
                  id="postalCode"
                  v-model="billingAddress.postalCode"
                  required
                />
              </div>
            </div>

            <div class="col-12 md:col-8">
              <div class="flex flex-column gap-2">
                <label for="city">Ville *</label>
                <InputText
                  id="city"
                  v-model="billingAddress.city"
                  required
                />
              </div>
            </div>

            <div class="col-12">
              <div class="flex flex-column gap-2">
                <label for="country">Pays *</label>
                <Select
                  id="country"
                  v-model="billingAddress.country"
                  :options="countries"
                  optionLabel="label"
                  optionValue="value"
                  class="w-full"
                  required
                />
              </div>
            </div>
          </div>
        </Panel>

        <!-- Boutons de navigation -->
        <div class="flex justify-content-between">
          <Button
            label="Retour au panier"
            icon="pi pi-arrow-left"
            outlined
            @click="router.push('/panier')"
          />
          <Button
            type="submit"
            label="Continuer"
            icon="pi pi-arrow-right"
            iconPos="right"
            :loading="loading"
          />
        </div>
      </form>
    </div>
  </div>
</template>
