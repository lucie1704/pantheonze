import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'

export default function authRoutes(router: Router) {
  router.post(
    '/login', 
    AuthController.login
  )

  router.get(
    '/verify', 
    AuthController.verifyToken
  )

  return router
} 