import { Router } from "express";
import {
  createWarehouse,
  getWarehouses,
  updateWarehouseStock,
} from "../controllers/warehouseController.ts";
import { validateRequest } from "../middleware/validate.ts";
import {
  createWarehouseBodySchema,
  objectIdParamSchema,
  updateWarehouseStockBodySchema,
} from "../validation/warehouseSchemas.ts";

const router = Router();

router.get("/", getWarehouses);
router.post(
  "/",
  validateRequest({ body: createWarehouseBodySchema }),
  createWarehouse,
);
router.patch(
  "/:id/stock",
  validateRequest({
    params: objectIdParamSchema,
    body: updateWarehouseStockBodySchema,
  }),
  updateWarehouseStock,
);

export default router;
