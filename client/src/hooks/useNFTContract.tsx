import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';

// This will be populated when contract is deployed
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Local hardhat default
const CONTRACT_ABI = [
  "function mintGiftCard(address to, string merchantName, string category, uint256 valueInWei, bool isRechargeable, uint256 expirationDate, string tokenURI, string metadata) public returns (uint256)",
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
    if (!contract || !walletAddress) {
      throw new Error('Contract not available or wallet not connected');
    }

    setIsLoading(true);
    try {
      const valueInWei = ethers.parseEther(valueInEth.toString());
      const expirationDate = Math.floor(Date.now() / 1000) + (expirationDays * 24 * 60 * 60);
      
      const tx = await contract.mintGiftCard(
        recipient,
        merchantName,
        category,
        valueInWei,
        isRechargeable,
        expirationDate,
        tokenURI,
        metadata
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