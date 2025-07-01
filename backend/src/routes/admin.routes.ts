import { Router } from 'express'
import { requireAdminOrStorekeeper } from '@/middlewares'

export default function (router: Router) {
  router.get(
    '/admin/dashboard', 
    requireAdminOrStorekeeper
  )

  router.get(
    '/admin/stats', 
    requireAdminOrStorekeeper
  )

  return router
} 