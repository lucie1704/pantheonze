import { Request, Response } from 'express'
import { AuthService } from '@/services/AuthService'

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        })
        return
      }

      const authService = new AuthService()
      const result = await authService.login(email, password)

      res.status(200).json({
        success: true,
        data: result
      })
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      })
    }
  }

  static async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '')

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token requis'
        })
        return
      }

      const authService = new AuthService()
      const user = await authService.verifyToken(token)

      res.status(200).json({
        success: true,
        data: { user }
      })
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      })
    }
  }
} 