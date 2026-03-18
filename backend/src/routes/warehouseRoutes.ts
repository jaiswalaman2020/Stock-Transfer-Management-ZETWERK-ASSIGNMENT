import { Router } from "express";
import {
  createWarehouse,
  getWarehouses,
  updateWarehouseStock,
} from "../controllers/warehouseController.ts";

const router = Router();

router.get("/", getWarehouses);
router.post("/", createWarehouse);
router.patch("/:id/stock", updateWarehouseStock);

export default router;
