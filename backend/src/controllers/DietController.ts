import { Request, Response } from "express";
import { dietService } from "@/services";

export class DietController {
  static async getAll(req: Request, res: Response) {
    await dietService.init();

    const diets: { id: string; name: string }[] = [];
    for (const [key, value] of dietService.cache.entries()) {
      if (typeof key === "string" && typeof value === "string") {
        diets.push({ id: value, name: key });
      }
    }

    res.json(diets);
  }
} 