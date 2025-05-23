import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';

// Simulação Local para desenvolvimento
const USE_MOCK_CONTRACT = true; // Configuração para permitir uso sem blockchain
let mockTokenIdCounter = 1;
const mockGiftCards = new Map();
const mockUserGiftCards = new Map();

// Deployed contract address
// Get this from your deployment logs or NFTGiftCard.json
let CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Default address

// Try to load from the contracts file if available
try {
  const NFTcontractInfo = require('../contracts/NFTGiftCard.json');
  if (NFTcontractInfo && NFTcontractInfo.address) {
    CONTRACT_ADDRESS = NFTcontractInfo.address;
  }
} catch (e) {
  console.warn("Could not find contract address from JSON, using default");
}

const CONTRACT_ABI = [
  "function mintGiftCard(address to, string merchantName, string category, uint256 valueInWei, bool isRechargeable, uint256 expirationDate, string tokenURI, string metadata) public payable returns (uint256)",
  "function getGiftCard(uint256 tokenId) public view returns (tuple(string merchantName, string category, uint256 valueInWei, uint256 balanceInWei, bool isRedeemable, bool isRechargeable, uint256 expirationDate, string metadata))",
  "function getUserGiftCards(address user) public view returns (uint256[])",
  "function redeemGiftCard(uint256 tokenId, uint256 amount) public",
  "function rechargeGiftCard(uint256 tokenId) public payable",
  "function getBalance(uint256 tokenId) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event GiftCardMinted(uint256 indexed tokenId, address indexed recipient, string merchantName, uint256 value)"
];

export interface NFTGiftCardData {
  merchantName: string;
  category: string;
  valueInWei: bigint;
  balanceInWei: bigint;
  isRedeemable: boolean;
  isRechargeable: boolean;
  expirationDate: bigint;
  metadata: string;
}

export function useNFTContract() {
  const { provider, walletAddress, isConnected } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (provider && isConnected) {
      try {
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error('Error creating contract instance:', error);
      }
    }
  }, [provider, isConnected]);

  const mintGiftCard = async (
    recipient: string,
    merchantName: string,
    category: string,
    valueInEth: number,
    isRechargeable: boolean,
    expirationDays: number,
    tokenURI: string,
    metadata: string
  ) => {
    // Usando a simulação quando estamos em modo de desenvolvimento ou quando não há contrato
    if (USE_MOCK_CONTRACT || !contract || !walletAddress) {
      console.log("Usando simulação para criar NFT Gift Card");
      
      setIsLoading(true);
      try {
        // Simular um atraso para dar sensação de processamento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const valueInWei = ethers.parseEther(valueInEth.toString());
        const expirationDate = Math.floor(Date.now() / 1000) + (expirationDays * 24 * 60 * 60);
        
        // Criar o NFT simulado
        const tokenId = mockTokenIdCounter++;
        
        mockGiftCards.set(tokenId, {
          merchantName: merchantName,
          category: category,
          valueInWei: valueInWei,
          balanceInWei: valueInWei, // O saldo é igual ao valor inicial
          isRedeemable: true,
          isRechargeable: isRechargeable,
          expirationDate: expirationDate,
          metadata: metadata
        });
        
        // Adicionar o tokenId à lista do usuário
        if (!mockUserGiftCards.has(recipient)) {
          mockUserGiftCards.set(recipient, []);
        }
        mockUserGiftCards.get(recipient).push(tokenId);
        
        console.log("NFT Gift Card simulado criado com sucesso:", {
          tokenId,
          value: valueInEth,
          balance: valueInEth
        });
        
        return {
          success: true,
          tokenId: tokenId.toString(),
          transactionHash: `mock_tx_${Math.random().toString(36).substring(2, 15)}`
        };
      } catch (error: any) {
        console.error('Erro na simulação:', error);
        throw new Error(error.message || 'Falha ao simular criação do NFT Gift Card');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Código original para quando o contrato está disponível
    setIsLoading(true);
    try {
      const valueInWei = ethers.parseEther(valueInEth.toString());
      const expirationDate = Math.floor(Date.now() / 1000) + (expirationDays * 24 * 60 * 60);
      
      // Log para debugging
      console.log("Minting NFT with value:", valueInEth, "ETH");
      console.log("Value in Wei:", valueInWei.toString());
      
      // Para garantir que o valor seja enviado corretamente com a transação
      const tx = await contract.mintGiftCard(
        recipient,
        merchantName,
        category,
        valueInWei,
        isRechargeable,
        expirationDate,
        tokenURI,
        metadata,
        { 
          value: valueInWei, // Enviamos o ETH com a transação
          gasLimit: 500000 // Limite de gas adequado para essa operação
        }
      );

      const receipt = await tx.wait();
      
      // Find the GiftCardMinted event to get the token ID
      const event = receipt.logs.find((log: any) => {
        try {
          const decoded = contract.interface.parseLog(log);
          return decoded && decoded.name === 'GiftCardMinted';
        } catch {
          return false;
        }
      });

      let tokenId = null;
      if (event) {
        const decoded = contract.interface.parseLog(event);
        tokenId = decoded?.args[0];
      }

      return {
        success: true,
        tokenId: tokenId?.toString(),
        transactionHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error minting NFT:', error);
      throw new Error(error.message || 'Failed to mint NFT Gift Card');
    } finally {
      setIsLoading(false);
    }
  };

  const getGiftCard = async (tokenId: string): Promise<NFTGiftCardData | null> => {
    // Simulação quando em modo de desenvolvimento
    if (USE_MOCK_CONTRACT) {
      console.log("Usando simulação para obter NFT Gift Card");
      const tokenIdNum = parseInt(tokenId);
      
      if (mockGiftCards.has(tokenIdNum)) {
        const card = mockGiftCards.get(tokenIdNum);
        return {
          merchantName: card.merchantName,
          category: card.category,
          valueInWei: card.valueInWei,
          balanceInWei: card.balanceInWei,
          isRedeemable: card.isRedeemable,
          isRechargeable: card.isRechargeable,
          expirationDate: card.expirationDate,
          metadata: card.metadata
        };
      }
      return null;
    }
    
    // Código original para quando o contrato está disponível
    if (!contract) return null;

    try {
      const result = await contract.getGiftCard(tokenId);
      return {
        merchantName: result[0],
        category: result[1],
        valueInWei: result[2],
        balanceInWei: result[3],
        isRedeemable: result[4],
        isRechargeable: result[5],
        expirationDate: result[6],
        metadata: result[7]
      };
    } catch (error) {
      console.error('Error getting gift card:', error);
      return null;
    }
  };

  const getUserGiftCards = async (userAddress: string): Promise<string[]> => {
    // Simulação quando em modo de desenvolvimento
    if (USE_MOCK_CONTRACT) {
      console.log("Usando simulação para obter NFTs do usuário");
      
      if (mockUserGiftCards.has(userAddress)) {
        return mockUserGiftCards.get(userAddress).map(id => id.toString());
      }
      return [];
    }
    
    // Código original para quando o contrato está disponível
    if (!contract) return [];

    try {
      const tokenIds = await contract.getUserGiftCards(userAddress);
      return tokenIds.map((id: bigint) => id.toString());
    } catch (error) {
      console.error('Error getting user gift cards:', error);
      return [];
    }
  };

  const redeemGiftCard = async (tokenId: string, amountInEth: number) => {
    if (!contract || !walletAddress) {
      throw new Error('Contract not available or wallet not connected');
    }

    setIsLoading(true);
    try {
      const amountInWei = ethers.parseEther(amountInEth.toString());
      const tx = await contract.redeemGiftCard(tokenId, amountInWei);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error redeeming gift card:', error);
      throw new Error(error.message || 'Failed to redeem gift card');
    } finally {
      setIsLoading(false);
    }
  };

  const rechargeGiftCard = async (tokenId: string, amountInEth: number) => {
    if (!contract || !walletAddress) {
      throw new Error('Contract not available or wallet not connected');
    }

    setIsLoading(true);
    try {
      const amountInWei = ethers.parseEther(amountInEth.toString());
      const tx = await contract.rechargeGiftCard(tokenId, { value: amountInWei });
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Error recharging gift card:', error);
      throw new Error(error.message || 'Failed to recharge gift card');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contract,
    isLoading,
    mintGiftCard,
    getGiftCard,
    getUserGiftCards,
    redeemGiftCard,
    rechargeGiftCard,
    isContractReady: !!contract && isConnected
  };
}