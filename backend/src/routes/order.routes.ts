import { Router } from "express";
import { OrderController } from "@/controllers";
import { checkAuthentication, checkRole } from "@/middlewares";

export default function (router: Router) {
  router.get(
    "/", 
    checkAuthentication, 
    OrderController.getUserOrders
  );
  
  router.get(
    "/:orderId", 
    checkAuthentication, 
    OrderController.getOrderById
  );

  router.get(
    "/admin/all", 
    checkAuthentication, 
    checkRole(['ADMIN', 'STOREKEEPER']), OrderController.getAllOrders
  );

  router.put(
    "/admin/:orderId/status", 
    checkAuthentication, 
    checkRole(['ADMIN', 'STOREKEEPER']), 
    OrderController.updateOrderStatus
  );

  return router;
} 
