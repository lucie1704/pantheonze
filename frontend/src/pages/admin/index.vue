<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { authService } from '@/services'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const stats = ref<any>(null)
const user = ref<any>(null)

onMounted(async () => {
  // Vérifier l'authentification
  const currentUser = authService.getUser()
  if (!currentUser) {
    router.push('/login')
    return
  }

  if (!authService.isAdminOrStorekeeper()) {
    toast.add({
      severity: 'error',
      summary: 'Accès refusé',
      detail: 'Vous n\'avez pas les permissions pour accéder à cette page',
      life: 3000,
    })
    router.push('/')
    return
  }

  user.value = currentUser
  await loadStats()
})

const loadStats = async () => {
  loading.value = true
  try {
    const token = authService.getToken()
    const response = await fetch('http://localhost:3000/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      stats.value = data.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  } finally {
    loading.value = false
  }
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

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'Administrateur'
    case 'STOREKEEPER':
      return 'Gestionnaire Stock'
    case 'CLIENT':
      return 'Client'
    default:
      return role
  }
}
</script>

<template>
  <div class="p-4">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="text-3xl font-bold text-primary mb-2">Backoffice Pantheonze</h1>
        <p class="text-600">
          Bienvenue {{ user?.name }} ({{ getRoleLabel(user?.role) }})
        </p>
      </div>
      <Button
        label="Déconnexion"
        icon="pi pi-sign-out"
        severity="secondary"
        @click="handleLogout"
      />
    </div>

    <!-- Statistiques -->
    <div class="grid mb-4">
      <div class="col-12 md:col-3">
        <Card class="text-center">
          <template #content>
            <div class="text-2xl font-bold text-primary">{{ stats?.totalOrders || 0 }}</div>
            <div class="text-600">Commandes totales</div>
          </template>
        </Card>
      </div>
      <div class="col-12 md:col-3">
        <Card class="text-center">
          <template #content>
            <div class="text-2xl font-bold text-green-500">{{ stats?.totalRevenue || 0 }}€</div>
            <div class="text-600">Chiffre d'affaires</div>
          </template>
        </Card>
      </div>
      <div class="col-12 md:col-3">
        <Card class="text-center">
          <template #content>
            <div class="text-2xl font-bold text-blue-500">{{ stats?.totalProducts || 0 }}</div>
            <div class="text-600">Produits</div>
          </template>
        </Card>
      </div>
      <div class="col-12 md:col-3">
        <Card class="text-center">
          <template #content>
            <div class="text-2xl font-bold text-orange-500">{{ stats?.totalCustomers || 0 }}</div>
            <div class="text-600">Clients</div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Actions rapides -->
    <Card class="mb-4">
      <template #header>
        <h2 class="text-xl font-bold">Actions rapides</h2>
      </template>
      <template #content>
        <div class="grid">
          <div class="col-12 md:col-4">
            <Button
              label="Gérer les pâtisseries"
              icon="pi pi-cake"
              class="w-full"
              severity="primary"
            />
          </div>
          <div class="col-12 md:col-4">
            <Button
              label="Gérer les stocks"
              icon="pi pi-box"
              class="w-full"
              severity="success"
            />
          </div>
          <div class="col-12 md:col-4">
            <Button
              label="Voir les commandes"
              icon="pi pi-shopping-cart"
              class="w-full"
              severity="info"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Informations utilisateur -->
    <Card>
      <template #header>
        <h2 class="text-xl font-bold">Informations de session</h2>
      </template>
      <template #content>
        <div class="grid">
          <div class="col-12 md:col-6">
            <p><strong>Nom:</strong> {{ user?.name }}</p>
            <p><strong>Email:</strong> {{ user?.email }}</p>
            <p><strong>Rôle:</strong> {{ getRoleLabel(user?.role) }}</p>
          </div>
          <div class="col-12 md:col-6">
            <p><strong>Statut:</strong> 
              <span class="text-green-500 font-bold">Connecté</span>
            </p>
            <p><strong>Permissions:</strong></p>
            <ul class="list-none p-0">
              <li v-if="authService.isAdmin()" class="text-green-500">
                ✓ Accès complet à toutes les fonctionnalités
              </li>
              <li v-if="authService.isStorekeeper()" class="text-blue-500">
                ✓ Gestion des stocks et commandes
              </li>
              <li class="text-600">
                ✓ Accès au backoffice
              </li>
            </ul>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template> 