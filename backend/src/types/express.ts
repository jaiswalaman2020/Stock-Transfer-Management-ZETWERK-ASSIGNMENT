import type { RequestHandler } from "express";

export type AsyncRequestHandler = RequestHandler<
  Record<string, string>,
  unknown,
  Record<string, unknown>,
  Record<string, string | undefined>
>;
