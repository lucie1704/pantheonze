import { Router } from "express";
import { CartController } from "@/controllers";
import { checkAuthentication } from "@/middlewares";

export default function (router: Router) {
  router.get(
    "/", 
    checkAuthentication,
    CartController.getCart
  );

  router.post(
    "/items", 
    checkAuthentication,
    CartController.addItemToCart
  );

  router.put(
    "/items/:itemId", 
    checkAuthentication,
    CartController.updateItemQuantity
  );

  router.delete(
    "/items/:itemId", 
    checkAuthentication,
    CartController.removeItemFromCart
  );

  router.delete(
    "/", 
    checkAuthentication,
    CartController.clearCart
  );

  router.get(
    "/total", 
    checkAuthentication,
    CartController.getCartTotal
  );

  return router;
}

