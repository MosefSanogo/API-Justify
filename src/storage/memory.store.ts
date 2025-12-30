export interface TokenData {
  email: string;
  wordUsedToday: number;
  lastDate: string;
}

export const tokenStore: Map<string, TokenData> = new Map();