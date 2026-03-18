import { z } from "zod";

export const objectIdParamSchema = z.object({
  id: z
    .string({ required_error: "id is required." })
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid id format."),
});

export const createWarehouseBodySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  location: z.string().trim().min(2, "Location must be at least 2 characters."),
  stockLevel: z
    .number({ invalid_type_error: "stockLevel must be a number." })
    .min(0, "stockLevel must be greater than or equal to 0."),
});

export const updateWarehouseStockBodySchema = z.object({
  stockLevel: z
    .number({ invalid_type_error: "stockLevel must be a number." })
    .min(0, "stockLevel must be greater than or equal to 0."),
});
