import { Router } from "express";
import userRouter from "./users.mjs";
import shipmentRouter from "./shipments.mjs";

const router = Router();

router.use(userRouter);
router.use(shipmentRouter);

export default router;
