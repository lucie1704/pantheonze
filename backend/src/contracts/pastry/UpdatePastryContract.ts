import { Prisma } from "@/prisma";
import { z } from "zod";
import { ContractSkeletonType } from "../ContractSkeleton";

type UpdatePastryContract = Prisma.PastryUpdateInput;

export const UpdatePastryContract: ContractSkeletonType<UpdatePastryContract> = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        description: z.string().min(1).max(300, "La description ne peut pas dépasser 300 caractères").optional(),
        price: z.number().min(0).optional(),
        images: z.array(z.string()).optional(),
        categoryId: z.string().min(1).optional(),
        dietIds: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        ingredients: z.array(z.string()).optional(),
        nutrition: z.object({
            calories: z.number().min(0),
            protein: z.number().min(0),
            carbs: z.number().min(0),
            fat: z.number().min(0),
            allergens: z.array(z.string())
        }).optional(),
        stockCount: z.number().min(0).optional(),
        inStock: z.boolean().optional(),
        isOnSale: z.boolean().optional(),
    }),
    query: z.object({}),
    params: z.object({}),
})

export type UpdatePastryContractType = typeof UpdatePastryContract;
