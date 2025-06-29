import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { authService } from '@/services'

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// Navigation guard pour protéger les routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin

  if (requiresAuth && !authService.isAuthenticated()) {
    next('/login')
  } else if (requiresAdmin && !authService.isAdminOrStorekeeper()) {
    next('/')
  } else {
    next()
  }
})
