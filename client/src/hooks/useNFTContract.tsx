import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { getNetworkConfig, getContractAddress } from '@/lib/networks';
import NFTGiftCardContract from '@/contracts/NFTGiftCard.json';

export interface MintGiftCardParams {
  recipient: string;
  merchant: string;
  category: string;
  amount: string; // ETH amount as string
  rechargeable: boolean;
  expirationDays: number;
  metadata: string;
  uri?: string;
}

export interface GiftCardData {
  tokenId: string;
  merchant: string;
  category: string;
  totalValue: string;
  remainingBalance: string;
  rechargeable: boolean;
  expirationDate: number;
  metadata: string;
  owner: string;
}

export const useNFTContract = () => {
  const { provider, walletAddress, isConnected, chainId } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContract = useCallback(async () => {
    if (!provider || !chainId) {
      throw new Error('Provider ou chain ID não disponível');
    }

    const networkConfig = getNetworkConfig(chainId);
    if (!networkConfig) {
      throw new Error(`Rede ${chainId} não suportada`);
    }

    const contractAddress = getContractAddress(networkConfig.name) || NFTGiftCardContract.address;
    if (!contractAddress) {
      throw new Error(`Contrato não deployado na rede ${networkConfig.displayName}`);
    }

    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    return new ethers.Contract(
      contractAddress,
      NFTGiftCardContract.abi,
      signer
    );
  }, [provider, chainId]);

  const mintGiftCard = useCallback(async (params: MintGiftCardParams) => {
    if (!isConnected || !walletAddress) {
      throw new Error('Carteira não conectada');
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const expirationTimestamp = Math.floor(Date.now() / 1000) + (params.expirationDays * 24 * 60 * 60);
      
      const tx = await contract.mintGiftCard(
        params.recipient,
        params.merchant,
        params.category,
        ethers.parseEther("0"), // valorInicial como 0, valor real vem do msg.value
        params.rechargeable,
        expirationTimestamp,
        params.uri || `ipfs://placeholder/${Date.now()}.json`,
        params.metadata,
        {
          value: ethers.parseEther(params.amount),
          gasLimit: 500000
        }
      );

      const receipt = await tx.wait();
      
      // Extrair o tokenId do evento
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'NovoGiftCard';
        } catch {
          return false;
        }
      });

      let tokenId = null;
      if (event) {
        const parsed = contract.interface.parseLog(event);
        tokenId = parsed?.args[0];
      }

      return {
        success: true,
        transactionHash: receipt.hash,
        tokenId: tokenId?.toString(),
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (err: any) {
      const errorMessage = err.reason || err.message || 'Erro desconhecido na mintagem';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletAddress, getContract]);

  const getGiftCard = useCallback(async (tokenId: string): Promise<GiftCardData> => {
    try {
      const contract = await getContract();
      const result = await contract.getGiftCard(tokenId);
      const owner = await contract.ownerOf(tokenId);
      
      return {
        tokenId,
        merchant: result[0],
        category: result[1],
        totalValue: ethers.formatEther(result[2]),
        remainingBalance: ethers.formatEther(result[3]),
        rechargeable: result[4],
        expirationDate: Number(result[5]),
        metadata: result[6],
        owner
      };
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Erro ao buscar dados do Gift Card');
    }
  }, [getContract]);

  const getUserGiftCards = useCallback(async (userAddress?: string): Promise<string[]> => {
    try {
      const contract = await getContract();
      const address = userAddress || walletAddress;
      if (!address) throw new Error('Endereço não fornecido');
      
      return await contract.getUserGiftCards(address);
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Erro ao buscar Gift Cards do usuário');
    }
  }, [getContract, walletAddress]);

  const redeemGiftCard = useCallback(async (tokenId: string, amount: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const tx = await contract.redeemGiftCard(
        tokenId,
        ethers.parseEther(amount),
        { gasLimit: 300000 }
      );
      
      const receipt = await tx.wait();
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (err: any) {
      const errorMessage = err.reason || err.message || 'Erro ao resgatar Gift Card';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getContract]);

  const rechargeGiftCard = useCallback(async (tokenId: string, amount: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const tx = await contract.rechargeGiftCard(tokenId, {
        value: ethers.parseEther(amount),
        gasLimit: 300000
      });
      
      const receipt = await tx.wait();
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (err: any) {
      const errorMessage = err.reason || err.message || 'Erro ao recarregar Gift Card';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getContract]);

  const generateChange = useCallback(async (tokenId: string, amount: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const tx = await contract.gerarTroco(
        tokenId,
        ethers.parseEther(amount),
        { gasLimit: 400000 }
      );
      
      const receipt = await tx.wait();
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (err: any) {
      const errorMessage = err.reason || err.message || 'Erro ao gerar troco';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getContract]);

  return {
    // Actions
    mintGiftCard,
    getGiftCard,
    getUserGiftCards,
    redeemGiftCard,
    rechargeGiftCard,
    generateChange,
    
    // State
    isLoading,
    error,
    contractAddress: chainId ? (getContractAddress(getNetworkConfig(chainId)?.name || '') || NFTGiftCardContract.address) : NFTGiftCardContract.address,
    currentNetwork: chainId ? getNetworkConfig(chainId) : null,
    
    // Utils
    clearError: () => setError(null)
  };
};