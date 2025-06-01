import { Prisma } from "@/prisma";
import { z } from "zod";
import { ContractSkeletonType } from "../ContractSkeleton";

type UpdatePastryContract = Prisma.PastryCreateInput;

export const UpdatePastryContract: ContractSkeletonType<UpdatePastryContract> = z.object({
    body: z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        price: z.number().min(0),
        imageUrl: z.string().optional(),
        category: z.string().min(1),
        ingredients: z.array(z.string()).optional(),
    }),
    query: z.object({}),
    params: z.object({}),
})

export type UpdatePastryContractType = typeof UpdatePastryContract;
