import { useEffect } from "react";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import CallToAction from "@/components/CallToAction";
import { useToast } from "@/hooks/use-toast";

interface HomeProps {
  openWalletModal?: () => void;
}

const Home = ({ openWalletModal }: HomeProps = {}) => {
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "NFTGift - Gift Cards Reimagined with NFT Technology";
  }, []);

  // Fallback para o caso de openWalletModal não ser passado
  const handleOpenWallet = () => {
    if (openWalletModal) {
      openWalletModal();
    } else {
      toast({
        title: "Connect Wallet",
        description: "Please use the Connect Wallet button in the header.",
      });
    }
  };

  return (
    <div>
      <Hero />
      <FeaturesSection />
      <CallToAction openWalletModal={handleOpenWallet} />
    </div>
  );
};

export default Home;
