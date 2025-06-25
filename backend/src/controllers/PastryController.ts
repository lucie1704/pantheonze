import { Request, Response } from "express";
import { prismaClient, categoryService, dietService } from "@/services";
import { ValidatedRequest } from "@/middlewares";
import { CreatePastryContractType } from "@/contracts/pastry";

export class PastryController {
    // Create a new pastry
    static createPastry = async (req: Request, res: Response) => {
        const validatedRequest = req as ValidatedRequest<CreatePastryContractType>;

        try {
            const pastry = validatedRequest.validated.body;
            await prismaClient.pastry.create({
                data: pastry
            });
            res.status(201).send();
        } catch (error) {
            res.status(500).json({ error: "Failed to create pastry" });
        }
    };

    // Get all pastries with optional category and diet filters
    static getAllPastries = async (req: Request, res: Response) => {
      try {
        const { query, categories, diets, minPrice, maxPrice, availability, order, sortBy } = req.query;

        const where: any = {};
        if (query) {
          where.name = { contains: String(query), mode: "insensitive" };
        }
        if (categories) {
          const categoryNames = String(categories).split(",");

          const categoryIds = categoryNames
            .map(name => categoryService.getCategoryIdByName(name.trim()))
            .filter(id => id !== undefined);

          if (categoryIds.length !== 0) {
            where.categoryId = { in: categoryIds };
          }
        }
        if (diets) {
          const dietNames = String(diets).split(",");

          const dietIds = dietNames
            .map(name => dietService.getDietIdByName(name.trim()))
            .filter(id => id !== undefined);

          if (dietIds.length !== 0) {
            where.dietId = { in: dietIds };
          }
        }
        if (minPrice || maxPrice) {
          where.price = {};
          if (minPrice) where.price.gte = Number(minPrice);
          if (maxPrice) where.price.lte = Number(maxPrice);
        }
        if (availability) {
          where.stockCount = { gt: 0 };
        }

        // Fonction helper pour trier par tag
        const sortByTag = async (tagName: string) => {
          const pastriesWithTag = await prismaClient.pastry.findMany({
            where: { ...where, tags: { has: tagName } },
            orderBy: { createdAt: "desc" }
          });

          const pastriesWithoutTag = await prismaClient.pastry.findMany({
            where: { ...where, NOT: { tags: { has: tagName } } },
            orderBy: { createdAt: "desc" }
          });

          return [...pastriesWithTag, ...pastriesWithoutTag];
        };

        let pastries;

        if (sortBy === "Populaire" || sortBy === "Nouveau") {
          pastries = await sortByTag(String(sortBy));
        } else {
          let orderBy: any = {};
          if (sortBy) {
            orderBy = { [String(sortBy)]: order === "desc" ? "desc" : "asc" };
          }

          pastries = await prismaClient.pastry.findMany({
            where,
            orderBy,
          });
        }

        res.json(pastries);
      } catch (error) {
          res.status(500).json(error);
      }
    };

    // Get a single pastry by ID
    static getPastryById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const pastry = await prismaClient.pastry.findUnique({
                where: { id }
            });

            if (!pastry) {
                res.status(404).json({ error: "Pastry not found" });
                return;
            }

            res.json(pastry);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch pastry" });
        }
    };

    // Update a pastry
    static updatePastry = async (req: Request, res: Response) => {
       /* try {
            const { id } = req.params;
            const { name, description, price, images, category, ingredients } = req.body;

            const pastry = await prismaClient.pastry.update({
                where: { id },
                data: {
                    name,
                    description,
                    price: Number(price),
                    images: Array.isArray(images) ? images : [],
                    category,
                    ingredients: Array.isArray(ingredients) ? ingredients : []
                }
            });

            res.status(200).send();
        } catch (error) {
            res.status(500).json({ error: "Failed to update pastry" });
        }*/
    };

    // Delete a pastry
    static deletePastry = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await prismaClient.pastry.delete({
                where: { id }
            });

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: "Failed to delete pastry" });
        }
    };
}
