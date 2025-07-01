import { Request, Response } from "express";
import { OrderService } from "@/services";

export class OrderController {
  // Récupérer l'historique des commandes de l'utilisateur connecté
  static getUserOrders = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const orders = await OrderService.getUserOrders(userId);
      
      res.json(orders);
    } catch (error) {
      console.error('Error getting user orders:', error);
      res.status(500).json({ error: "Failed to get user orders" });
    }
  };

  // Récupérer une commande spécifique
  static getOrderById = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { orderId } = req.params;

      const order = await OrderService.getOrderById(orderId, userId);
      
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      res.json(order);
    } catch (error) {
      console.error('Error getting order by id:', error);
      res.status(500).json({ error: "Failed to get order" });
    }
  };

  // Récupérer toutes les commandes (admin seulement)
  static getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await OrderService.getAllOrders();
      
      res.json(orders);
    } catch (error) {
      console.error('Error getting all orders:', error);
      res.status(500).json({ error: "Failed to get all orders" });
    }
  };

  // Mettre à jour le statut d'une commande (admin seulement)
  static updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: "Status is required" });
        return;
      }

      const order = await OrderService.updateOrderStatus(orderId, status);
      
      res.json(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  };
} 