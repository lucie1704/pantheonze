<script setup lang="ts">
import { ref } from 'vue'
import TieredMenu from 'primevue/tieredmenu'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import { useRouter } from 'vue-router'

const isLoggedIn = ref(true)
const userMenu = ref()
const mobileMenu = ref(false)
const router = useRouter()

const menuItems = [
  {
    label: 'Pâtisseries',
    to: '/pastries?categories=Pâtisseries',
  },
  {
    label: 'Viennoiseries',
    to: '/pastries?categories=Viennoiseries',
  },
  {
    label: 'Gâteaux',
    to: '/pastries?categories=Gâteaux',
  },
  {
    label: 'À propos',
    to: '/about',
  },
]

const userMenuItems = [
  {
    label: 'Mon profil',
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
  <div class="surface-section border-bottom-1 surface-border">
    <div class="w-full lg:w-9 mx-auto">
      <div
        class="flex align-items-center lg:justify-content-between py-3 px-2"
        style="height: 80px"
      >
        <Button
          text
          plain
          class="block lg:hidden w-3rem h-3rem p-0 hover:surface-200"
          @click="mobileMenu = true"
        >
          <i class="pi pi-bars text-900 text-xl"></i>
        </Button>

        <!-- Logo (centré sur mobile, à gauche sur desktop) -->
        <div class="flex align-items-center flex-grow-1 lg:flex-grow-0">
          <RouterLink
            to="/"
            class="no-underline flex align-items-center"
          >
            <img
              src="/Logo.svg"
              alt="PanthéOnze Logo"
              class="h-2rem sm:h-3rem md:h-4rem"
            />
          </RouterLink>
        </div>

        <!-- Menu principal (caché sur mobile) -->
        <div class="hidden lg:flex flex-grow-1 justify-content-center">
          <ul class="list-none p-0 m-0 flex">
            <li
              v-for="(item, index) in menuItems"
              :key="item.label"
              class="flex align-items-center"
            >
              <RouterLink
                :to="item.to"
                class="no-underline text-900 font-medium hover:text-primary transition-colors transition-duration-150 px-3"
                :class="{ 'text-primary': $route.path === item.to }"
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
            @click="$router.push('/cart')"
            v-tooltip.bottom="{ value: 'Mon panier' }"
          >
            <i class="pi pi-shopping-cart text-900 text-xl hover:text-primary"></i>
          </Button>

          <Button
            v-if="!isLoggedIn"
            text
            plain
            class="w-3rem h-3rem p-0 hover:surface-200"
            @click="$router.push('/login')"
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
              @click="userMenu.toggle($event)"
              v-tooltip.bottom="{ value: 'Mon profil' }"
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

    <!-- Menu mobile (Drawer) -->
    <Drawer
      v-model:visible="mobileMenu"
      position="left"
      class="w-20rem"
    >
      <div class="p-4">
        <h3 class="text-xl font-bold mb-4 text-primary">Navigation</h3>
        <ul class="list-none p-0 m-0">
          <li
            v-for="item in menuItems"
            :key="item.label"
            class="mb-3"
          >
            <RouterLink
              :to="item.to"
              class="no-underline text-900 font-medium hover:text-primary transition-colors transition-duration-150 flex align-items-center gap-3 p-3 hover:surface-100 relative"
              :class="{ 'border-left-3 border-primary': $route.path.startsWith(item.to) }"
              @click="closeMobileMenu"
            >
              <span>{{ item.label }}</span>
            </RouterLink>
          </li>
        </ul>

        <!-- Menu utilisateur mobile -->
        <div
          v-if="!isLoggedIn"
          class="mt-5 pt-3 border-top-1 surface-border"
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
  </div>
</template>
