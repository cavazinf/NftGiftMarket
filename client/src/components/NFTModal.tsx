import { NFTGiftCard } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Star } from "lucide-react";
import { useState } from "react";

interface NFTModalProps {
  nft: NFTGiftCard;
  isOpen: boolean;
  onClose: () => void;
}

export const NFTModal = ({ nft, isOpen, onClose }: NFTModalProps) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      gaming: "bg-primary",
      restaurants: "bg-orange-500",
      travel: "bg-blue-500",
      shopping: "bg-pink-500",
      entertainment: "bg-purple-500",
      subscription: "bg-indigo-500",
      services: "bg-teal-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md z-10"
        >
          <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-6 md:p-8">
            <img
              src={nft.image}
              alt={nft.title}
              className="w-full h-auto rounded-xl shadow-lg"
            />
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Certificate of Authenticity</h4>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Contract Address</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm font-mono">{nft.contractAddress || "0x1a2b...3c4d"}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Token ID</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm font-mono">{nft.tokenId || "#18493"}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Blockchain</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">{nft.blockchain || "Ethereum"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Created</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">{nft.created || "May 15, 2023"}</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800">
            <div className="mb-2">
              <span className={`${getCategoryColor(nft.category)} text-white text-xs px-2 py-1 rounded-full`}>
                {nft.category.charAt(0).toUpperCase() + nft.category.slice(1)}
              </span>
              {nft.isFeatured && (
                <span className="bg-accent text-white text-xs px-2 py-1 rounded-full ml-2">
                  Featured
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{nft.title}</h2>
            {nft.rating && (
              <div className="flex items-center mb-6">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < (nft.rating || 0) ? "fill-current" : ""}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-300 ml-2">{nft.reviews || 0} reviews</span>
              </div>
            )}
            
            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300 mb-8">
              <p className="mb-4">{nft.description}</p>
              {nft.benefits && (
                <>
                  <p className="mb-4">This exclusive {nft.category} voucher includes:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {nft.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                  {nft.validFor && (
                    <p className="mt-4">Valid for {nft.validFor}</p>
                  )}
                </>
              )}
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current price</p>
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
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
                    <span className="font-bold text-2xl">{nft.price.eth} ETH</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">≈ ${nft.price.usd.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button 
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                      onClick={decreaseQuantity}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                    <button 
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                      onClick={increaseQuantity}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition">
                Buy Now
              </Button>
              <Button variant="outline" className="border border-primary text-primary px-4 py-3 rounded-lg font-medium hover:bg-primary/5 transition">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
