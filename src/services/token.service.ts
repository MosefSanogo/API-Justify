import { TokenData, tokenStore } from "../storage/memory.store";

export function generateToken(email: string): string {
  const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2); // methode token generation
  const tokenData: TokenData = {
    email,
    wordUsedToday: 0,
    lastDate: new Date().toISOString().split('T')[0],
  };
  tokenStore.set(token, tokenData);
  return token;
}