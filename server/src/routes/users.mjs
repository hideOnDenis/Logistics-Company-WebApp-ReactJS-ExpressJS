import { Router } from "express";

const router = Router();

router.get("/api/users", (req, res) => {
    res.send("Hello World!");
})

export default router;