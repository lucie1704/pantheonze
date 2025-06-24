import { Router } from "express";
import { CategoryController } from "@/controllers";

export default function (router: Router) {
  // Collection endpoints
  router.get(
    "/categories",
    CategoryController.getAll
  );

  return router;
}
