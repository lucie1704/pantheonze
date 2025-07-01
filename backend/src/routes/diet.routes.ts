import { Router } from "express";
import { DietController } from "@/controllers";

export default function (router: Router) {

  router.get(
    "/diets",
    DietController.getAll
  );

  return router;
} 