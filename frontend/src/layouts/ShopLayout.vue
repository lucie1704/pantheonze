<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import TieredMenu from 'primevue/tieredmenu'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import { useRouter } from 'vue-router'

const isLoggedIn = ref(true)
const userMenu = ref<InstanceType<typeof TieredMenu> | null>(null)
const mobileMenu = ref(false)
const router = useRouter()

const menuItems = [
  {
    label: 'Pâtisseries',
    to: '/pastries',
  },
  {
    label: 'Viennoiseries',
    to: '/pastries/viennoiseries',
  },
  {
    label: 'Gâteaux',
    to: '/pastries/cakes',
  },
  {
    label: 'À propos',
    to: '/about',
  },
]

const userMenuItems = [
  {
    label: 'Mon compte',
    icon: 'pi pi-user',
    command: () => router.push('/account'),
    class: 'my-1',
  },
  {
    label: 'Mes commandes',
    icon: 'pi pi-shopping-bag',
    command: () => router.push('/account/orders'),
    class: 'my-1',
  },
  {
    label: 'Paramètres',
    icon: 'pi pi-cog',
    command: () => router.push('/account/settings'),
    class: 'my-1',
  },
  {
    separator: true,
    class: 'my-1',
  },
  {
    label: 'Se déconnecter',
    icon: 'pi pi-sign-out',
    command: () => {
      isLoggedIn.value = false
      router.push('/login')
    },
    class: 'my-1',
  },
]

const closeMobileMenu = () => {
  mobileMenu.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-column surface-ground">
    <!-- Header avec navigation -->
    <div class="surface-section border-bottom-1 surface-border">
      <div class="w-full px-3 md:w-9 mx-auto">
        <div
          class="flex align-items-center justify-content-between py-3"
          style="height: 80px"
        >
          <!-- Menu burger mobile (à gauche) -->
          <div class="flex align-items-center gap-3">
            <Button
              text
              plain
              class="md:hidden w-3rem h-3rem p-0 hover:surface-200"
              @click="mobileMenu = true"
            >
              <i class="pi pi-bars text-900 text-xl"></i>
            </Button>

            <!-- Logo -->
            <RouterLink
              to="/"
              class="no-underline"
            >
              <img
                src="/Logo.svg"
                alt="PanthéOnze"
                style="height: 60px"
              />
            </RouterLink>
          </div>

          <!-- Menu principal (caché sur mobile) -->
          <div class="hidden md:flex justify-content-center">
            <ul class="list-none p-0 m-0 flex">
              <li
                v-for="(item, index) in menuItems"
                :key="item.label"
                class="flex align-items-center"
              >
                <RouterLink
                  :to="item.to"
                  class="no-underline text-900 font-medium hover:text-primary transition-colors transition-duration-150 px-3"
                >
                  {{ item.label }}
                </RouterLink>
                <span
                  v-if="index < menuItems.length - 1"
                  class="text-300"
                  >|</span
                >
              </li>
            </ul>
          </div>

          <!-- Icônes droite -->
          <div class="flex align-items-center gap-2">
            <Button
              text
              plain
              class="w-3rem h-3rem p-0 hover:surface-200"
              @click="router.push('/cart')"
              v-tooltip.bottom="{ value: 'Mon panier' }"
            >
              <i class="pi pi-shopping-cart text-900 text-xl hover:text-primary"></i>
            </Button>

            <Button
              v-if="!isLoggedIn"
              text
              plain
              class="w-3rem h-3rem p-0 hover:surface-200"
              @click="router.push('/login')"
              v-tooltip.bottom="{ value: 'Se connecter' }"
            >
              <i class="pi pi-sign-in text-900 text-xl hover:text-primary"></i>
            </Button>

            <div
              v-else
              class="relative"
            >
              <Button
                text
                plain
                class="w-3rem h-3rem p-0 hover:surface-200"
                @click="userMenu?.toggle($event)"
                v-tooltip.bottom="{ value: 'Mon compte' }"
              >
                <i class="pi pi-user text-900 text-xl hover:text-primary"></i>
              </Button>
              <TieredMenu
                ref="userMenu"
                :model="userMenuItems"
                :popup="true"
                class="p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu mobile (Drawer) -->
    <Drawer
      v-model:visible="mobileMenu"
      position="left"
      :modal="true"
      :dismissable="true"
      class="w-20rem"
    >
      <div>
        <ul class="list-none p-0 m-0">
          <li
            v-for="item in menuItems"
            :key="item.label"
            class="mb-1"
          >
            <RouterLink
              :to="item.to"
              class="no-underline text-900 font-medium transition-colors transition-duration-150 flex align-items-center p-3 hover:surface-100"
              :class="{ 'bg-primary-50 text-primary border-left-2 border-primary': $route.path === item.to }"
              @click="closeMobileMenu"
            >
              <span>{{ item.label }}</span>
            </RouterLink>
          </li>
        </ul>

        <div
          v-if="!isLoggedIn"
          class="p-3 border-top-1 surface-border"
        >
          <Button
            label="Se connecter"
            icon="pi pi-sign-in"
            class="w-full"
            @click="[router.push('/login'), closeMobileMenu()]"
          />
        </div>
      </div>
    </Drawer>

    <!-- Main Content -->
    <main class="w-full px-3 md:w-9 flex-1 mx-auto">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="surface-section border-top-1 surface-border">
      <div class="w-full px-3 md:w-9 mx-auto py-4">
        <div class="grid">
          <!-- Contact -->
          <div class="col-12 md:col-4 mb-4 text-center md:text-left">
            <h3 class="text-xl font-bold mb-3 text-primary">Contact</h3>
            <div class="flex justify-content-center md:justify-content-start">
              <ul class="list-none p-0 m-0 inline-block text-left w-full max-w-15rem">
                <li class="mb-2 flex align-items-center gap-2">
                  <i class="pi pi-map-marker text-primary w-1rem"></i>
                  <span class="text-sm md:text-base">123 Rue de la Pâtisserie, Paris</span>
                </li>
                <li class="mb-2 flex align-items-center gap-2">
                  <i class="pi pi-phone text-primary w-1rem"></i>
                  <span class="text-sm md:text-base">01 23 45 67 89</span>
                </li>
                <li class="mb-2 flex align-items-center gap-2">
                  <i class="pi pi-envelope text-primary w-1rem"></i>
                  <span class="text-sm md:text-base">contact@pantheonze.com</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Horaires -->
          <div class="col-12 md:col-4 mb-4 text-center md:text-left">
            <h3 class="text-xl font-bold mb-3 text-primary">Horaires</h3>
            <div class="flex justify-content-center md:justify-content-start">
              <ul class="list-none p-0 m-0 inline-block text-left w-full max-w-15rem">
                <li class="mb-2 flex align-items-center">
                  <i class="pi pi-clock text-primary w-1rem mr-2"></i>
                  <div class="flex w-full">
                    <span class="text-sm md:text-base w-5rem">Lun-Ven</span>
                    <div class="flex gap-2">
                      <span class="text-sm md:text-base w-3rem text-right">7h30</span>
                      <span class="text-sm md:text-base px-1">-</span>
                      <span class="text-sm md:text-base w-3rem text-right">19h30</span>
                    </div>
                  </div>
                </li>
                <li class="mb-2 flex align-items-center">
                  <i class="pi pi-clock text-primary w-1rem mr-2"></i>
                  <div class="flex w-full">
                    <span class="text-sm md:text-base w-5rem">Samedi</span>
                    <div class="flex gap-2">
                      <span class="text-sm md:text-base w-3rem text-right">7h30</span>
                      <span class="text-sm md:text-base px-1">-</span>
                      <span class="text-sm md:text-base w-3rem text-right">20h00</span>
                    </div>
                  </div>
                </li>
                <li class="mb-2 flex align-items-center">
                  <i class="pi pi-clock text-primary w-1rem mr-2"></i>
                  <div class="flex w-full">
                    <span class="text-sm md:text-base w-5rem">Dimanche</span>
                    <div class="flex gap-2">
                      <span class="text-sm md:text-base w-3rem text-right">8h00</span>
                      <span class="text-sm md:text-base px-1">-</span>
                      <span class="text-sm md:text-base w-3rem text-right">13h00</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Liens légaux -->
          <div class="col-12 md:col-4 text-center md:text-left">
            <h3 class="text-xl font-bold mb-3 text-primary">Informations</h3>
            <div class="flex justify-content-center md:justify-content-start">
              <ul class="list-none p-0 m-0 inline-block text-left w-full max-w-15rem">
                <li class="mb-2">
                  <RouterLink
                    to="legal/mentions-legales"
                    class="text-primary hover:text-primary-600 no-underline flex align-items-center gap-2"
                  >
                    <i class="pi pi-file-edit w-1rem"></i>
                    <span class="text-sm md:text-base">Mentions légales</span>
                  </RouterLink>
                </li>
                <li class="mb-2">
                  <RouterLink
                    to="/legal/cgv"
                    class="text-primary hover:text-primary-600 no-underline flex align-items-center gap-2"
                  >
                    <i class="pi pi-file w-1rem"></i>
                    <span class="text-sm md:text-base">CGV</span>
                  </RouterLink>
                </li>
                <li class="mb-2">
                  <RouterLink
                    to="/legal/politique-confidentialite"
                    class="text-primary hover:text-primary-600 no-underline flex align-items-center gap-2"
                  >
                    <i class="pi pi-shield w-1rem"></i>
                    <span class="text-sm md:text-base">Politique de confidentialité</span>
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          class="text-center mt-5 text-500 flex flex-column md:flex-row align-items-center justify-content-center gap-2 border-top-1 surface-border pt-3"
        >
          <i class="pi pi-copyright"></i>
          <span class="text-sm md:text-base">2024 PanthéOnze - Tous droits réservés</span>
        </div>
      </div>
    </footer>
  </div>
</template>
