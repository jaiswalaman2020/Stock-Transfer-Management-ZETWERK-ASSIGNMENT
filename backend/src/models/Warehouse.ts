import mongoose from "mongoose";

export interface IWarehouse {
  name: string;
  location: string;
  stockLevel: number;
}

const warehouseSchema = new mongoose.Schema<IWarehouse>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    stockLevel: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true },
);

warehouseSchema.index({ name: 1, location: 1 }, { unique: true });

export const Warehouse = mongoose.model<IWarehouse>(
  "Warehouse",
  warehouseSchema,
);
