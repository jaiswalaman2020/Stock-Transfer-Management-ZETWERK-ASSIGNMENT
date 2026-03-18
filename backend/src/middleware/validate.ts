import type { NextFunction, Request, Response } from "express";
import type { z, ZodTypeAny } from "zod";
import { createHttpError } from "../utils/httpError.ts";

type RequestSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export function validateRequest(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parseSchema = <T extends ZodTypeAny>(schema: T, data: unknown) => {
      const result = schema.safeParse(data);
      if (!result.success) {
        const firstIssue = result.error.issues[0];
        throw createHttpError(
          400,
          firstIssue?.message || "Invalid request data.",
        );
      }
      return result.data as z.infer<T>;
    };

    try {
      if (schemas.params) {
        parseSchema(schemas.params, req.params);
      }

      if (schemas.query) {
        parseSchema(schemas.query, req.query);
      }

      if (schemas.body) {
        req.body = parseSchema(schemas.body, req.body);
      }

      next();
    } catch (error) {
      next(error as Error);
    }
  };
}
