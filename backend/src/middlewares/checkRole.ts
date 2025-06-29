import { Request, Response, NextFunction } from 'express'
import { AuthService } from '@/services'

export const checkRole = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      })
      return
    }

    const authService = new AuthService()
    
    authService.verifyToken(token)
      .then(user => {
        if (!authService.hasRole(user, requiredRoles)) {
          res.status(403).json({
            success: false,
            message: 'Accès refusé. Permissions insuffisantes.'
          })
          return
        }

        // Ajouter l'utilisateur à la requête pour utilisation ultérieure
        req.user = user
        next()
      })
      .catch(error => {
        res.status(401).json({
          success: false,
          message: error.message
        })
      })
  }
}

// Middleware pour vérifier si l'utilisateur est admin
export const requireAdmin = checkRole(['ADMIN'])

// Middleware pour vérifier si l'utilisateur est admin ou storekeeper
export const requireAdminOrStorekeeper = checkRole(['ADMIN', 'STOREKEEPER'])

// Middleware pour vérifier si l'utilisateur est connecté (n'importe quel rôle)
export const requireAuth = checkRole(['ADMIN', 'STOREKEEPER', 'CLIENT']) 