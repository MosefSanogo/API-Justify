import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { rateLimitMiddleware } from "../middlewares/rateLimit.middleware.js";
import { justifyText } from "../services/justify.service.js";
const router = Router();

router.post("/justify", authMiddleware, rateLimitMiddleware, (req, res) => {
    const text = req.body;
    if(req.headers['content-type'] !== 'text/plain') {
        return res.status(400).json({ message: 'Content-Type must be text/plain' });
    }

    res.send(justifyText(text));
});

export default router;