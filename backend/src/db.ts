import mongoose from "mongoose";
import { config } from "./config.ts";

export async function connectDatabase() {
  await mongoose.connect(config.mongoUri);
}
