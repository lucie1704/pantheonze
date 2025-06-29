import { Router } from 'express'
import { requireAdminOrStorekeeper } from '@/middlewares'

export default function adminRoutes(router: Router) {
  // Route du dashboard admin
  router.get('/dashboard', requireAdminOrStorekeeper, (req, res) => {
    res.json({
      success: true,
      data: {
        message: 'Bienvenue dans le backoffice Pantheonze',
        user: req.user,
        features: [
          'Gestion des pâtisseries',
          'Gestion des stocks',
          'Gestion des commandes',
          'Gestion des utilisateurs',
          'Statistiques de vente'
        ]
      }
    })
  })

  // Route pour les statistiques (admin seulement)
  router.get('/stats', requireAdminOrStorekeeper, (req, res) => {
    res.json({
      success: true,
      data: {
        totalOrders: 150,
        totalRevenue: 2500.50,
        totalProducts: 25,
        totalCustomers: 89
      }
    })
  })

  return router
} 