import { Router } from "express";

const router = Router();

router.get("/api/shipments", (req, res) => {
    res.send("Hello World!");
})

export default router;