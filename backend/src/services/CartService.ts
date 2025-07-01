import { prismaClient } from "./PrismaService";

export class CartService {
  // Récupérer le panier d'un utilisateur
  static async getCartByUserId(userId: string) {
    try {
      let cart = await prismaClient.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              pastry: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      });

      // Si le panier n'existe pas, le créer
      if (!cart) {
        cart = await prismaClient.cart.create({
          data: {
            userId
          },
          include: {
            items: {
              include: {
                pastry: {
                  include: {
                    category: true
                  }
                }
              }
            }
          }
        });
      }

      // Enrichir avec les régimes alimentaires
      if (cart && cart.items) {
        for (const item of cart.items) {
          if (item.pastry.dietIds && item.pastry.dietIds.length > 0) {
            (item.pastry as any).diets = await prismaClient.diet.findMany({
              where: { id: { in: item.pastry.dietIds } }
            });
          } else {
            (item.pastry as any).diets = [];
          }
        }
      }

      return cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  }

  // Ajouter un produit au panier
  static async addItemToCart(userId: string, pastryId: string, quantity: number = 1) {
    try {
      // Récupérer le produit pour vérifier le prix
      const pastry = await prismaClient.pastry.findUnique({
        where: { id: pastryId }
      });

      if (!pastry) {
        throw new Error('Product not found');
      }

      // Récupérer ou créer le panier
      let cart = await prismaClient.cart.findUnique({
        where: { userId }
      });

      if (!cart) {
        cart = await prismaClient.cart.create({
          data: { userId }
        });
      }

      // Vérifier si le produit est déjà dans le panier
      const existingItem = await prismaClient.cartItem.findFirst({
        where: {
          cartId: cart.id,
          pastryId
        }
      });

      if (existingItem) {
        // Mettre à jour la quantité
        const updatedItem = await prismaClient.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
            price: pastry.price // Mettre à jour le prix au cas où il aurait changé
          },
          include: {
            pastry: {
              include: {
                category: true
              }
            }
          }
        });

        // Enrichir avec les régimes alimentaires
        if (updatedItem.pastry.dietIds && updatedItem.pastry.dietIds.length > 0) {
          (updatedItem.pastry as any).diets = await prismaClient.diet.findMany({
            where: { id: { in: updatedItem.pastry.dietIds } }
          });
        } else {
          (updatedItem.pastry as any).diets = [];
        }

        return updatedItem;
      } else {
        // Ajouter un nouvel item
        const newItem = await prismaClient.cartItem.create({
          data: {
            cartId: cart.id,
            pastryId,
            quantity,
            price: pastry.price
          },
          include: {
            pastry: {
              include: {
                category: true
              }
            }
          }
        });

        // Enrichir avec les régimes alimentaires
        if (newItem.pastry.dietIds && newItem.pastry.dietIds.length > 0) {
          (newItem.pastry as any).diets = await prismaClient.diet.findMany({
            where: { id: { in: newItem.pastry.dietIds } }
          });
        } else {
          (newItem.pastry as any).diets = [];
        }

        return newItem;
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  // Mettre à jour la quantité d'un item
  static async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    try {
      // Vérifier que l'item appartient au panier de l'utilisateur
      const cart = await prismaClient.cart.findUnique({
        where: { userId },
        include: {
          items: {
            where: { id: itemId }
          }
        }
      });

      if (!cart || cart.items.length === 0) {
        throw new Error('Item not found in user cart');
      }

      if (quantity <= 0) {
        // Supprimer l'item si la quantité est 0 ou négative
        return await this.removeItemFromCart(userId, itemId);
      }

      // Mettre à jour la quantité
      const updatedItem = await prismaClient.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: {
          pastry: {
            include: {
              category: true
            }
          }
        }
      });

      // Enrichir avec les régimes alimentaires
      if (updatedItem.pastry.dietIds && updatedItem.pastry.dietIds.length > 0) {
        (updatedItem.pastry as any).diets = await prismaClient.diet.findMany({
          where: { id: { in: updatedItem.pastry.dietIds } }
        });
      } else {
        (updatedItem.pastry as any).diets = [];
      }

      return updatedItem;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  }

  // Supprimer un item du panier
  static async removeItemFromCart(userId: string, itemId: string) {
    try {
      // Vérifier que l'item appartient au panier de l'utilisateur
      const cart = await prismaClient.cart.findUnique({
        where: { userId },
        include: {
          items: {
            where: { id: itemId }
          }
        }
      });

      if (!cart || cart.items.length === 0) {
        throw new Error('Item not found in user cart');
      }

      // Supprimer l'item
      await prismaClient.cartItem.delete({
        where: { id: itemId }
      });

      return { success: true };
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }

  // Vider le panier
  static async clearCart(userId: string) {
    try {
      const cart = await prismaClient.cart.findUnique({
        where: { userId }
      });

      if (!cart) {
        return { success: true };
      }

      // Supprimer tous les items du panier
      await prismaClient.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Calculer le total du panier
  static async getCartTotal(userId: string) {
    try {
      const cart = await this.getCartByUserId(userId);
      
      const total = cart.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      return {
        total,
        itemCount: cart.items.length,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      };
    } catch (error) {
      console.error('Error calculating cart total:', error);
      throw error;
    }
  }
} 