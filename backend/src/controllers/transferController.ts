import type { Request, Response } from "express";
import mongoose from "mongoose";
import {
  TransferRequest,
  TRANSFER_STATUSES,
  type TransferStatus,
} from "../models/TransferRequest.ts";
import { Warehouse } from "../models/Warehouse.ts";
import { createHttpError } from "../utils/httpError.ts";

const allowedTransitions: Record<TransferStatus, TransferStatus[]> = {
  pending: ["approved"],
  approved: [],
};

function isTransferStatus(value: string): value is TransferStatus {
  return TRANSFER_STATUSES.includes(value as TransferStatus);
}

async function applyStockMovementOnCompletion(
  sourceWarehouseId: mongoose.Types.ObjectId,
  destinationWarehouseId: mongoose.Types.ObjectId,
  quantity: number,
) {
  const deducted = await Warehouse.findOneAndUpdate(
    {
      _id: sourceWarehouseId,
      stockLevel: { $gte: quantity },
    },
    {
      $inc: { stockLevel: -quantity },
    },
    { new: true },
  );

  if (!deducted) {
    throw createHttpError(
      400,
      "Insufficient stock in source warehouse to approve transfer.",
    );
  }

  try {
    await Warehouse.findByIdAndUpdate(destinationWarehouseId, {
      $inc: { stockLevel: quantity },
    });
  } catch (error) {
    await Warehouse.findByIdAndUpdate(sourceWarehouseId, {
      $inc: { stockLevel: quantity },
    });

    throw error;
  }
}

export async function getTransfers(_req: Request, res: Response) {
  const transfers = await TransferRequest.find()
    .populate("sourceWarehouse", "name location stockLevel")
    .populate("destinationWarehouse", "name location stockLevel")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: transfers });
}

export async function createTransfer(
  req: Request,
  res: Response,
  next: (error?: Error) => void,
) {
  try {
    const { sourceWarehouse, destinationWarehouse, quantity, note } =
      req.body as {
        sourceWarehouse?: string;
        destinationWarehouse?: string;
        quantity?: number;
        note?: string;
      };

    if (
      !sourceWarehouse ||
      !destinationWarehouse ||
      !mongoose.Types.ObjectId.isValid(sourceWarehouse) ||
      !mongoose.Types.ObjectId.isValid(destinationWarehouse)
    ) {
      throw createHttpError(
        400,
        "Valid sourceWarehouse and destinationWarehouse are required.",
      );
    }

    if (sourceWarehouse === destinationWarehouse) {
      throw createHttpError(
        400,
        "Source and destination warehouses must be different.",
      );
    }

    if (quantity === undefined || quantity <= 0) {
      throw createHttpError(400, "quantity must be greater than 0.");
    }

    const [source, destination] = await Promise.all([
      Warehouse.findById(sourceWarehouse),
      Warehouse.findById(destinationWarehouse),
    ]);

    if (!source || !destination) {
      throw createHttpError(404, "Source or destination warehouse not found.");
    }

    const transfer = await TransferRequest.create({
      sourceWarehouse,
      destinationWarehouse,
      quantity,
      note: note?.trim() || "",
      status: "pending",
    });

    const populated = await TransferRequest.findById(transfer._id)
      .populate("sourceWarehouse", "name location stockLevel")
      .populate("destinationWarehouse", "name location stockLevel");

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error as Error);
  }
}

export async function updateTransferStatus(
  req: Request,
  res: Response,
  next: (error?: Error) => void,
) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body as { status?: string };

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, "Invalid transfer id.");
    }

    if (!status || !isTransferStatus(status)) {
      throw createHttpError(
        400,
        `status must be one of: ${TRANSFER_STATUSES.join(", ")}`,
      );
    }

    const transfer = await TransferRequest.findById(id);

    if (!transfer) {
      throw createHttpError(404, "Transfer request not found.");
    }

    const currentStatus = transfer.status;

    if (currentStatus === status) {
      const sameTransfer = await TransferRequest.findById(id)
        .populate("sourceWarehouse", "name location stockLevel")
        .populate("destinationWarehouse", "name location stockLevel");

      res.json({ success: true, data: sameTransfer });
      return;
    }

    if (!allowedTransitions[currentStatus].includes(status)) {
      throw createHttpError(
        400,
        `Invalid status transition from ${currentStatus} to ${status}.`,
      );
    }

    let stockAdjustedOnApproval = false;

    if (status === "approved") {
      await applyStockMovementOnCompletion(
        transfer.sourceWarehouse,
        transfer.destinationWarehouse,
        transfer.quantity,
      );
      stockAdjustedOnApproval = true;
    }

    transfer.status = status;

    try {
      await transfer.save();
    } catch (error) {
      if (stockAdjustedOnApproval) {
        await Warehouse.findByIdAndUpdate(transfer.sourceWarehouse, {
          $inc: { stockLevel: transfer.quantity },
        });
        await Warehouse.findByIdAndUpdate(transfer.destinationWarehouse, {
          $inc: { stockLevel: -transfer.quantity },
        });
      }

      throw error;
    }

    const updatedTransfer = await TransferRequest.findById(id)
      .populate("sourceWarehouse", "name location stockLevel")
      .populate("destinationWarehouse", "name location stockLevel");

    res.json({ success: true, data: updatedTransfer });
  } catch (error) {
    next(error as Error);
  }
}
