import { API_URL } from '@/constants/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'STOREKEEPER' | 'CLIENT'
  isActive: boolean
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

class AuthService {
  private tokenKey = 'pantheonze_token'
  private userKey = 'pantheonze_user'

  private emitAuthChange() {
    // Émettre un événement personnalisé pour notifier les changements
    window.dispatchEvent(new CustomEvent('auth-change', {
      detail: {
        isAuthenticated: this.isAuthenticated(),
        user: this.getUser()
      }
    }))
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erreur de connexion')
    }

    if (data.success) {
      this.setToken(data.data.token)
      this.setUser(data.data.user)
      this.emitAuthChange()
      return data.data
    }

    throw new Error('Erreur de connexion')
  }

  async verifyToken(): Promise<AuthUser | null> {
    const token = this.getToken()
    if (!token) return null

    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        this.setUser(data.data.user)
        this.emitAuthChange()
        return data.data.user
      }

      // Token invalide, on le supprime
      this.logout()
      return null
    } catch (error) {
      this.logout()
      return null
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
    this.emitAuthChange()
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey)
    console.log('🔐 [AUTH SERVICE] Getting token:', token ? 'Token exists' : 'No token')
    return token
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token)
  }

  getUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.userKey)
    return userStr ? JSON.parse(userStr) : null
  }

  setUser(user: AuthUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user))
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  hasRole(requiredRoles: string[]): boolean {
    const user = this.getUser()
    return user ? requiredRoles.includes(user.role) : false
  }

  isAdmin(): boolean {
    return this.hasRole(['ADMIN'])
  }

  isStorekeeper(): boolean {
    return this.hasRole(['STOREKEEPER'])
  }

  isAdminOrStorekeeper(): boolean {
    return this.hasRole(['ADMIN', 'STOREKEEPER'])
  }
}

export const authService = new AuthService() 