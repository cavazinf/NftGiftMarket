import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Wallet } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

interface HeaderProps {
  openWalletModal: () => void;
}

const Header = ({ openWalletModal }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isConnected, walletAddress } = useWallet();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { title: "Marketplace", path: "/marketplace" },
    { title: "Recursos", path: "/features" },
    { title: "Collections", path: "/collections" },
    { title: "Create", path: "/create" },
    { title: "Dashboard", path: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <a className="text-primary font-bold text-2xl">NFTGift</a>
            </Link>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              BETA
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={`px-4 py-2 rounded-lg text-dark dark:text-light hover:bg-gray-100 dark:hover:bg-gray-800 transition ${location === item.path ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
                  {item.title}
                </a>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search cards..."
                className="py-2 pl-10 pr-4 w-64 rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {isConnected ? (
              <Button 
                variant="outline" 
                className="hidden sm:flex items-center space-x-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition"
              >
                <Wallet className="h-5 w-5" />
                <span className="truncate max-w-[100px]">{walletAddress}</span>
              </Button>
            ) : (
              <Button
                onClick={openWalletModal}
                className="hidden sm:flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition shadow-sm"
              >
                <Wallet className="h-5 w-5" />
                <span>Connect Wallet</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark border-t border-gray-100 dark:border-gray-800 py-2">
          <div className="container mx-auto px-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={`block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ${location === item.path ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
                  {item.title}
                </a>
              </Link>
            ))}
            <div className="relative mt-2">
              <Input
                type="text"
                placeholder="Search cards..."
                className="py-2 pl-10 pr-4 w-full rounded-lg bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <Button
              onClick={openWalletModal}
              className="flex items-center space-x-2 w-full bg-primary text-white px-4 py-2 rounded-lg mt-2"
            >
              <Wallet className="h-5 w-5" />
              <span>Connect Wallet</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
