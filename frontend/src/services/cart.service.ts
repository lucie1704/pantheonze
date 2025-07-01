import { API_URL } from '@/constants/api'
import { authService } from './auth.service'

export interface CartItem {
  id: string
  cartId: string
  pastryId: string
  quantity: number
  price: number
  addedAt: string
  pastry: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    category: {
      id: string
      name: string
    }
  }
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  updatedAt: string
}

export interface CartTotal {
  total: number
  itemCount: number
  totalItems: number
}

class CartService {
  async getCart(): Promise<Cart> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Token non trouvé')
    }

    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    const cartData = await response.json()
    return cartData.data
  }

  async addItemToCart(pastryId: string, quantity: number = 1): Promise<CartItem> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Token non trouvé')
    }

    const response = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ pastryId, quantity }),
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    const itemData = await response.json()
    return itemData.data
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
    try {
      const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ quantity })
      })
      if (!response.ok) {
        throw new Error('Failed to update item quantity')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating item quantity:', error)
      throw error
    }
  }

  async removeItemFromCart(itemId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to remove item from cart')
      }
    } catch (error) {
      console.error('Error removing item from cart:', error)
      throw error
    }
  }

  async clearCart(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  async getCartTotal(): Promise<CartTotal> {
    try {
      const response = await fetch(`${API_URL}/cart/total`, {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to get cart total')
      }
      return await response.json()
    } catch (error) {
      console.error('Error getting cart total:', error)
      throw error
    }
  }
}

export const cartService = new CartService() 