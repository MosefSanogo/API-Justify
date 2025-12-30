import { Router } from "express";
import { generateToken } from "../services/token.service.js";

const router = Router();

router.get("/token", (req, res) => {
  const email = req.body;
  if(!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const token = generateToken(email);
  res.json({ token });
});
export default router;