import { LockIcon, ArrowLeftRight, TrendingUp } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why NFT Gift Cards?</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the new generation of gift cards powered by blockchain technology. Secure, transferable, and with lasting value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
              <LockIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Authentic</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Each NFT gift card is unique and verified on the blockchain, eliminating counterfeits and fraud.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
              <ArrowLeftRight className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easily Transferable</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Gift or trade your cards with anyone, anywhere in the world with just a few clicks.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Potential Value Growth</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Unlike traditional gift cards, NFT cards can appreciate in value over time as collectibles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
