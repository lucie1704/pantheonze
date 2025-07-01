import { Router } from "express";
import { CategoryController } from "@/controllers";

export default function (router: Router) {
  
  router.get(
    "/categories",
    CategoryController.getAll
  );

  return router;
}
