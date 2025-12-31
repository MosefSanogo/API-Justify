import { tokenStore } from "../storage/memory.store.js";
function rateLimitMiddleware(req, res, next) {
    const token = req.token;
    const tokenData = tokenStore.get(token);
    const today = new Date().toISOString().split('T')[0];
    if (today !== tokenData.lastDate) {
        tokenData.wordUsedToday = 0;
        tokenData.lastDate = today;
    }
    const text = req.body;
    const wordCount = text.trim().split(/\s+/).length;
    if (tokenData.wordUsedToday + wordCount > 80000) {
        return res.status(402).send("Payment Required");
    }
    tokenData.wordUsedToday += wordCount;
    next();
}
export { rateLimitMiddleware };
