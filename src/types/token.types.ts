export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  balance?: number;
  isBlacklisted?: boolean;
  isPaused?: boolean;
}

export interface AllowanceInfo {
  owner: string;
  spender: string;
  amount: number;
}
