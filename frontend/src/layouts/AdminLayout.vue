<script setup lang="ts">
import { ref } from 'vue'
import { AdminSidebar } from '@/components'
import Button from 'primevue/button'

const sidebarVisible = ref<boolean>(true)

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    
    
    <!-- Aside avec Sidebar -->
    <aside class="flex-shrink-0" :class="!sidebarVisible ? 'w-0' : 'w-20rem'">
      <div class="h-full" :class="{ 'hidden': !sidebarVisible }">
        <AdminSidebar :visible="sidebarVisible"/>
      </div>
    </aside>

    <!-- Contenu principal -->
    <main class="flex-1 overflow-y-auto p-3 transition-all duration-300" :class="{ 'w-full': !sidebarVisible }">
      <!-- Bouton pour ouvrir le sidebar -->
      <Button 
        :icon="sidebarVisible ? 'pi pi-times' : 'pi pi-bars'" 
        @click="toggleSidebar" 
        outlined
        class="mb-2"
      />
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
/* Responsive */
@media (max-width: 1024px) {
  aside {
    width: 0 !important;
  }
  
  main {
    width: 100% !important;
  }
}

@media (max-width: 768px) {
  main {
    padding: 0.75rem !important;
  }
}
</style> 