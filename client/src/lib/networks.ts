export interface NetworkConfig {
  chainId: number;
  name: string;
  displayName: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet: boolean;
}

export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  sepolia: {
    chainId: 11155111,
    name: 'sepolia',
    displayName: 'Ethereum Sepolia',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    testnet: true
  },
  amoy: {
    chainId: 80002,
    name: 'amoy',
    displayName: 'Polygon Amoy Testnet',
    rpcUrl: 'https://rpc-amoy.polygon.technology/',
    blockExplorer: 'https://amoy.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    testnet: true
  },
  hardhat: {
    chainId: 31337,
    name: 'hardhat',
    displayName: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: '',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    testnet: true
  }
};

export const getNetworkConfig = (chainId: number): NetworkConfig | undefined => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.chainId === chainId);
};

export const getContractAddress = (network: string): string | null => {
  try {
    const contractFile = network === 'hardhat' || network === 'localhost' 
      ? require('@/contracts/NFTGiftCard.json')
      : require(`@/contracts/NFTGiftCard-${network}.json`);
    return contractFile.address || null;
  } catch (error) {
    console.warn(`Contract not deployed on ${network}`);
    return null;
  }
};

export const switchToNetwork = async (chainId: number) => {
  if (!window.ethereum) {
    throw new Error('MetaMask não está instalado');
  }

  const network = getNetworkConfig(chainId);
  if (!network) {
    throw new Error('Rede não suportada');
  }

  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // If the network doesn't exist, add it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${chainId.toString(16)}`,
          chainName: network.displayName,
          rpcUrls: [network.rpcUrl],
          nativeCurrency: network.nativeCurrency,
          blockExplorerUrls: network.blockExplorer ? [network.blockExplorer] : []
        }]
      });
    } else {
      throw error;
    }
  }
};