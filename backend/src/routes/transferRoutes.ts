import { Router } from "express";
import {
  createTransfer,
  getTransfers,
  updateTransferStatus,
} from "../controllers/transferController.ts";
import { validateRequest } from "../middleware/validate.ts";
import {
  createTransferBodySchema,
  transferIdParamSchema,
  updateTransferStatusBodySchema,
} from "../validation/transferSchemas.ts";

const router = Router();

router.get("/", getTransfers);
router.post(
  "/",
  validateRequest({ body: createTransferBodySchema }),
  createTransfer,
);
router.patch(
  "/:id/status",
  validateRequest({
    params: transferIdParamSchema,
    body: updateTransferStatusBodySchema,
  }),
  updateTransferStatus,
);

export default router;
