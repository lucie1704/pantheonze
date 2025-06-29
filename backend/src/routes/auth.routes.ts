import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'

export default function authRoutes(router: Router) {
  const authController = new AuthController()

  // Route de connexion
  router.post('/login', authController.login.bind(authController))

  // Route de vérification de token
  router.get('/verify', authController.verifyToken.bind(authController))

  return router
} 