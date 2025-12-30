import { tokenStore } from "../storage/memory.store";
import { Request, Response, NextFunction } from "express";

function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = (req as any).token;
  const tokenData = tokenStore.get(token);

  const today = new Date().toISOString().split('T')[0];
    if(today !== tokenData!.lastDate) {
      tokenData!.wordUsedToday = 0;
      tokenData!.lastDate = today;
    }

    const text = req.body as string;
    const wordCount = text.trim().split(/\s+/).length;
    if (tokenData!.wordUsedToday + wordCount > 80000) {
        return res.status(402).send("Payment Required");
    }
    tokenData!.wordUsedToday += wordCount;
    next();
}

export { rateLimitMiddleware };