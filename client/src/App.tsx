import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Marketplace from "@/pages/Marketplace";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { NFTModal } from "@/components/NFTModal";
import { WalletConnectModal } from "@/components/WalletConnectModal";
import { NFTGiftCard } from "@/lib/types";
import { WalletProvider } from "@/hooks/useWallet";

function Router({ openNFTModal }: { openNFTModal: (nft: NFTGiftCard) => void }) {
  return (
    <Switch>
      <Route path="/" component={() => <Home />} />
      <Route path="/marketplace" component={() => <Marketplace openNFTModal={openNFTModal} />} />
      <Route component={NotFound} />
    </Switch>
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
            <Header openWalletModal={openWalletModal} />
            <main className="flex-grow">
              <Router openNFTModal={openNFTModal} />
            </main>
            <Footer />
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
