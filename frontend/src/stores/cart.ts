import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService, type Cart, type CartItem, type CartTotal } from '@/services'
import { useToast } from 'primevue/usetoast'

export const useCartStore = defineStore('cart', () => {
  const toast = useToast()
  
  // État réactif
  const cart = ref<Cart | null>(null)
  const loading = ref(false)
  const cartTotal = ref<CartTotal | null>(null)

  // Getters
  const items = computed(() => cart.value?.items || [])
  const itemCount = computed(() => cartTotal.value?.totalItems || 0)
  const totalPrice = computed(() => cartTotal.value?.total || 0)
  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const fetchCart = async () => {
    loading.value = true
    try {
      cart.value = await cartService.getCart()
      await fetchCartTotal()
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger le panier',
        life: 3000,
      })
    } finally {
      loading.value = false
    }
  }

  const fetchCartTotal = async () => {
    try {
      cartTotal.value = await cartService.getCartTotal()
    } catch (error) {
      console.error('Error fetching cart total:', error)
    }
  }

  const addToCart = async (pastryId: string, quantity: number = 1) => {
    loading.value = true
    try {
      const newItem = await cartService.addItemToCart(pastryId, quantity)
      
      // Mettre à jour le panier local
      if (cart.value) {
        const existingItemIndex = cart.value.items.findIndex(item => item.pastryId === pastryId)
        if (existingItemIndex >= 0) {
          // Mettre à jour l'item existant
          cart.value.items[existingItemIndex] = newItem
        } else {
          // Ajouter le nouvel item
          cart.value.items.push(newItem)
        }
      }
      
      await fetchCartTotal()
      
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Produit ajouté au panier',
        life: 3000,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible d\'ajouter au panier',
        life: 3000,
      })
    } finally {
      loading.value = false
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    loading.value = true
    try {
      const updatedItem = await cartService.updateItemQuantity(itemId, quantity)
      
      // Mettre à jour l'item dans le panier local
      if (cart.value) {
        const itemIndex = cart.value.items.findIndex(item => item.id === itemId)
        if (itemIndex >= 0) {
          if (quantity <= 0) {
            // Supprimer l'item si la quantité est 0
            cart.value.items.splice(itemIndex, 1)
          } else {
            // Mettre à jour l'item
            cart.value.items[itemIndex] = updatedItem
          }
        }
      }
      
      await fetchCartTotal()
      
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Quantité mise à jour',
        life: 2000,
      })
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de mettre à jour la quantité',
        life: 3000,
      })
    } finally {
      loading.value = false
    }
  }

  const removeFromCart = async (itemId: string) => {
    loading.value = true
    try {
      await cartService.removeItemFromCart(itemId)
      
      // Supprimer l'item du panier local
      if (cart.value) {
        const itemIndex = cart.value.items.findIndex(item => item.id === itemId)
        if (itemIndex >= 0) {
          cart.value.items.splice(itemIndex, 1)
        }
      }
      
      await fetchCartTotal()
      
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Produit retiré du panier',
        life: 3000,
      })
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de retirer du panier',
        life: 3000,
      })
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    loading.value = true
    try {
      await cartService.clearCart()
      
      // Vider le panier local
      if (cart.value) {
        cart.value.items = []
      }
      cartTotal.value = null
      
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Panier vidé',
        life: 3000,
      })
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de vider le panier',
        life: 3000,
      })
    } finally {
      loading.value = false
    }
  }

  const getItemQuantity = (pastryId: string) => {
    const item = items.value.find(item => item.pastryId === pastryId)
    return item ? item.quantity : 0
  }

  return {
    // État
    cart,
    loading,
    cartTotal,
    
    // Getters
    items,
    itemCount,
    totalPrice,
    isEmpty,
    
    // Actions
    fetchCart,
    fetchCartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemQuantity
  }
}) 