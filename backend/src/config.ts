import dotenv from "dotenv";

dotenv.config();

const defaultOrigins = ["http://localhost:5173"];

function parseAllowedOrigins(rawOrigins?: string) {
  if (!rawOrigins?.trim()) {
    return defaultOrigins;
  }

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const config = {
  port: Number(process.env.PORT || 5000),
  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/stock_transfer_management",
  frontendOrigins: parseAllowedOrigins(process.env.FRONTEND_ORIGIN),
  jsonBodyLimit: process.env.JSON_BODY_LIMIT || "100kb",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 200),
};
