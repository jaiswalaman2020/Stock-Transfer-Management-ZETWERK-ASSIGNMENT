import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Warehouse } from "../models/Warehouse.ts";
import { createHttpError } from "../utils/httpError.ts";

export async function getWarehouses(_req: Request, res: Response) {
  const warehouses = await Warehouse.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    data: warehouses,
  });
}

export async function createWarehouse(
  req: Request,
  res: Response,
  next: (error?: Error) => void,
) {
  try {
    const { name, location, stockLevel } = req.body as {
      name?: string;
      location?: string;
      stockLevel?: number;
    };

    if (!name?.trim() || !location?.trim()) {
      throw createHttpError(400, "Name and location are required.");
    }

    if (stockLevel === undefined || stockLevel < 0) {
      throw createHttpError(
        400,
        "stockLevel must be a number greater than or equal to 0.",
      );
    }

    const warehouse = await Warehouse.create({
      name: name.trim(),
      location: location.trim(),
      stockLevel,
    });

    res.status(201).json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    const mongoError = error as { code?: number };

    if (mongoError.code === 11000) {
      next(
        createHttpError(
          409,
          "Warehouse with this name and location already exists.",
        ),
      );
      return;
    }

    next(error as Error);
  }
}

export async function updateWarehouseStock(
  req: Request,
  res: Response,
  next: (error?: Error) => void,
) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { stockLevel } = req.body as { stockLevel?: number };

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, "Invalid warehouse id.");
    }

    if (stockLevel === undefined || stockLevel < 0) {
      throw createHttpError(
        400,
        "stockLevel must be a number greater than or equal to 0.",
      );
    }

    const warehouse = await Warehouse.findByIdAndUpdate(
      id,
      { stockLevel },
      { new: true, runValidators: true },
    );

    if (!warehouse) {
      throw createHttpError(404, "Warehouse not found.");
    }

    res.json({ success: true, data: warehouse });
  } catch (error) {
    next(error as Error);
  }
}
