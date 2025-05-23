export interface NFTGiftCard {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  price: {
    eth: number;
    usd: number;
  };
  isVerified: boolean;
  isFeatured: boolean;
  contractAddress?: string;
  tokenId?: string;
  blockchain?: string;
  created?: string;
  rating?: number;
  reviews?: number;
  benefits?: string[];
  validFor?: string;
  isRechargeable?: boolean;
  hasZkPrivacy?: boolean;
  balance?: {
    eth: number;
    usd: number;
  };
  merchant?: {
    name: string;
    logo?: string;
    verified: boolean;
  };
  totalRecharges?: number;
  standard?: string; // Ex: "ERC-721", "ERC-6551"
  lastUsed?: string;
  expirationDate?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface SortOption {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  type: "purchase" | "recharge" | "redeem";
  amount: {
    eth: number;
    usd: number;
  };
  date: string;
  giftCardId: number;
  status: "pending" | "completed" | "failed";
  txHash?: string;
  merchant?: string;
}

export interface ZkProof {
  id: string;
  proofType: "balance" | "ownership";
  giftCardId: number;
  createdAt: string;
  verified: boolean;
  hash: string;
}

export interface MerchantInfo {
  id: number;
  name: string;
  logo: string;
  isVerified: boolean;
  joinDate: string;
  categories: string[];
  totalGiftCards: number;
  acceptsStablecoins: boolean[];
  supportedChains: string[];
}
