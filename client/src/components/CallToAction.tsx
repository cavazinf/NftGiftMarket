import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  openWalletModal: () => void;
}

const CallToAction = ({ openWalletModal }: CallToActionProps) => {
  const { isConnected } = useWallet();

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to dive into the future of gift cards?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of users already using NFT gift cards. Connect your wallet and start exploring.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={openWalletModal}
              className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition shadow-lg"
              disabled={isConnected}
            >
              {isConnected ? "Wallet Connected" : "Connect Wallet"}
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition"
            >
              Learn How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
