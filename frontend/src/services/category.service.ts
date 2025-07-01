import { API_URL } from '@/constants/api'

export interface Category {
  id: string
  name: string
  description?: string
  slug?: string
}

class CategoryService {
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_URL}/categories`)
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch category')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching category:', error)
      throw error
    }
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      })
      if (!response.ok) {
        throw new Error('Failed to create category')
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      })
      if (!response.ok) {
        throw new Error('Failed to update category')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }
}

export const categoryService = new CategoryService() 