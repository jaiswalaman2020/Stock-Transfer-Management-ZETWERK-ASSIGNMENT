import cors, { type CorsOptions } from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import type { NextFunction, Request, Response } from "express";
import { config } from "../config.ts";

function sanitizeObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) {
        continue;
      }

      result[key] = sanitizeObject(nestedValue);
    }

    return result;
  }

  return value;
}

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (config.frontendOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS: Origin not allowed"));
  },
};

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
});

export function sanitizeRequest(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.body = sanitizeObject(req.body);
  next();
}

export const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
});
