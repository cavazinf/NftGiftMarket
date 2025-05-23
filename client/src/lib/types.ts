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
}

export interface Category {
  id: string;
  name: string;
}

export interface SortOption {
  id: string;
  name: string;
}
