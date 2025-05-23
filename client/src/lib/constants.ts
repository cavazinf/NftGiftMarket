import { Category, NFTGiftCard, SortOption, Transaction, MerchantInfo } from "./types";

export const CATEGORIES: Category[] = [
  { id: "all", name: "All Categories" },
  { id: "gaming", name: "Gaming" },
  { id: "restaurants", name: "Restaurants" },
  { id: "travel", name: "Travel" },
  { id: "shopping", name: "Shopping" },
  { id: "entertainment", name: "Entertainment" },
  { id: "subscription", name: "Subscription" },
  { id: "services", name: "Services" },
  { id: "defi", name: "DeFi" },
  { id: "nft", name: "NFT Collectibles" },
];

export const SORT_OPTIONS: SortOption[] = [
  { id: "newest", name: "Newest" },
  { id: "price_low_high", name: "Price: Low to High" },
  { id: "price_high_low", name: "Price: High to Low" },
  { id: "most_popular", name: "Most Popular" },
  { id: "rechargeable", name: "Rechargeable Cards" },
  { id: "privacy", name: "Privacy Enhanced" },
];

export const BLOCKCHAINS = [
  { id: "ethereum", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg" },
  { id: "polygon", name: "Polygon", icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg" },
  { id: "base", name: "Base", icon: "https://cryptologos.cc/logos/base-logo.svg" },
  { id: "stellar", name: "Stellar", icon: "https://cryptologos.cc/logos/stellar-xlm-logo.svg" },
];

export const NFT_STANDARDS = [
  { id: "erc721", name: "ERC-721" },
  { id: "erc6551", name: "ERC-6551 (Smart NFT)" },
  { id: "erc1155", name: "ERC-1155" },
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
    created: "April 12, 2023",
    isRechargeable: true,
    hasZkPrivacy: false,
    standard: "ERC-721",
    merchant: {
      name: "Steam",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png",
      verified: true
    },
    balance: {
      eth: 0.089,
      usd: 150.00
    },
    expirationDate: "April 12, 2025"
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
    blockchain: "Polygon",
    created: "April 28, 2023",
    isRechargeable: true,
    hasZkPrivacy: true,
    standard: "ERC-6551",
    merchant: {
      name: "Fine Dining Group",
      logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
      verified: true
    },
    balance: {
      eth: 0.125,
      usd: 210.00
    },
    expirationDate: "April 28, 2025"
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
    validFor: "24 months from purchase date",
    isRechargeable: true,
    hasZkPrivacy: true,
    standard: "ERC-6551",
    merchant: {
      name: "Global Luxury Travel",
      logo: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
      verified: true
    },
    balance: {
      eth: 0.35,
      usd: 590.00
    },
    totalRecharges: 0,
    expirationDate: "May 15, 2025"
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
    blockchain: "Base",
    created: "June 3, 2023",
    isRechargeable: true,
    hasZkPrivacy: false,
    standard: "ERC-721",
    merchant: {
      name: "Fashion Collection",
      logo: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
      verified: true
    },
    balance: {
      eth: 0.178,
      usd: 300.00
    },
    expirationDate: "June 3, 2025"
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
    blockchain: "Polygon",
    created: "June 18, 2023",
    isRechargeable: true,
    hasZkPrivacy: false,
    standard: "ERC-721",
    merchant: {
      name: "StreamFlix",
      logo: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
      verified: true
    },
    balance: {
      eth: 0.065,
      usd: 110.00
    },
    expirationDate: "June 18, 2024"
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
    blockchain: "Stellar",
    created: "July 5, 2023",
    isRechargeable: true,
    hasZkPrivacy: true,
    standard: "ERC-6551",
    merchant: {
      name: "Zen Spa & Wellness",
      logo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
      verified: true
    },
    balance: {
      eth: 0.149,
      usd: 250.00
    },
    expirationDate: "July 5, 2024"
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
    blockchain: "Polygon",
    created: "July 22, 2023",
    isRechargeable: true,
    hasZkPrivacy: false,
    standard: "ERC-721",
    merchant: {
      name: "SoundWave",
      logo: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
      verified: true
    },
    balance: {
      eth: 0.095,
      usd: 160.00
    },
    expirationDate: "July 22, 2024"
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
    created: "August 8, 2023",
    isRechargeable: true,
    hasZkPrivacy: false,
    standard: "ERC-721",
    merchant: {
      name: "EduMaster",
      logo: "https://images.unsplash.com/photo-1594312915251-48db9280c8f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
      verified: true
    },
    balance: {
      eth: 0.117,
      usd: 195.00
    },
    expirationDate: "August 8, 2024"
  },
  {
    id: 9,
    title: "DeFi Yield Booster Card",
    description: "Access premium DeFi yields across multiple protocols with privacy-enhanced staking.",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    category: "defi",
    price: {
      eth: 0.25,
      usd: 420.00
    },
    isVerified: true,
    isFeatured: true,
    contractAddress: "0x9j0k...1l2m",
    tokenId: "#32751",
    blockchain: "Ethereum",
    created: "January 15, 2024",
    isRechargeable: true,
    hasZkPrivacy: true,
    standard: "ERC-6551",
    merchant: {
      name: "YieldDAO",
      logo: "https://images.unsplash.com/photo-1622538841511-c343c60fe6d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
      verified: true
    },
    balance: {
      eth: 0.25,
      usd: 420.00
    },
    expirationDate: "January 15, 2025"
  },
  {
    id: 10,
    title: "NFT Creator Membership",
    description: "Exclusive access to limited NFT drops and creator tools with proof of membership.",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
    category: "nft",
    price: {
      eth: 0.18,
      usd: 300.00
    },
    isVerified: true,
    isFeatured: false,
    contractAddress: "0x0k1l...2m3n",
    tokenId: "#35892",
    blockchain: "Base",
    created: "February 20, 2024",
    isRechargeable: true,
    hasZkPrivacy: true,
    standard: "ERC-6551",
    merchant: {
      name: "NFT Creators Guild",
      logo: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
      verified: true
    },
    balance: {
      eth: 0.18,
      usd: 300.00
    },
    expirationDate: "February 20, 2025"
  }
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    type: "purchase",
    amount: {
      eth: 0.089,
      usd: 150.00
    },
    date: "April 12, 2023",
    giftCardId: 1,
    status: "completed",
    txHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
    merchant: "Steam"
  },
  {
    id: "tx2",
    type: "recharge",
    amount: {
      eth: 0.05,
      usd: 85.00
    },
    date: "July 15, 2023",
    giftCardId: 1,
    status: "completed",
    txHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y",
    merchant: "Steam"
  },
  {
    id: "tx3",
    type: "redeem",
    amount: {
      eth: 0.02,
      usd: 35.00
    },
    date: "August 3, 2023",
    giftCardId: 1,
    status: "completed",
    merchant: "Steam Game Store"
  },
  {
    id: "tx4",
    type: "purchase",
    amount: {
      eth: 0.35,
      usd: 590.00
    },
    date: "May 15, 2023",
    giftCardId: 3,
    status: "completed",
    txHash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    merchant: "Global Luxury Travel"
  },
  {
    id: "tx5",
    type: "redeem",
    amount: {
      eth: 0.35,
      usd: 590.00
    },
    date: "June 20, 2023",
    giftCardId: 3,
    status: "completed",
    merchant: "Star Airlines"
  }
];

export const MERCHANTS: MerchantInfo[] = [
  {
    id: 1,
    name: "Steam",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png",
    isVerified: true,
    joinDate: "January 10, 2023",
    categories: ["gaming"],
    totalGiftCards: 5,
    acceptsStablecoins: [true, true, false, false], // USDC, USDT, DAI, EUROC
    supportedChains: ["Ethereum", "Polygon"]
  },
  {
    id: 2,
    name: "Fine Dining Group",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
    isVerified: true,
    joinDate: "February 5, 2023",
    categories: ["restaurants"],
    totalGiftCards: 8,
    acceptsStablecoins: [true, true, true, true], // USDC, USDT, DAI, EUROC
    supportedChains: ["Ethereum", "Polygon", "Base", "Stellar"]
  },
  {
    id: 3,
    name: "Global Luxury Travel",
    logo: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
    isVerified: true,
    joinDate: "March 15, 2023",
    categories: ["travel"],
    totalGiftCards: 3,
    acceptsStablecoins: [true, true, false, true], // USDC, USDT, DAI, EUROC
    supportedChains: ["Ethereum", "Polygon", "Stellar"]
  },
  {
    id: 4,
    name: "YieldDAO",
    logo: "https://images.unsplash.com/photo-1622538841511-c343c60fe6d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50",
    isVerified: true,
    joinDate: "December 1, 2023",
    categories: ["defi"],
    totalGiftCards: 2,
    acceptsStablecoins: [true, true, true, false], // USDC, USDT, DAI, EUROC
    supportedChains: ["Ethereum", "Polygon", "Base"]
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
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "https://www.svgrepo.com/show/470188/phantom.svg"
  }
];
