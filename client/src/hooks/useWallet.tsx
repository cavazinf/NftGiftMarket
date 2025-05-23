import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
declare global {
  interface Window {
    ethereum: any;
  }
}

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string | null;
  connect: (type: string) => Promise<void>;
  disconnect: () => void;
  provider: any;
  chainId: number | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Configure Web3Modal with provider options
const providerOptions = {
  injected: {
    display: {
      name: "MetaMask",
      description: "Connect to your MetaMask wallet"
    },
    package: null
  },
  walletconnect: {
    package: null,
    options: {
      infuraId: "INFURA_ID" // We should set up an Infura ID for production
    }
  }
};

let web3Modal: Web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
    theme: "dark"
  });
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  // Auto-connect if previously connected
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect(web3Modal.cachedProvider);
    }
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          disconnect();
        }
      };

      const handleChainChanged = (chainId: number) => {
        setChainId(chainId);
      };

      const handleDisconnect = () => {
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  const connect = async (type: string) => {
    try {
      setIsConnecting(true);
      
      // Connect to wallet
      const modalProvider = await web3Modal.connect();
      
      // For compatibility with both ethers v5 and v6
      let accounts: string[] = [];
      let chainId: number = 0;
      
      try {
        // Try directly getting accounts from provider first (MetaMask style)
        if (modalProvider.request) {
          accounts = await modalProvider.request({ method: 'eth_accounts' });
          const chainIdHex = await modalProvider.request({ method: 'eth_chainId' });
          chainId = parseInt(chainIdHex, 16);
        } else {
          // Fallback to using ethers
          const ethersProvider = new ethers.BrowserProvider(modalProvider);
          const accts = await ethersProvider.listAccounts();
          accounts = accts.map(a => a.address);
          const network = await ethersProvider.getNetwork();
          chainId = Number(network.chainId);
        }
      } catch (error) {
        console.error("Error getting accounts or chain ID", error);
      }
      
      setProvider(modalProvider);
      setChainId(chainId);
      
      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);
        
        // Connect wallet to user in backend
        try {
          await fetch('/api/users/connect-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: address })
          });
        } catch (error) {
          console.warn('API não está disponível, conexão apenas local');
        }
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return Promise.reject(error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }
    
    setProvider(null);
    setWalletAddress(null);
    setChainId(null);
    setIsConnected(false);
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      isConnecting, 
      walletAddress, 
      connect, 
      disconnect,
      provider,
      chainId
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
