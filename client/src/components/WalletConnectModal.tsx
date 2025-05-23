import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { WALLET_PROVIDERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectModal = ({ isOpen, onClose }: WalletConnectModalProps) => {
  const { connect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async (providerId: string) => {
    try {
      setIsConnecting(true);
      await connect(providerId);
      toast({
        title: "Wallet connected",
        description: "Your wallet has been connected successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Connect Your Wallet</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Connect with one of our available wallet providers or create a new one.
          </p>

          <div className="space-y-3">
            {WALLET_PROVIDERS.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition p-4 rounded-lg h-auto"
                disabled={isConnecting}
                onClick={() => handleConnectWallet(provider.id)}
              >
                <div className="flex items-center">
                  <img src={provider.icon} alt={provider.name} className="w-8 h-8 mr-3" />
                  <span className="font-medium">{provider.name}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              New to Ethereum?{" "}
              <a href="#" className="text-primary font-medium">
                Learn more about wallets
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
