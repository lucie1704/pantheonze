import { Request, Response } from "express";
import { CartService } from "@/services";

export class CartController {
  // Récupérer le panier de l'utilisateur
  static getCart = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const cart = await CartService.getCartByUserId(userId);
      
      res.json(cart);
    } catch (error) {
      console.error('Error getting cart:', error);
      res.status(500).json({ error: "Failed to get cart" });
    }
  };

  // Ajouter un produit au panier
  static addItemToCart = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { pastryId, quantity = 1 } = req.body;

      if (!pastryId) {
        res.status(400).json({ error: "Product ID is required" });
        return;
      }

      const item = await CartService.addItemToCart(userId, pastryId, quantity);
      
      res.status(201).json(item);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  };

  // Mettre à jour la quantité d'un item
  static updateItemQuantity = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined || quantity < 0) {
        res.status(400).json({ error: "Valid quantity is required" });
        return;
      }

      const item = await CartService.updateItemQuantity(userId, itemId, quantity);
      
      res.json(item);
    } catch (error) {
      console.error('Error updating item quantity:', error);
      res.status(500).json({ error: "Failed to update item quantity" });
    }
  };

  // Supprimer un item du panier
  static removeItemFromCart = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { itemId } = req.params;

      await CartService.removeItemFromCart(userId, itemId);
      
      res.status(204).send();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  };

  // Vider le panier
  static clearCart = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      await CartService.clearCart(userId);
      
      res.status(204).send();
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  };

  // Obtenir le total du panier
  static getCartTotal = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const total = await CartService.getCartTotal(userId);
      
      res.json(total);
    } catch (error) {
      console.error('Error getting cart total:', error);
      res.status(500).json({ error: "Failed to get cart total" });
    }
  };
} 