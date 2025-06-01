import { Router } from "express";
import { PastryController } from "@/controllers";
import { validateContract } from "@/middlewares";
import {
  CreatePastryContract,
  UpdatePastryContract,
} from "@/contracts/pastry";

export default function (router: Router) {
  // Collection endpoints
  router.get(
    "/pastries",
    PastryController.getAllPastries
  );
  
  router.post(
    "/pastries",
    validateContract(CreatePastryContract),
    PastryController.createPastry
  );

  // Single resource endpoints
  router.get(
    "/pastries/:id",
    PastryController.getPastryById
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