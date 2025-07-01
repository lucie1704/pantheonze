import { API_URL } from '@/constants/api'
import { authService } from './auth.service'

export interface OrderItem {
  id: string
  orderId: string
  pastryId: string
  quantity: number
  price: number
  name: string
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
    diets?: Array<{
      id: string
      name: string
    }>
  }
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  taxAmount: number
  deliveryFee: number
  discount: number
  total: number
  status: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  paymentMethod?: string
  paymentStatus: string
  paymentId?: string
  notes?: string
  estimatedReady?: string
  readyAt?: string
  pickedUpAt?: string
  createdAt: string
  updatedAt: string
}

class OrderService {
  async getUserOrders(): Promise<Order[]> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Token non trouvé')
    }

    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    const ordersData = await response.json()
    return ordersData
  }

  async getOrderById(orderId: string): Promise<Order> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Token non trouvé')
    }

    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    const orderData = await response.json()
    return orderData
  }

  async getAllOrders(): Promise<Order[]> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Token non trouvé')
    }

    const response = await fetch(`${API_URL}/orders/admin/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    const ordersData = await response.json()
    return ordersData
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Token non trouvé')
    }

    const response = await fetch(`${API_URL}/orders/admin/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    const orderData = await response.json()
    return orderData
  }
}

export const orderService = new OrderService() 