import { Category, NFTGiftCard, SortOption } from "./types";

export const CATEGORIES: Category[] = [
  { id: "all", name: "All Categories" },
  { id: "gaming", name: "Gaming" },
  { id: "restaurants", name: "Restaurants" },
  { id: "travel", name: "Travel" },
  { id: "shopping", name: "Shopping" },
  { id: "entertainment", name: "Entertainment" },
  { id: "subscription", name: "Subscription" },
  { id: "services", name: "Services" },
];

export const SORT_OPTIONS: SortOption[] = [
  { id: "newest", name: "Newest" },
  { id: "price_low_high", name: "Price: Low to High" },
  { id: "price_high_low", name: "Price: High to Low" },
  { id: "most_popular", name: "Most Popular" },
];

export const GIFT_CARDS: NFTGiftCard[] = [
  {
    id: 1,
    title: "Steam Ultimate Gaming",
    description: "Premium gaming gift card with exclusive in-game items and credits.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    category: "gaming",
    price: {
      eth: 0.089,
      usd: 150.00
    },
    isVerified: true,
    isFeatured: false,
    contractAddress: "0x1a2b...3c4d",
    tokenId: "#15367",
    blockchain: "Ethereum",
    created: "April 12, 2023"
  },
  {
    id: 2,
    title: "Gourmet Dining Experience",
    description: "Exclusive dining voucher for premium restaurants worldwide.",
    image: "https://images.unsplash.com/photo-1574936145840-28808d77a0b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    category: "restaurants",
    price: {
      eth: 0.125,
      usd: 210.00
    },
    isVerified: true,
    isFeatured: false,
    contractAddress: "0x2b3c...4d5e",
    tokenId: "#16482",
    blockchain: "Ethereum",
    created: "April 28, 2023"
  },
  {
    id: 3,
    title: "Luxury Travel Experience",
    description: "First-class travel voucher with exclusive benefits and VIP services.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    category: "travel",
    price: {
      eth: 0.35,
      usd: 590.00
    },
    isVerified: true,
    isFeatured: true,
    contractAddress: "0x3c4d...5e6f",
    tokenId: "#18493",
    blockchain: "Ethereum",
    created: "May 15, 2023",
    rating: 5,
    reviews: 128,
    benefits: [
      "Round-trip business class flights to any destination worldwide",
      "5-night luxury hotel accommodation with premium amenities",
      "VIP airport transfers and priority check-in",
      "Exclusive access to executive lounges",
      "Personalized concierge service throughout your journey",
      "Valid for 24 months from purchase date"
    ],
    validFor: "24 months from purchase date"
  },
  {
    id: 4,
    title: "Designer Fashion Card",
    description: "Premium shopping card for designer brands and exclusive collections.",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    category: "shopping",
    price: {
      eth: 0.178,
      usd: 300.00
    },
    isVerified: true,
    isFeatured: false,
    contractAddress: "0x4d5e...6f7g",
    tokenId: "#21567",
    blockchain: "Ethereum",
    created: "June 3, 2023"
  },
  {
    id: 5,
    title: "Premium Streaming Bundle",
    description: "All-access pass to top streaming platforms and premium content.",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    category: "entertainment",
    price: {
      eth: 0.065,
      usd: 110.00
    },
    isVerified: true,
    isFeatured: false,
    contractAddress: "0x5e6f...7g8h",
    tokenId: "#23741",
    blockchain: "Ethereum",
    created: "June 18, 2023"
  },
  {
    id: 6,
    title: "Luxury Spa Retreat",
    description: "Premium spa package with exclusive treatments and wellness services.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    category: "services",
    price: {
      eth: 0.149,
      usd: 250.00
    },
    isVerified: true,
    isFeatured: false,
    contractAddress: "0x6f7g...8h9i",
    tokenId: "#24892",
    blockchain: "Ethereum",
    created: "July 5, 2023"
  },
  {
    id: 7,
    title: "Music Unlimited Pass",
    description: "Exclusive music subscription with VIP concert access and merchandise.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    category: "entertainment",
    price: {
      eth: 0.095,
      usd: 160.00
    },
    isVerified: true,
    isFeatured: true,
    contractAddress: "0x7g8h...9i0j",
    tokenId: "#26153",
    blockchain: "Ethereum",
    created: "July 22, 2023"
  },
  {
    id: 8,
    title: "Premium Learning Bundle",
    description: "Comprehensive education package with access to premium courses and certifications.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    category: "services",
    price: {
      eth: 0.117,
      usd: 195.00
    },
    isVerified: true,
    isFeatured: false,
    contractAddress: "0x8h9i...0j1k",
    tokenId: "#27489",
    blockchain: "Ethereum",
    created: "August 8, 2023"
  }
];

export const WALLET_PROVIDERS = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "https://www.svgrepo.com/show/331345/coinbase-v2.svg"
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "https://upload.wikimedia.org/wikipedia/commons/1/19/WalletConnect-logo.svg"
  }
];
