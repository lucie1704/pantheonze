import { Router } from 'express'
import { requireAdminOrStorekeeper } from '@/middlewares'

export default function adminRoutes(router: Router) {
  router.get(
    '/dashboard', 
    requireAdminOrStorekeeper
  )

  router.get(
    '/stats', 
    requireAdminOrStorekeeper
  )

  return router
} 