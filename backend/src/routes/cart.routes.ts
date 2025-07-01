import { Router } from "express";
import { CartController } from "@/controllers";
import { checkAuthentication } from "@/middlewares";

export default function (router: Router) {
  router.get(
    "/cart", 
    checkAuthentication,
    CartController.getCart
  );

  router.post(
    "/cart/items", 
    checkAuthentication,
    CartController.addItemToCart
  );

  router.put(
    "/cart/items/:itemId", 
    checkAuthentication,
    CartController.updateItemQuantity
  );

  router.delete(
    "/cart/items/:itemId", 
    checkAuthentication,
    CartController.removeItemFromCart
  );

  router.delete(
    "/cart", 
    checkAuthentication,
    CartController.clearCart
  );

  router.get(
    "/cart/total", 
    checkAuthentication,
    CartController.getCartTotal
  );

  return router;
}

