import { useState, createContext, useContext, ReactNode } from "react";

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string | null;
  connect: (type: string) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connect = async (type: string) => {
    // In a real application, this would connect to a real wallet
    // For now, we're just simulating a connection
    try {
      setIsConnecting(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock wallet address
      const mockAddress = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
      
      setWalletAddress(mockAddress);
      setIsConnected(true);
      
      // Simular API call para conectar o wallet ao user
      await fetch('/api/users/1/connect-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: mockAddress })
      }).catch(error => {
        console.warn('API não está ativa, usando mock de conexão');
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return Promise.reject(error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      isConnecting, 
      walletAddress, 
      connect, 
      disconnect 
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  
  return context;
};
