import { Prisma } from "@/prisma";
import { z } from "zod";
import { ContractSkeletonType } from "../ContractSkeleton";

type CreatePastryContract = Prisma.PastryCreateInput;

export const CreatePastryContract: ContractSkeletonType<CreatePastryContract> = z.object({
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

        imageUrl: z.string({
            invalid_type_error: "L'URL doit être une chaîne de caractères"
        }).url("L'URL de l'image n'est pas valide").optional(),

        category: z.string({
            required_error: "La catégorie est requise",
            invalid_type_error: "La catégorie doit être une chaîne de caractères"
        }).min(1, "La catégorie ne peut pas être vide"),

        ingredients: z.array(
            z.string({
                invalid_type_error: "Les ingrédients doivent être des chaînes de caractères"
            }).min(1, "Un ingrédient ne peut pas être vide")
        ).min(1, "Au moins un ingrédient est requis").optional(),
    }),
    query: z.object({}),
    params: z.object({}),
});

export type CreatePastryContractType = typeof CreatePastryContract; 