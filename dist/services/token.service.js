import { tokenStore } from "../storage/memory.store.js";
export function generateToken(email) {
    const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2); // methode token generation
    const tokenData = {
        email,
        wordUsedToday: 0,
        lastDate: new Date().toISOString().split('T')[0],
    };
    tokenStore.set(token, tokenData);
    return token;
}
