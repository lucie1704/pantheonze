import { Router } from "express";
import { PastryController } from "@/controllers";
import { validateContract } from "@/middlewares";
import {
  CreatePastryContract,
  UpdatePastryContract,
} from "@/contracts/pastry";

export default function (router: Router) {
  router.get(
    "/pastries",
    PastryController.getAllPastries
  );

  router.get(
    "/pastries/popular",
    PastryController.getPopularPastries
  );
  
  router.post(
    "/pastries",
    validateContract(CreatePastryContract),
    PastryController.createPastry
  );

  router.get(
    "/pastries/:id",
    PastryController.getPastryById
  );

  router.get(
    "/pastries/slug/:slug",
    PastryController.getPastryBySlug
  );

  router.put(
    "/pastries/:id",
    validateContract(UpdatePastryContract),
    PastryController.updatePastry
  );

  router.delete(
    "/pastries/:id",
    PastryController.deletePastry
  );

  return router;
} 