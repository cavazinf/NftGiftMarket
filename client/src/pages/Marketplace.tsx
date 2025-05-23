import { useState, useEffect } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import NFTCard from "@/components/NFTCard";
import { GIFT_CARDS } from "@/lib/constants";
import { NFTGiftCard } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface MarketplaceProps {
  openNFTModal: (nft: NFTGiftCard) => void;
}

const Marketplace = ({ openNFTModal }: MarketplaceProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [displayCount, setDisplayCount] = useState(8);
  const [filteredCards, setFilteredCards] = useState<NFTGiftCard[]>([]);

  useEffect(() => {
    document.title = "NFTGift Marketplace - Browse NFT Gift Cards";
    
    // Filter and sort cards based on selected options
    let filtered = [...GIFT_CARDS];
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }
    
    // Sort cards
    switch (sortOption) {
      case "price_low_high":
        filtered.sort((a, b) => a.price.eth - b.price.eth);
        break;
      case "price_high_low":
        filtered.sort((a, b) => b.price.eth - a.price.eth);
        break;
      case "most_popular":
        // Assuming featured cards are "most popular"
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      case "newest":
      default:
        // No sorting needed, assuming the array is already in newest-first order
        break;
    }
    
    setFilteredCards(filtered);
  }, [selectedCategory, sortOption]);

  const loadMore = () => {
    setDisplayCount(prev => prev + 4);
  };

  const displayedCards = filteredCards.slice(0, displayCount);
  const hasMoreCards = displayCount < filteredCards.length;

  return (
    <div>
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <section className="py-12">
        <div className="container mx-auto px-4">
          {displayedCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedCards.map((card) => (
                <NFTCard key={card.id} nft={card} onViewDetails={openNFTModal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No gift cards found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                No gift cards match your current filters. Try changing your category or search criteria.
              </p>
              <Button onClick={() => setSelectedCategory("all")}>
                View All Categories
              </Button>
            </div>
          )}

          {hasMoreCards && (
            <div className="mt-12 flex justify-center">
              <Button 
                variant="outline" 
                onClick={loadMore}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition flex items-center space-x-2"
              >
                <span>Load More</span>
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
