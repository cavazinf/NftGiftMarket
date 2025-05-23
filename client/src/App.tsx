import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Marketplace from "@/pages/Marketplace";
import Features from "@/pages/Features";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import B2BDashboard from "@/pages/B2BDashboard";
import CreateGiftCard from "@/pages/CreateGiftCard";
import DeFi from "@/pages/DeFi";
import ZKPrivacy from "@/pages/ZKPrivacy";
import B2BScanner from "@/pages/B2BScanner";
import B2CWallet from "@/pages/B2CWallet";
import FintechDApp from "@/pages/FintechDApp";
import Collections from "@/pages/Collections";
import DApps from "@/pages/DApps";
import NFTLogin from "@/pages/NFTLogin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { NFTModal } from "@/components/NFTModal";
import { WalletConnectModal } from "@/components/WalletConnectModal";
import { NFTGiftCard } from "@/lib/types";
import { WalletProvider, useWallet } from "@/hooks/useWallet";

// Componente para proteção de rotas que requerem autenticação
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [_, setLocation] = useLocation();
  const { isConnected } = useWallet();
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  
  useEffect(() => {
    if (!isConnected && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isConnected, isAuthenticated, setLocation]);
  
  return (isConnected || isAuthenticated) ? <Component /> : null;
}

// Componente para proteção de rotas que requerem direitos de admin
function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const [_, setLocation] = useLocation();
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  const userRole = localStorage.getItem('user_role');
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    } else if (userRole !== 'admin') {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, userRole, setLocation]);
  
  return (isAuthenticated && userRole === 'admin') ? <Component /> : null;
}

function Router({ openNFTModal }: { openNFTModal: (nft: NFTGiftCard) => void }) {
  const [location] = useLocation();
  const showHeaderFooter = !location.includes('/login') && 
                           !location.includes('/dashboard') && 
                           !location.includes('/admin') &&
                           !location.includes('/create-gift-card') &&
                           !location.includes('/b2b-dashboard') &&
                           !location.includes('/defi') &&
                           !location.includes('/zk-privacy') &&
                           !location.includes('/b2b-scanner') &&
                           !location.includes('/b2c-wallet') &&
                           !location.includes('/fintech-dapp') &&
                           !location.includes('/nft-login');
  
  return (
    <>
      {showHeaderFooter && <Header openWalletModal={() => {}} />}
      <Switch>
        <Route path="/" component={() => <Home />} />
        <Route path="/marketplace" component={() => <Marketplace openNFTModal={openNFTModal} />} />
        <Route path="/features" component={Features} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/admin" component={() => <AdminRoute component={Admin} />} />
        <Route path="/create-gift-card" component={() => <ProtectedRoute component={CreateGiftCard} />} />
        <Route path="/create" component={() => <ProtectedRoute component={CreateGiftCard} />} />
        <Route path="/b2b-dashboard" component={() => <ProtectedRoute component={B2BDashboard} />} />
        <Route path="/defi" component={() => <ProtectedRoute component={DeFi} />} />
        <Route path="/zk-privacy" component={() => <ProtectedRoute component={ZKPrivacy} />} />
        <Route path="/b2b-scanner" component={() => <ProtectedRoute component={B2BScanner} />} />
        <Route path="/b2c-wallet" component={() => <ProtectedRoute component={B2CWallet} />} />
        <Route path="/fintech-dapp" component={() => <ProtectedRoute component={FintechDApp} />} />
        <Route path="/collections" component={Collections} />
        <Route path="/dapps" component={DApps} />
        <Route path="/nft-login" component={NFTLogin} />
        <Route component={NotFound} />
      </Switch>
      {showHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTGiftCard | null>(null);

  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  const openNFTModal = (nft: NFTGiftCard) => {
    setSelectedNFT(nft);
    setIsNFTModalOpen(true);
  };
  const closeNFTModal = () => setIsNFTModalOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Router openNFTModal={openNFTModal} />
            </main>
          </div>
          {isNFTModalOpen && selectedNFT && (
            <NFTModal nft={selectedNFT} isOpen={isNFTModalOpen} onClose={closeNFTModal} />
          )}
          <WalletConnectModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />
          <Toaster />
        </TooltipProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
