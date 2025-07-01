import { Prisma } from "@/prisma";
import { z } from "zod";
import { ContractSkeletonType } from "../ContractSkeleton";

// Define the contract input type to match our schema
type CreatePastryContractInput = {
    name: string;
    description: string;
    price: number;
    stockCount?: number;
    categoryId: string;
    tags?: string[];
    ingredients: string[];
    nutrition?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        allergens: string[];
    };
    dietIds?: string[];
    images?: string[];
};

export const CreatePastryContract: ContractSkeletonType<CreatePastryContractInput> = z.object({
    body: z.object({
        name: z.string({
            required_error: "Le nom de la pâtisserie est requis",
            invalid_type_error: "Le nom doit être une chaîne de caractères"
        }).min(2, "Le nom doit contenir au moins 2 caractères"),

        description: z.string({
            required_error: "La description est requise",
            invalid_type_error: "La description doit être une chaîne de caractères"
        }).min(10, "La description doit contenir au moins 10 caractères"),

        price: z.number({
            required_error: "Le prix est requis",
            invalid_type_error: "Le prix doit être un nombre"
        }).min(0, "Le prix ne peut pas être négatif")
          .max(1000, "Le prix ne peut pas dépasser 1000€"),

        stockCount: z.number().min(0, "Le stock ne peut pas être négatif").optional(),

        categoryId: z.string({
            required_error: "La catégorie est requise",
            invalid_type_error: "La catégorie doit être une chaîne de caractères"
        }).min(1, "La catégorie ne peut pas être vide"),

        tags: z.array(z.string()).optional(),

        ingredients: z.array(
            z.string({
                invalid_type_error: "Les ingrédients doivent être des chaînes de caractères"
            }).min(1, "Un ingrédient ne peut pas être vide")
        ).min(1, "Au moins un ingrédient est requis"),

        nutrition: z.object({
            calories: z.number().min(0),
            protein: z.number().min(0),
            carbs: z.number().min(0),
            fat: z.number().min(0),
            allergens: z.array(z.string())
        }).optional(),

        dietIds: z.array(z.string()).optional(),

        images: z.array(z.string()).optional(),
    }),
    query: z.object({}),
    params: z.object({}),
});

export type CreatePastryContractType = typeof CreatePastryContract; 