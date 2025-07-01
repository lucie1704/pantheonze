import { Router } from "express";
import { OrderController } from "@/controllers";
import { checkAuthentication, checkRole } from "@/middlewares";

export default function orderRoutes(router: Router) {  
  router.get(
    "/orders", 
    checkAuthentication, 
    OrderController.getUserOrders
  );
  
  router.get(
    "/orders/:orderId", 
    checkAuthentication, 
    OrderController.getOrderById
  );

  router.get(
    "/orders/admin/all", 
    checkAuthentication, 
    checkRole(['ADMIN', 'STOREKEEPER']), 
    OrderController.getAllOrders
  );

  router.put(
    "/orders/admin/:orderId/status", 
    checkAuthentication, 
    checkRole(['ADMIN', 'STOREKEEPER']), 
    OrderController.updateOrderStatus
  );

  return router;
} 