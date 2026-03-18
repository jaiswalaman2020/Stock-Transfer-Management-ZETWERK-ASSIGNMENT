import { z } from "zod";
import { TRANSFER_STATUSES } from "../models/TransferRequest.ts";

export const transferIdParamSchema = z.object({
  id: z
    .string({ required_error: "id is required." })
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid id format."),
});

export const createTransferBodySchema = z
  .object({
    sourceWarehouse: z
      .string({ required_error: "sourceWarehouse is required." })
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid sourceWarehouse format."),
    destinationWarehouse: z
      .string({ required_error: "destinationWarehouse is required." })
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid destinationWarehouse format."),
    quantity: z
      .number({ invalid_type_error: "quantity must be a number." })
      .positive("quantity must be greater than 0."),
    note: z
      .string()
      .trim()
      .max(300, "note cannot exceed 300 characters.")
      .optional(),
  })
  .refine((value) => value.sourceWarehouse !== value.destinationWarehouse, {
    message: "Source and destination warehouses must be different.",
    path: ["destinationWarehouse"],
  });

export const updateTransferStatusBodySchema = z.object({
  status: z.enum(TRANSFER_STATUSES, {
    errorMap: () => ({
      message: `status must be one of: ${TRANSFER_STATUSES.join(", ")}`,
    }),
  }),
});
