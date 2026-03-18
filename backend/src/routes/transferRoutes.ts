import { Router } from "express";
import {
  createTransfer,
  getTransfers,
  updateTransferStatus,
} from "../controllers/transferController.ts";

const router = Router();

router.get("/", getTransfers);
router.post("/", createTransfer);
router.patch("/:id/status", updateTransferStatus);

export default router;
