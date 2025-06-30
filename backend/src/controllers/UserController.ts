import { Request, Response } from 'express'
import { UserService } from '@/services'

const userService = new UserService()

export class UserController {
  static async getUserDietaryPreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Utilisateur non authentifié' })
        return
      }

      const preferences = await userService.getUserDietaryPreferences(userId)
      res.json(preferences)
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error)
      res.status(500).json({ message: 'Erreur serveur' })
    }
  }

  static async updateUserDietaryPreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Utilisateur non authentifié' })
        return
      }

      const { dietIds } = req.body
      if (!Array.isArray(dietIds)) {
        res.status(400).json({ message: 'dietIds doit être un tableau' })
        return
      }

      const preferences = await userService.updateUserDietaryPreferences(userId, dietIds)
      res.json(preferences)
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error)
      res.status(500).json({ message: 'Erreur serveur' })
    }
  }

  static async addDietaryPreference(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Utilisateur non authentifié' })
        return
      }

      const { dietId } = req.body
      if (!dietId) {
        res.status(400).json({ message: 'dietId est requis' })
        return
      }

      const preferences = await userService.addDietaryPreference(userId, dietId)
      res.json(preferences)
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la préférence:', error)
      res.status(500).json({ message: 'Erreur serveur' })
    }
  }

  static async removeDietaryPreference(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Utilisateur non authentifié' })
        return
      }

      const { dietId } = req.params
      if (!dietId) {
        res.status(400).json({ message: 'dietId est requis' })
        return
      }

      const preferences = await userService.removeDietaryPreference(userId, dietId)
      res.json(preferences)
    } catch (error) {
      console.error('Erreur lors de la suppression de la préférence:', error)
      res.status(500).json({ message: 'Erreur serveur' })
    }
  }

  static async getAvailableDiets(req: Request, res: Response): Promise<void> {
    try {
      const diets = await userService.getAvailableDiets()
      res.json(diets)
    } catch (error) {
      console.error('Erreur lors de la récupération des régimes disponibles:', error)
      res.status(500).json({ message: 'Erreur serveur' })
    }
  }
} 