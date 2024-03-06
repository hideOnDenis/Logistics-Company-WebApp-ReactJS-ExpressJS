import { Router } from "express";
import userRouter from "./users.mjs";
import shipmentRouter from "./shipments.mjs";
import companyRouter from "./companies.mjs";
import officeRouter from "./offices.mjs";

const router = Router();

router.use(userRouter);
router.use(shipmentRouter);
router.use(companyRouter);
router.use(officeRouter);

export default router;
