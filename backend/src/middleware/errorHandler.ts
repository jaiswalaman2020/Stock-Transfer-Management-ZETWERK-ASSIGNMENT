import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  const error = new Error("Route not found") as Error & { statusCode?: number };
  error.statusCode = 404;
  next(error);
}

export function errorHandler(
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = Number.isInteger(err.statusCode)
    ? Number(err.statusCode)
    : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
}
