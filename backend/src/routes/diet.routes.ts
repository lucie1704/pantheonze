import { Router } from "express";
import { DietController } from "@/controllers";

export default function (router: Router) {
  // Collection endpoints
  router.get(
    "/diets",
    DietController.getAll
  );

  return router;
} 