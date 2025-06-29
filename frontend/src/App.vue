<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ShopLayout from './layouts/ShopLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'

const route = useRoute()

// Déterminer quel layout utiliser selon la route
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <Toast position="bottom-right" />
  
  <!-- Layout conditionnel -->
  <ShopLayout v-if="!isAdminRoute">
    <router-view />
  </ShopLayout>
  
  <AdminLayout v-else>
    <router-view />
  </AdminLayout>
</template>

<style>
body {
  overflow-x: hidden;
}
</style>
