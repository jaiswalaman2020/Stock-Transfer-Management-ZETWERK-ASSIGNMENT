import mongoose from "mongoose";

export const TRANSFER_STATUSES = ["pending", "approved"] as const;

export type TransferStatus = (typeof TRANSFER_STATUSES)[number];

export interface ITransferRequest {
  sourceWarehouse: mongoose.Types.ObjectId;
  destinationWarehouse: mongoose.Types.ObjectId;
  quantity: number;
  status: TransferStatus;
  note: string;
}

const transferRequestSchema = new mongoose.Schema<ITransferRequest>(
  {
    sourceWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    destinationWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: TRANSFER_STATUSES,
      default: "pending",
      index: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  { timestamps: true },
);

transferRequestSchema.pre("validate", function validateTransfer(next) {
  if (
    this.sourceWarehouse &&
    this.destinationWarehouse &&
    this.sourceWarehouse.toString() === this.destinationWarehouse.toString()
  ) {
    next(new Error("Source and destination warehouses must be different."));
    return;
  }

  next();
});

export const TransferRequest = mongoose.model<ITransferRequest>(
  "TransferRequest",
  transferRequestSchema,
);
