import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { rateLimitMiddleware } from "../middlewares/rateLimit.middleware";
import { justifyText } from "../services/justify.service";
const router = Router();

router.post("/justify", authMiddleware, rateLimitMiddleware, (req, res) => {
    const text = req.body;
    if(req.headers['content-type'] !== 'text/plain') {
        return res.status(400).json({ message: 'Content-Type must be text/plain' });
    }

    res.send(justifyText(text));
});

export default router;