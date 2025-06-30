<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Drawer from 'primevue/drawer'
import Divider from 'primevue/divider'
import { useToast } from 'primevue/usetoast'
import { RouterLink } from 'vue-router'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const visible = ref(false)
const isDesktop = ref(window.innerWidth >= 1024)

const currentUser = computed(() => authService.getUser())

// Menu de navigation admin
const menuItems = [
  {
    label: 'Tableau de bord',
    icon: 'pi pi-home',
    to: '/admin',
    pathPattern: '/admin'
  },
  {
    label: 'Produits',
    icon: 'pi pi-box',
    to: '/admin/pastries',
    pathPattern: '/admin/pastries'
  },
  {
    label: 'Commandes',
    icon: 'pi pi-shopping-cart',
    to: '/admin/orders',
    pathPattern: '/admin/orders'
  }
]

// Fonction pour vérifier si un lien est actif
const isActive = (pathPattern: string) => {
  if (pathPattern === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(pathPattern)
}

const handleLogout = () => {
  authService.logout()
  toast.add({
    severity: 'success',
    summary: 'Déconnexion',
    detail: 'Vous avez été déconnecté avec succès',
    life: 3000,
  })
  router.push('/login')
  visible.value = false
}

const navigateTo = (path: string) => {
  router.push(path)
  visible.value = false
}

const getRoleLabel = (role: string | undefined) => {
  switch (role) {
    case 'ADMIN':
      return 'Administrateur'
    case 'STOREKEEPER':
      return 'Gestionnaire'
    default:
      return 'Utilisateur'
  }
}

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024
  if (isDesktop.value) {
    visible.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <Drawer
    v-model:visible="visible"
    :modal="false"
    :show-close-icon="false"
    class="bg-gray-900 border-none"
  >
    <template #header>
      <RouterLink to="/" class="w-full">
        <img src="/Logo-white.svg" alt="PanthéOnze Admin" class="h-3rem -ml-2 -mb-2" />
      </RouterLink>    
    </template>

    <!-- Infos utilisateur -->
    <div class="flex flex-column bg-gray-800 p-4 border-round mb-4">
      <span class="font-medium text-lg text-white">{{ currentUser?.name }}</span>
      <span class="text-sm text-gray-400">{{ getRoleLabel(currentUser?.role) }}</span>
    </div>

    <!-- Navigation -->
    <div class="flex flex-column">
      <RouterLink 
        v-for="item in menuItems" 
        :key="item.to"
        :to="item.to"
        class="flex items-center px-4 py-3 mb-1 align-items-center text-gray-300 border-left-3 border-transparent hover:bg-gray-800 hover:text-white duration-150 transition-colors no-underline"
        :class="{ 'border-gray-700 text-white': isActive(item.pathPattern) }"
      >
        <i :class="item.icon" class="mr-4"></i>
        <span class="font-medium">{{ item.label }}</span>
      </RouterLink>
    </div>

    <template #footer>
      <Button
        @click="handleLogout"
        icon="pi pi-sign-out"
        label="Se déconnecter"
        class="w-full justify-start bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
        text
      />
    </template>
  </Drawer>
</template>