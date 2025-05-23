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
  "function mintGiftCard(address para, string comerciante, string categoria, uint256 valorInicial, bool recarregavel, uint256 dataExpiracao, string uri, string metadata) public payable returns (uint256)",
  "function getGiftCard(uint256 tokenId) public view returns (string comerciante, string categoria, uint256 valorTotal, uint256 saldoRestante, bool recarregavel, uint256 dataExpiracao, string metadata)",
  "function getUserGiftCards(address user) public view returns (uint256[])",
  "function redeemGiftCard(uint256 tokenId, uint256 valor) public",
  "function rechargeGiftCard(uint256 tokenId) public payable",
  "function saldoDisponivel(uint256 tokenId) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function gerarTroco(uint256 tokenId, uint256 valor) public",
  "event NovoGiftCard(uint256 indexed tokenId, address indexed comprador, uint256 saldo)",
  "event SaldoGastado(uint256 indexed tokenId, uint256 valor, uint256 saldoRestante)",
  "event CartaoRecarregado(uint256 indexed tokenId, uint256 valor, uint256 novoSaldo)",
  "event TrocoGerado(uint256 originalTokenId, uint256 novoTokenId, uint256 valor)"
];

export interface NFTGiftCardData {
  merchantName: string;    // comerciante
  category: string;        // categoria
  valueInWei: bigint;      // valorTotal
  balanceInWei: bigint;    // saldoRestante
  isRechargeable: boolean; // recarregavel
  expirationDate: bigint;  // dataExpiracao
  metadata: string;        // metadata
}

export function useNFTContract() {
  const { provider, walletAddress, isConnected } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Nova função para gerar troco
  const gerarTroco = async (tokenId: string, amountInEth: number) => {
    if (USE_MOCK_CONTRACT || !contract || !walletAddress) {
      console.log("Usando simulação para gerar troco");
      
      setIsLoading(true);
      try {
        // Simular um atraso para dar sensação de processamento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const tokenIdNum = parseInt(tokenId);
        const amountInWei = ethers.parseEther(amountInEth.toString());
        
        if (mockGiftCards.has(tokenIdNum)) {
          const card = mockGiftCards.get(tokenIdNum);
          
          // Verificar se há saldo suficiente
          if ((card.valor - card.usado) < amountInWei) {
            throw new Error("Saldo insuficiente para gerar troco");
          }
          
          // Criar um novo Gift Card com o valor do troco
          const newTokenId = mockTokenIdCounter++;
          
          // Deduzir o valor do cartão original
          card.usado = card.usado + amountInWei;
          
          // Criar um novo cartão com o troco
          mockGiftCards.set(newTokenId, {
            comerciante: card.comerciante,
            categoria: card.categoria,
            valor: amountInWei,
            usado: ethers.parseEther("0"),
            recarregavel: card.recarregavel,
            dataExpiracao: card.dataExpiracao,
            metadata: card.metadata
          });
          
          // Adicionar o novo cartão à lista do usuário
          if (!mockUserGiftCards.has(walletAddress)) {
            mockUserGiftCards.set(walletAddress, []);
          }
          mockUserGiftCards.get(walletAddress).push(newTokenId);
          
          console.log("Troco gerado com sucesso:", {
            originalTokenId: tokenIdNum,
            newTokenId: newTokenId,
            amount: amountInEth
          });
          
          return {
            success: true,
            originalTokenId: tokenIdNum,
            newTokenId: newTokenId.toString(),
            transactionHash: `mock_tx_${Math.random().toString(36).substring(2, 15)}`
          };
        } else {
          throw new Error("Gift Card não encontrado");
        }
        
      } catch (error: any) {
        console.error('Erro na simulação de troco:', error);
        throw new Error(error.message || 'Falha ao gerar troco');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Implementação real usando o contrato
    setIsLoading(true);
    try {
      const amountInWei = ethers.parseEther(amountInEth.toString());
      
      const tx = await contract.gerarTroco(tokenId, amountInWei, {
        gasLimit: 300000
      });
      
      const receipt = await tx.wait();
      
      // Encontrar o evento TrocoGerado para obter o ID do novo token
      const event = receipt.logs.find((log: any) => {
        try {
          const decoded = contract.interface.parseLog(log);
          return decoded && decoded.name === 'TrocoGerado';
        } catch {
          return false;
        }
      });
      
      let originalTokenId = null;
      let newTokenId = null;
      if (event) {
        const decoded = contract.interface.parseLog(event);
        originalTokenId = decoded?.args[0];
        newTokenId = decoded?.args[1];
      }
      
      return {
        success: true,
        originalTokenId: originalTokenId?.toString(),
        newTokenId: newTokenId?.toString(),
        transactionHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Erro ao gerar troco:', error);
      throw new Error(error.message || 'Falha ao gerar troco');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (provider && isConnected) {
      try {
        // Criando um ethers provider a partir do web3 provider
        let ethersProvider;
        
        // Para compatibilidade com diferentes versões do ethers
        if (ethers.BrowserProvider) {
          // ethers v6
          ethersProvider = new ethers.BrowserProvider(provider);
          ethersProvider.getSigner().then(signer => {
            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            setContract(contractInstance);
          }).catch(err => {
            console.error('Error getting signer:', err);
          });
        } else {
          // ethers v5
          ethersProvider = new ethers.providers.Web3Provider(provider);
          const signer = ethersProvider.getSigner();
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contractInstance);
        }
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
        
        // Criar o NFT simulado usando a nova estrutura
        const tokenId = mockTokenIdCounter++;
        
        mockGiftCards.set(tokenId, {
          comerciante: merchantName,
          categoria: category,
          valor: ethers.parseEther(valueInEth.toString()),
          usado: ethers.parseEther("0"), // Inicialmente sem uso
          recarregavel: isRechargeable,
          dataExpiracao: ethers.getBigInt(expirationDate),
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
      console.log("Criando NFT Gift Card com valor:", valueInEth, "ETH");
      console.log("Valor em Wei:", valueInWei.toString());
      
      // No novo contrato, os parâmetros são diferentes
      const tx = await contract.mintGiftCard(
        recipient,           // para
        merchantName,        // comerciante
        category,            // categoria
        valueInWei,          // valorInicial (será ignorado pois usamos msg.value)
        isRechargeable,      // recarregavel
        expirationDate,      // dataExpiracao
        tokenURI,            // uri
        metadata,            // metadata
        { 
          value: valueInWei, // Enviamos o ETH com a transação
          gasLimit: 500000   // Limite de gas adequado para essa operação
        }
      );

      const receipt = await tx.wait();
      
      // Encontrar o evento NovoGiftCard para obter o ID do token
      const event = receipt.logs.find((log: any) => {
        try {
          const decoded = contract.interface.parseLog(log);
          return decoded && decoded.name === 'NovoGiftCard';
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
          merchantName: card.comerciante || card.merchantName,
          category: card.categoria || card.category,
          valueInWei: card.valor || card.valueInWei,
          balanceInWei: card.usado !== undefined ? (card.valor - card.usado) : card.balanceInWei,
          isRechargeable: card.recarregavel !== undefined ? card.recarregavel : card.isRechargeable,
          expirationDate: card.dataExpiracao || card.expirationDate,
          metadata: card.metadata
        };
      }
      return null;
    }
    
    // Código original para quando o contrato está disponível
    if (!contract) return null;

    try {
      // No novo contrato, getGiftCard retorna campos individuais, não uma tupla
      const [
        comerciante,
        categoria,
        valorTotal,
        saldoRestante,
        recarregavel,
        dataExpiracao,
        metadata
      ] = await contract.getGiftCard(tokenId);
      
      return {
        merchantName: comerciante,
        category: categoria,
        valueInWei: valorTotal,
        balanceInWei: saldoRestante,
        isRechargeable: recarregavel,
        expirationDate: dataExpiracao,
        metadata: metadata
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

  // Função já definida em outro lugar, removendo esta duplicação
    if (USE_MOCK_CONTRACT || !contract || !walletAddress) {
      console.log("Usando simulação para resgatar valor do gift card");
      
      setIsLoading(true);
      try {
        // Simular um atraso para dar sensação de processamento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const tokenIdNum = parseInt(tokenId);
        const amountInWei = ethers.parseEther(amountInEth.toString());
        
        if (mockGiftCards.has(tokenIdNum)) {
          const card = mockGiftCards.get(tokenIdNum);
          
          // Verificar se há saldo suficiente
          if ((card.valor - card.usado) < amountInWei) {
            throw new Error("Saldo insuficiente para resgatar este valor");
          }
          
          // Marcar o valor como usado
          card.usado = card.usado + amountInWei;
          
          console.log("Valor resgatado com sucesso:", {
            tokenId: tokenIdNum,
            amount: amountInEth,
            remainingBalance: ethers.formatEther(card.valor - card.usado)
          });
          
          return {
            success: true,
            tokenId: tokenIdNum.toString(),
            amount: amountInEth,
            transactionHash: `mock_tx_${Math.random().toString(36).substring(2, 15)}`
          };
        } else {
          throw new Error("Gift Card não encontrado");
        }
        
      } catch (error: any) {
        console.error('Erro na simulação de resgate:', error);
        throw new Error(error.message || 'Falha ao resgatar valor');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Implementação real usando o contrato
    setIsLoading(true);
    try {
      const amountInWei = ethers.parseEther(amountInEth.toString());
      
      const tx = await contract.redeemGiftCard(tokenId, amountInWei, {
        gasLimit: 300000
      });
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        tokenId: tokenId,
        amount: amountInEth,
        transactionHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Erro ao resgatar valor:', error);
      throw new Error(error.message || 'Falha ao resgatar valor do gift card');
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
    gerarTroco,
    isContractReady: !!contract && isConnected
  };
}