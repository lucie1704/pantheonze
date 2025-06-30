<script setup lang="ts">
import { ref } from 'vue'
import Drawer from 'primevue/drawer'
import { AdminSidebar } from '@/components'
import { RouterLink } from 'vue-router'

const sidebarVisible = ref(false)
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar fixe (desktop) -->
    <AdminSidebar />
    
    <!-- Contenu -->
    <main class="admin-main p-3">
      <slot></slot>
    </main>

    <!-- Sidebar mobile -->
    <Drawer
      v-model:visible="sidebarVisible"
      position="left"
      class="admin-sidebar-mobile"
      :modal="true"
      :dismissable="true"
    >
      <template #header>
        <div class="mobile-sidebar-header">
          <RouterLink to="/" class="mobile-logo-link">
            <img src="/Logo-white.svg" alt="PanthéOnze Admin" class="mobile-logo" />
          </RouterLink>
        </div>
      </template>
      
      <AdminSidebar />
    </Drawer>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
}

/* Contenu principal */
.admin-main {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #ffffff;
}

/* Header */
.admin-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-toggle {
  color: #495057;
  font-size: 1.2rem;
}

.page-title {
  color: #212529;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.view-site-btn {
  color: #495057;
  border: 1px solid #dee2e6;
}

.view-site-btn:hover {
  background: #e9ecef;
  color: #495057;
}

/* Sidebar mobile */
.admin-sidebar-mobile {
  background: #2d2d2d;
}

.mobile-sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e0e0e0;
  font-size: 1.2rem;
  font-weight: 600;
}

.mobile-logo {
  height: 2rem;
  filter: brightness(0) invert(1);
}

.mobile-logo-link {
  text-decoration: none;
  color: inherit;
}

/* Responsive */
@media (max-width: 1024px) {
  .admin-main {
    margin-left: 0;
  }
}
</style> 