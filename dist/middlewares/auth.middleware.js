import { tokenStore } from "../storage/memory.store.js";
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    if (!tokenStore.has(token)) {
        return res.status(401).send({ message: 'Invalid token' });
    }
    req.token = token;
    next();
}
export { authMiddleware };
