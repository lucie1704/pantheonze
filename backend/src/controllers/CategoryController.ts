import { Request, Response } from "express";
import { categoryService } from "@/services";

export class CategoryController {
  static async getAll(req: Request, res: Response) {
    await categoryService.init();

    const categories: { id: string; name: string }[] = [];
    for (const [key, value] of categoryService.cache.entries()) {
      if (typeof key === "string" && typeof value === "string") {
        categories.push({ id: value, name: key });
      }
    }

    res.json(categories);
  }
}
