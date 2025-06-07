<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()
const activeTab = ref(0)
const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false,
  errors: {
    email: '',
    password: '',
  },
})

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  newsletter: false,
  errors: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
})

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleLogin = async () => {
  // Reset errors
  loginForm.errors.email = ''
  loginForm.errors.password = ''

  let isValid = true

  if (!loginForm.email) {
    loginForm.errors.email = "L'email est requis"
    isValid = false
  } else if (!validateEmail(loginForm.email)) {
    loginForm.errors.email = "Format d'email invalide"
    isValid = false
  }

  if (!loginForm.password) {
    loginForm.errors.password = 'Le mot de passe est requis'
    isValid = false
  }

  if (isValid) {
    loading.value = true
    try {
      // TODO: Implement login logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Connexion réussie',
        life: 3000,
      })
      router.push('/dashboard')
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Échec de la connexion',
        life: 3000,
      })
      console.error('Erreur de connexion:', error)
    } finally {
      loading.value = false
    }
  }
}

const handleRegister = async () => {
  // Reset errors
  Object.keys(registerForm.errors).forEach((key) => {
    registerForm.errors[key as keyof typeof registerForm.errors] = ''
  })

  let isValid = true

  if (!registerForm.firstName) {
    registerForm.errors.firstName = 'Le prénom est requis'
    isValid = false
  }

  if (!registerForm.lastName) {
    registerForm.errors.lastName = 'Le nom est requis'
    isValid = false
  }

  if (!registerForm.email) {
    registerForm.errors.email = "L'email est requis"
    isValid = false
  } else if (!validateEmail(registerForm.email)) {
    registerForm.errors.email = "Format d'email invalide"
    isValid = false
  }

  if (!registerForm.password) {
    registerForm.errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (registerForm.password.length < 8) {
    registerForm.errors.password =
      'Le mot de passe doit contenir au moins 8 caractères'
    isValid = false
  }

  if (!registerForm.confirmPassword) {
    registerForm.errors.confirmPassword =
      'La confirmation du mot de passe est requise'
    isValid = false
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerForm.errors.confirmPassword =
      'Les mots de passe ne correspondent pas'
    isValid = false
  }

  if (isValid) {
    loading.value = true
    try {
      // TODO: Implement registration logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Inscription réussie',
        life: 3000,
      })
      router.push('/dashboard')
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: "Échec de l'inscription",
        life: 3000,
      })
      console.error("Erreur d'inscription:", error)
    } finally {
      loading.value = false
    }
  }
}

const handleForgotPassword = () => {
  // TODO: Implement forgot password logic
  router.push('/forgot-password')
}
</script>

<template>
  <div class="flex align-items-center justify-content-center p-5">
    <Card class="w-full md:w-6 shadow-2">
      <template #header>
        <div class="text-center py-4">
          <h1 class="text-primary font-bold mb-0 text-2xl">Rejoignez-nous !</h1>
        </div>
      </template>

      <template #content>
        <TabView
          v-model:activeIndex="activeTab"
          class="w-full"
        >
          <TabPanel
            header="Connexion"
            :value="0"
            class="w-6"
          >
            <form
              @submit.prevent="handleLogin"
              class="flex flex-column gap-3"
            >
              <div class="flex flex-column gap-2">
                <label for="login-email">Email</label>
                <InputText
                  id="login-email"
                  v-model="loginForm.email"
                  type="email"
                  :class="{ 'p-invalid': loginForm.errors.email }"
                  placeholder="exemple@email.com"
                />
                <small
                  class="p-error"
                  v-if="loginForm.errors.email"
                  >{{ loginForm.errors.email }}</small
                >
              </div>

              <div class="flex flex-column gap-2">
                <label for="login-password">Mot de passe</label>
                <Password
                  id="login-password"
                  v-model="loginForm.password"
                  :feedback="false"
                  :class="{ 'p-invalid': loginForm.errors.password }"
                  :toggleMask="true"
                  placeholder="Votre mot de passe"
                />
                <small
                  class="p-error"
                  v-if="loginForm.errors.password"
                  >{{ loginForm.errors.password }}</small
                >
              </div>

              <div class="flex align-items-center justify-content-between">
                <div class="flex align-items-center">
                  <Checkbox
                    v-model="loginForm.rememberMe"
                    :binary="true"
                    id="rememberMe"
                  />
                  <label
                    for="rememberMe"
                    class="ml-2"
                    >Se souvenir de moi</label
                  >
                </div>
                <Button
                  label="Mot de passe oublié ?"
                  link
                  class="p-0"
                  @click="handleForgotPassword"
                />
              </div>

              <Button
                type="submit"
                label="Se connecter"
                icon="pi pi-sign-in"
                :loading="loading"
                class="mt-2"
              />
            </form>
          </TabPanel>

          <TabPanel
            header="Inscription"
            :value="1"
            class="w-6"
          >
            <form
              @submit.prevent="handleRegister"
              class="flex flex-column gap-3"
            >
              <div class="grid">
                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="firstName">Prénom</label>
                    <InputText
                      id="firstName"
                      v-model="registerForm.firstName"
                      :class="{ 'p-invalid': registerForm.errors.firstName }"
                      placeholder="Jean"
                    />
                    <small
                      class="p-error"
                      v-if="registerForm.errors.firstName"
                      >{{ registerForm.errors.firstName }}</small
                    >
                  </div>
                </div>

                <div class="col-12 md:col-6">
                  <div class="flex flex-column gap-2">
                    <label for="lastName">Nom</label>
                    <InputText
                      id="lastName"
                      v-model="registerForm.lastName"
                      :class="{ 'p-invalid': registerForm.errors.lastName }"
                      placeholder="Dupont"
                    />
                    <small
                      class="p-error"
                      v-if="registerForm.errors.lastName"
                      >{{ registerForm.errors.lastName }}</small
                    >
                  </div>
                </div>
              </div>

              <div class="flex flex-column gap-2">
                <label for="register-email">Email</label>
                <InputText
                  id="register-email"
                  v-model="registerForm.email"
                  type="email"
                  :class="{ 'p-invalid': registerForm.errors.email }"
                  placeholder="exemple@email.com"
                />
                <small
                  class="p-error"
                  v-if="registerForm.errors.email"
                  >{{ registerForm.errors.email }}</small
                >
              </div>

              <div class="flex flex-column gap-2">
                <label for="register-password">Mot de passe</label>
                <Password
                  id="register-password"
                  v-model="registerForm.password"
                  :class="{ 'p-invalid': registerForm.errors.password }"
                  placeholder="Minimum 8 caractères"
                />
                <small
                  class="p-error"
                  v-if="registerForm.errors.password"
                  >{{ registerForm.errors.password }}</small
                >
              </div>

              <div class="flex flex-column gap-2">
                <label for="confirm-password">Confirmer le mot de passe</label>
                <Password
                  id="confirm-password"
                  v-model="registerForm.confirmPassword"
                  :feedback="false"
                  :class="{ 'p-invalid': registerForm.errors.confirmPassword }"
                  :toggleMask="true"
                  placeholder="Confirmez votre mot de passe"
                />
                <small
                  class="p-error"
                  v-if="registerForm.errors.confirmPassword"
                  >{{ registerForm.errors.confirmPassword }}</small
                >
              </div>

              <div class="flex align-items-center gap-2">
                <Checkbox
                  v-model="registerForm.newsletter"
                  :binary="true"
                  id="newsletter"
                />
                <label
                  for="newsletter"
                  class="text-sm"
                >
                  Je souhaite recevoir la newsletter avec les nouveautés et
                  promotions
                </label>
              </div>

              <Button
                type="submit"
                label="Créer mon compte"
                icon="pi pi-user-plus"
                :loading="loading"
                class="mt-2"
              />
            </form>
          </TabPanel>
        </TabView>
      </template>
    </Card>
  </div>
</template>
