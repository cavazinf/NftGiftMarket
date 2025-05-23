import { Heart, Shield, RefreshCw } from "lucide-react";
import { NFTGiftCard } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface NFTCardProps {
  nft: NFTGiftCard;
  onViewDetails: (nft: NFTGiftCard) => void;
}

const NFTCard = ({ nft, onViewDetails }: NFTCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleClick = () => {
    onViewDetails(nft);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      gaming: "bg-primary/90",
      restaurants: "bg-orange-500/90",
      travel: "bg-blue-500/90",
      shopping: "bg-pink-500/90",
      entertainment: "bg-purple-500/90",
      subscription: "bg-indigo-500/90",
      services: "bg-teal-500/90",
      defi: "bg-green-600/90",
      nft: "bg-purple-600/90",
    };
    return colors[category] || "bg-gray-500/90";
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={nft.image}
          alt={nft.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`${getCategoryColor(nft.category)} text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm`}>
            {nft.category.charAt(0).toUpperCase() + nft.category.slice(1)}
          </span>
        </div>
        {nft.isFeatured && (
          <div className="absolute top-3 right-3 bg-accent/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            Featured
          </div>
        )}
        {!nft.isFeatured && (
          <button
            className={`absolute top-3 right-3 ${
              isFavorite ? "bg-primary/90 text-white" : "bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300"
            } p-1.5 rounded-full backdrop-blur-sm hover:text-primary dark:hover:text-primary`}
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}
        
        {nft.merchant && nft.merchant.logo && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center bg-white/90 dark:bg-gray-800/90 rounded-full p-1 backdrop-blur-sm">
              <img 
                src={nft.merchant.logo} 
                alt={nft.merchant.name}
                className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{nft.title}</h3>
          <div className="flex space-x-1">
            {nft.isVerified && (
              <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-green-600 dark:text-green-400 text-xs font-medium">
                <span>Verified</span>
              </div>
            )}
            {nft.standard === "ERC-6551" && (
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-blue-600 dark:text-blue-400 text-xs font-medium">
                <span>Smart NFT</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{nft.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {nft.blockchain && (
            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-xs">
              {nft.blockchain}
            </Badge>
          )}
          {nft.isRechargeable && (
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Rechargeable
            </Badge>
          )}
          {nft.hasZkPrivacy && (
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Private
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Current price</p>
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-bold">{nft.price.eth} ETH</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">≈ ${nft.price.usd.toFixed(2)}</p>
          </div>
          <Button 
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
            onClick={handleClick}
          >
            Purchase
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
