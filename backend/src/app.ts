import cors from "cors";
import express from "express";
import morgan from "morgan";
import { config } from "./config.ts";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.ts";
import {
  apiRateLimiter,
  corsOptions,
  sanitizeRequest,
  securityHeaders,
} from "./middleware/security.ts";
import transferRoutes from "./routes/transferRoutes.ts";
import warehouseRoutes from "./routes/warehouseRoutes.ts";

export const app = express();

app.disable("x-powered-by");
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: config.jsonBodyLimit }));
app.use(sanitizeRequest);
app.use("/api", apiRateLimiter);
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

app.use("/api/warehouses", warehouseRoutes);
app.use("/api/transfers", transferRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
