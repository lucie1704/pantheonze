import { prismaClient } from "@/services";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class AuthService {
  async login(email: string, password: string) {
    try {
      // Trouver l'utilisateur par email
      const user = await prismaClient.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
          isActive: true
        }
      })

      if (!user) {
        throw new Error('Email ou mot de passe incorrect')
      }

      if (!user.isActive) {
        throw new Error('Compte désactivé')
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect')
      }

      // Mettre à jour la dernière connexion
      await prismaClient.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      })

      // Générer le token JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      )

      // Retourner les informations utilisateur (sans le mot de passe)
      const { password: _, ...userWithoutPassword } = user
      
      return {
        user: userWithoutPassword,
        token
      }
    } catch (error) {
      throw error
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      
      const user = await prismaClient.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true
        }
      })

      if (!user || !user.isActive) {
        throw new Error('Utilisateur non trouvé ou désactivé')
      }

      return user
    } catch (error) {
      throw new Error('Token invalide')
    }
  }

  hasRole(user: any, requiredRoles: string[]) {
    return requiredRoles.includes(user.role)
  }
} 