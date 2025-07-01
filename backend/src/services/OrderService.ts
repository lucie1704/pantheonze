import { prismaClient } from "./PrismaService";

// Fonction pour valider un ObjectID MongoDB
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export class OrderService {
  static async getUserOrders(userId: string) {
    try {
      const orders = await prismaClient.order.findMany({
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return orders;
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }

  static async getOrderById(orderId: string, userId: string) {
    try {
      // Valider que l'orderId est un ObjectID MongoDB valide
      if (!isValidObjectId(orderId)) {
        throw new Error(`Invalid order ID format: ${orderId}`);
      }

      const order = await prismaClient.order.findFirst({
        where: { 
          id: orderId,
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

      return order;
    } catch (error) {
      console.error('Error getting order by id:', error);
      throw error;
    }
  }

  static async getAllOrders() {
    try {
      const orders = await prismaClient.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              pastry: {
                include: {
                  category: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return orders;
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId: string, status: string) {
    try {
      // Valider que l'orderId est un ObjectID MongoDB valide
      if (!isValidObjectId(orderId)) {
        throw new Error(`Invalid order ID format: ${orderId}`);
      }

      const order = await prismaClient.order.update({
        where: { id: orderId },
        data: { 
          status: status as any,
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              pastry: true
            }
          }
        }
      });

      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
} 