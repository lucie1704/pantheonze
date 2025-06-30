<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { RouterLink } from 'vue-router'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const currentUser = computed(() => authService.getUser())

// Menu de navigation admin
const menuItems = [
  {
    label: 'Tableau de bord',
    to: '/admin',
    pathPattern: '/admin',
    command: () => router.push('/admin')
  },
  {
    label: 'Produits',
    to: '/admin/pastries',
    pathPattern: '/admin/pastries',
    command: () => router.push('/admin/pastries')
  },
  {
    label: 'Commandes',
    to: '/admin/orders',
    pathPattern: '/admin/orders',
    command: () => router.push('/admin/orders')
  }
]

// Fonction pour vérifier si un lien est actif
const isActive = (pathPattern: string) => {
  // Pour le tableau de bord, on vérifie une correspondance exacte
  if (pathPattern === '/admin') {
    return route.path === '/admin'
  }
  // Pour les autres pages, on vérifie si le chemin commence par le pattern
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
}
</script>

<template>
  <div class="admin-sidebar">
    <!-- Logo -->
    <div class="sidebar-header">
      <div class="logo-container">
        <RouterLink to="/" class="logo-link">
          <img src="/Logo-white.svg" alt="PanthéOnze Admin" class="logo" />
        </RouterLink>
      </div>
    </div>

    <!-- User info et logout -->
    <div class="sidebar-user">
      <div class="flex justify-content-between align-items-center">
        <div class="flex flex-column">
          <span class="font-bold">{{ currentUser?.name || 'Utilisateur' }}</span>
          <span class="text-sm text-gray-500">{{ currentUser?.role === 'ADMIN' ? 'Administrateur' : currentUser?.role === 'STOREKEEPER' ? 'Gestionnaire' : 'Utilisateur' }}</span>
        </div>
        <Button
          icon="pi pi-sign-out"
          text
          @click="handleLogout"
          class="logout-btn-icon"
          v-tooltip.right="{ value: 'Se déconnecter' }"
        />
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li
          v-for="item in menuItems"
          :key="item.label"
          class="nav-item"
        >
          <div
            class="nav-link"
            :class="{ active: isActive(item.pathPattern) }"
            @click="item.command"
          >
            <span>{{ item.label }}</span>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.admin-sidebar {
  width: 280px;
  background: #2d2d2d;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 1000;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #404040;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-link {
  text-decoration: none;
  color: #e0e0e0;
}

.logo {
  height: 2rem;
  filter: brightness(0) invert(1);
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e0e0e0;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

/* User info et logout */
.sidebar-user {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #404040;
  background: #1a1a1a;
}

.user-name {
  font-weight: 600;
  color: #e0e0e0;
  font-size: 0.9rem;
}

.user-role {
  color: #999999;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.logout-btn-icon {
  color: #ffffff;
  width: auto;
  height: auto;
  padding: 0.5rem;
}

.logout-btn-icon:hover {
  background: #404040;
  color: #ffffff;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0.25rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: #404040;
  color: #e0e0e0;
}

.nav-link.active {
  background: #404040;
  color: #ffffff;
  border-left-color: #666666;
}

/* Groupes de navigation */
.nav-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-group-header:hover {
  background: #404040;
  color: #e0e0e0;
}

.nav-arrow {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.nav-submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: #1a1a1a;
  display: none;
}

.nav-group:hover .nav-submenu {
  display: block;
}

.nav-subitem {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem 0.5rem 3rem;
  color: #999999;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-subitem:hover {
  background: #404040;
  color: #e0e0e0;
}
</style> 