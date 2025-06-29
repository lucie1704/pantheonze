import { Request, Response } from 'express'
import { AuthService } from '@/services'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        })
      }

      const result = await this.authService.login(email, password)

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

  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '')

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token requis'
        })
      }

      const user = await this.authService.verifyToken(token)

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