import { Router } from "express";
import { generateToken } from "../services/token.service.js";
const router = Router();
router.post("/token", (req, res) => {
    const email = req.body;
    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }
    const token = generateToken(email);
    res.status(200).json({ token });
});
export default router;
