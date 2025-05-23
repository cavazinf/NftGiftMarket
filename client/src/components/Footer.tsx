import { Link } from "wouter";
import { Twitter, Github, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-2xl font-bold mb-5 flex items-center">
              <Link href="/">
                <a className="text-white">NFTGift</a>
              </Link>
              <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                BETA
              </span>
            </div>
            <p className="text-gray-400 mb-5">
              The next generation of gift cards powered by blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">Marketplace</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/marketplace">
                  <a className="text-gray-400 hover:text-white transition">All NFTs</a>
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=gaming">
                  <a className="text-gray-400 hover:text-white transition">Gaming</a>
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=restaurants">
                  <a className="text-gray-400 hover:text-white transition">Restaurants</a>
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=travel">
                  <a className="text-gray-400 hover:text-white transition">Travel</a>
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=entertainment">
                  <a className="text-gray-400 hover:text-white transition">Entertainment</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">My Account</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Profile
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  My Collection
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Create NFT
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Settings
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Platform Status
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} NFTGift Marketplace. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
