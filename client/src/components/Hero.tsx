import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Gift Cards Reimagined with NFT Technology
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Discover, collect, and gift unique digital cards on the blockchain. Perfect for any occasion.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition"
              >
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
              <Button
                variant="outline"
                className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-4 mt-10">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120"
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120"
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                />
                <img
                  src="https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120"
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Joined by <span className="font-medium">10,000+</span> gift card lovers
              </p>
            </div>
          </div>

          <div className="md:w-1/2 pl-0 md:pl-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="transform hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=400"
                  alt="Gaming Gift Card"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
                <div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-2 shadow-md -mt-12 mx-3 relative">
                  <p className="font-semibold">Gaming NFT Card</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Valid for all platforms</p>
                </div>
              </div>
              <div className="transform hover:scale-105 transition-transform mt-10">
                <img
                  src="https://images.unsplash.com/photo-1574936145840-28808d77a0b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=400"
                  alt="Restaurant Gift Card"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
                <div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-2 shadow-md -mt-12 mx-3 relative">
                  <p className="font-semibold">Dining Experience</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Premium restaurants</p>
                </div>
              </div>
              <div className="transform hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=400"
                  alt="Travel Gift Card"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
                <div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-2 shadow-md -mt-12 mx-3 relative">
                  <p className="font-semibold">Travel Voucher</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Exclusive destinations</p>
                </div>
              </div>
              <div className="transform hover:scale-105 transition-transform mt-10">
                <img
                  src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=400"
                  alt="Shopping Gift Card"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
                <div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-2 shadow-md -mt-12 mx-3 relative">
                  <p className="font-semibold">Fashion Card</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Top brands included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
