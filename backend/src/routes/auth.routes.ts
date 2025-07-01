import { Router } from 'express'
import { AuthController } from '@/controllers'

export default function (router: Router) {
  router.post(
    '/auth/login', 
    AuthController.login
  )

  router.get(
    '/auth/verify', 
    AuthController.verifyToken
  )

  return router
} 