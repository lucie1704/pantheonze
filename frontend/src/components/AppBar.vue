<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TieredMenu from 'primevue/tieredmenu'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import { useRouter, useRoute } from 'vue-router'
import { Banner } from '@/components'
import { authService } from '@/services'

interface Props {
  showBanner?: boolean
  bannerImageUrl?: string
  bannerImageAlt?: string
  bannerLogoUrl?: string
  bannerLogoAlt?: string
  bannerSubtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  showBanner: false,
  bannerImageAlt: 'Banner image',
  bannerLogoAlt: 'Logo',
  bannerSubtitle: '',
})

const route = useRoute()

const homeBannerConfig = {
  imageUrl: '/banner.jpg',
  imageAlt: 'Boulangerie artisanale',
  logoUrl: '/Logo-white.svg',
  logoAlt: 'Panthéonze Logo',
  subtitle: 'Pâtisserie moderne & créative du 11e arrondissement',
}

const shouldShowBanner = computed(() => {
  if (props.showBanner !== false && (props.bannerImageUrl || route.path === '/')) {
    return true
  }
  return route.path === '/'
})

const bannerConfig = computed(() => {
  if (props.bannerImageUrl) {
    return {
      imageUrl: props.bannerImageUrl,
      imageAlt: props.bannerImageAlt,
      logoUrl: props.bannerLogoUrl || '/Logo-white.svg',
      logoAlt: props.bannerLogoAlt,
      subtitle: props.bannerSubtitle,
    }
  }
  return homeBannerConfig
})

const authState = ref({
  isLoggedIn: authService.isAuthenticated(),
  user: authService.getUser()
})

const updateAuthState = () => {
  authState.value = {
    isLoggedIn: authService.isAuthenticated(),
    user: authService.getUser()
  }
}

window.addEventListener('auth-change', updateAuthState)

const isLoggedIn = computed(() => authState.value.isLoggedIn)
const currentUser = computed(() => authState.value.user)
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

const userMenuItems = computed(() => {
  // Menu simplifié pour les admins
  if (authService.isAdminOrStorekeeper()) {
    return [
      {
        label: 'Backoffice',
        icon: 'pi pi-cog',
        command: () => router.push('/admin'),
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
          authService.logout()
          updateAuthState()
          router.push('/login')
        },
        class: 'my-1',
      },
    ]
  }

  // Menu complet pour les utilisateurs normaux
  return [
    {
      label: currentUser.value?.name || 'Mon profil',
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
        authService.logout()
        updateAuthState()
        router.push('/login')
      },
      class: 'my-1',
    },
  ]
})

const closeMobileMenu = () => {
  mobileMenu.value = false
}

updateAuthState()
</script>

<template>
  <div>
    <div class="surface-section border-bottom-1 surface-border">
      <div class="w-full lg:w-9 mx-auto">
        <div
          class="flex align-items-center justify-content-between py-3 px-2"
          style="height: 80px"
        >
          <!-- Section gauche : Menu burger + Logo -->
          <div class="flex align-items-center gap-3">
            <Button
              text
              plain
              class="block lg:hidden w-3rem h-3rem p-0 hover:surface-200"
              @click="mobileMenu = true"
            >
              <i class="pi pi-bars text-900 text-xl"></i>
            </Button>

            <!-- Logo (masqué sur la page d'accueil, centré sur mobile, à gauche sur desktop) -->
            <div
              v-if="route.path !== '/'"
              class="flex align-items-center"
            >
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
          </div>

          <!-- Menu principal (caché sur mobile) -->
          <div
            class="hidden lg:flex"
            :class="route.path === '/' ? 'justify-content-start flex-grow-1' : 'justify-content-center'"
          >
            <ul class="list-none p-0 m-0 flex">
              <li
                v-for="(item, index) in menuItems"
                :key="item.label"
                class="flex align-items-center"
              >
                <RouterLink
                  :to="item.to"
                  class="no-underline text-900 font-medium hover:text-primary transition-colors transition-duration-150 px-3"
                  :class="{ 'text-primary': $route.fullPath === item.to }"
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
          <div class="flex align-items-center">
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
                :class="{ 'border-left-3 border-primary': $route.fullPath === item.to }"
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

    <!-- Banner Section (conditionnel) -->
    <Banner
      v-if="shouldShowBanner"
      :image-url="bannerConfig.imageUrl"
      :image-alt="bannerConfig.imageAlt"
      :logo-url="bannerConfig.logoUrl"
      :logo-alt="bannerConfig.logoAlt"
      :subtitle="bannerConfig.subtitle"
    />
  </div>
</template>
