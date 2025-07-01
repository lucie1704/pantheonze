import { Request, Response } from "express";
import { prismaClient, categoryService, dietService } from "@/services";
import { ValidatedRequest } from "@/middlewares";
import { CreatePastryContractType, UpdatePastryContractType } from "@/contracts/pastry";

export class PastryController {
    // Create a new pastry
    static createPastry = async (req: Request, res: Response) => {
        const validatedRequest = req as ValidatedRequest<CreatePastryContractType>;

        try {
            const pastry = validatedRequest.validated.body;
            
            // Générer le slug
            const slug = pastry.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            
            // Vérifier si un produit avec le même slug existe déjà
            const existingPastry = await prismaClient.pastry.findUnique({
                where: { slug }
            });
            
            if (existingPastry) {
                return res.status(409).json({ 
                    error: "Un produit avec ce nom existe déjà. Veuillez choisir un nom différent." 
                });
            }
            
            let nutrition = undefined;
            if (pastry.nutrition) {
                nutrition = {
                    calories: pastry.nutrition.calories || 0,
                    protein: pastry.nutrition.protein || 0,
                    carbs: pastry.nutrition.carbs || 0,
                    fat: pastry.nutrition.fat || 0,
                    allergens: pastry.nutrition.allergens || []
                };
            }
            
            const pastryData = {
                ...pastry,
                slug,
                nutrition,
                inStock: true,
                isOnSale: false,
                totalReviews: 0,
                totalOrdered: 0
            };
            
            const createdPastry = await prismaClient.pastry.create({
                data: pastryData
            });
            
            res.status(201).json(createdPastry);
        } catch (error) {
            res.status(500).json({ error: "Failed to create pastry" });
        }
    };

    // Get all pastries with optional category and diet filters
    static getAllPastries = async (req: Request, res: Response) => {
      try {
        const { 
          query, 
          categories, 
          diets, 
          minPrice, 
          maxPrice, 
          availability, 
          order, 
          sortBy,
          page = 1,
          limit = 10,
          name,
          tags
        } = req.query;

        const pageNumber = parseInt(String(page));
        const limitNumber = parseInt(String(limit));
        const skip = (pageNumber - 1) * limitNumber;

        const where: any = {};
        
        // Filtre par nom (recherche globale)
        if (query) {
          where.name = { contains: String(query), mode: "insensitive" };
        }
        
        // Filtre spécifique par nom
        if (name) {
          where.name = { equals: String(name), mode: "insensitive" };
        }
        
        // Filtre par catégories
        if (categories) {
          const categoryNames = String(categories).split(",");
          const categoryIds = categoryNames
            .map(name => categoryService.getCategoryIdByName(name.trim()))
            .filter(id => id !== undefined);

          if (categoryIds.length !== 0) {
            where.categoryId = { in: categoryIds };
          }
        }
        
        // Filtre par régimes alimentaires
        if (diets) {
          const dietNames = String(diets).split(",");
          const dietIds = dietNames
            .map(name => dietService.getDietIdByName(name.trim()))
            .filter(id => id !== undefined);

          if (dietIds.length !== 0) {
            where.dietIds = { hasSome: dietIds };
          }
        }
        
        // Filtre par tags
        if (tags) {
          where.tags = { has: String(tags) };
        }
        
        // Filtre par prix
        if (minPrice || maxPrice) {
          where.price = {};
          if (minPrice) where.price.gte = Number(minPrice);
          if (maxPrice) where.price.lte = Number(maxPrice);
        }
        
        // Filtre par disponibilité
        if (availability) {
          where.stockCount = { gt: 0 };
        }

        // Compter le total pour la pagination
        const totalCount = await prismaClient.pastry.count({ where });

        // Fonction helper pour trier par tag
        const sortByTag = async (tagName: string) => {
          const pastriesWithTag = await prismaClient.pastry.findMany({
            where: { ...where, tags: { has: tagName } },
            orderBy: { createdAt: "desc" },
            include: {
              category: true
            },
            skip,
            take: limitNumber
          });

          const pastriesWithoutTag = await prismaClient.pastry.findMany({
            where: { ...where, NOT: { tags: { has: tagName } } },
            orderBy: { createdAt: "desc" },
            include: {
              category: true
            },
            skip: Math.max(0, skip - pastriesWithTag.length),
            take: limitNumber - pastriesWithTag.length
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
            include: {
              category: true
            },
            skip,
            take: limitNumber
          });

          // Enrichir avec les diets
          for (const pastry of pastries as any[]) {
            if (pastry.dietIds && pastry.dietIds.length > 0) {
              pastry.diets = await prismaClient.diet.findMany({
                where: { id: { in: pastry.dietIds } }
              });
            } else {
              pastry.diets = [];
            }
          }
        }

        // Retourner avec les métadonnées de pagination
        res.json({
          data: pastries,
          pagination: {
            page: pageNumber,
            limit: limitNumber,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
            hasNext: pageNumber < Math.ceil(totalCount / limitNumber),
            hasPrev: pageNumber > 1
          }
        });
      } catch (error) {
          res.status(500).json(error);
      }
    };

    // Get popular pastries only
    static getPopularPastries = async (req: Request, res: Response) => {
        try {
            const { limit } = req.query;
            const limitNumber = limit ? parseInt(String(limit)) : 6;

            const popularPastries = await prismaClient.pastry.findMany({
                where: {
                    tags: { has: "Populaire" }
                },
                orderBy: { createdAt: "desc" },
                include: {
                    category: true
                },
                take: limitNumber
            });

            // Enrichir avec les diets
            for (const pastry of popularPastries as any[]) {
                if (pastry.dietIds && pastry.dietIds.length > 0) {
                    pastry.diets = await prismaClient.diet.findMany({
                        where: { id: { in: pastry.dietIds } }
                    });
                } else {
                    pastry.diets = [];
                }
            }

            res.json(popularPastries);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch popular pastries" });
        }
    };

    // Get a single pastry by ID
    static getPastryById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const pastry = await prismaClient.pastry.findUnique({
                where: { id },
                include: {
                    category: true
                }
            });

            if (!pastry) {
                res.status(404).json({ error: "Pastry not found" });
                return;
            }

            // Enrichir avec les diets
            if ((pastry as any).dietIds && (pastry as any).dietIds.length > 0) {
                (pastry as any).diets = await prismaClient.diet.findMany({
                    where: { id: { in: (pastry as any).dietIds } }
                });
            } else {
                (pastry as any).diets = [];
            }

            res.json(pastry);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch pastry" });
        }
    };

    // Get a single pastry by slug
    static getPastryBySlug = async (req: Request, res: Response) => {
        try {
            const { slug } = req.params;
            const pastry = await prismaClient.pastry.findUnique({
                where: { slug },
                include: {
                    category: true
                }
            });

            if (!pastry) {
                res.status(404).json({ error: "Pastry not found" });
                return;
            }

            // Enrichir avec les diets
            if ((pastry as any).dietIds && (pastry as any).dietIds.length > 0) {
                (pastry as any).diets = await prismaClient.diet.findMany({
                    where: { id: { in: (pastry as any).dietIds } }
                });
            } else {
                (pastry as any).diets = [];
            }

            res.json(pastry);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch pastry" });
        }
    };

    // Update a pastry
    static updatePastry = async (req: Request, res: Response) => {
        const validatedRequest = req as ValidatedRequest<UpdatePastryContractType>;

        try {
            const { id } = req.params;
            const pastryData = validatedRequest.validated.body;

            // Si le nom change, vérifier l'unicité et régénérer le slug
            if (pastryData.name && typeof pastryData.name === 'string') {
                // Générer le nouveau slug
                const slug = pastryData.name
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
                
                // Vérifier si un autre produit avec le même slug existe déjà
                const existingPastry = await prismaClient.pastry.findFirst({
                    where: { 
                        slug,
                        id: { not: id } // Exclure le pastry actuel
                    }
                });
                
                if (existingPastry) {
                    return res.status(409).json({ 
                        error: "Un produit avec ce nom existe déjà. Veuillez choisir un nom différent." 
                    });
                }
                
                pastryData.slug = slug;
            }

            const pastry = await prismaClient.pastry.update({
                where: { id },
                data: pastryData
            });

            res.json(pastry);
        } catch (error) {
            res.status(500).json({ error: "Failed to update pastry" });
        }
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
