import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertGiftCardSchema, 
  insertUserSchema, 
  insertTransactionSchema, 
  insertMerchantSchema, 
  insertZkProofSchema,
  insertNotificationSchema,
  insertRewardSchema,
  insertCategorySchema
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";

// Helper para tratar erros
const handleError = (error: unknown, res: Response, errorMessage: string) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ 
      message: "Dados inválidos", 
      errors: error.errors 
    });
  }
  console.error(`${errorMessage}:`, error);
  res.status(500).json({ message: errorMessage });
};

export async function registerRoutes(app: Express): Promise<Server> {
  //==========================================================================
  // ENDPOINTS DE GIFT CARDS (COMPONENTE: EMISSÃO)
  //==========================================================================
  
  // Obter todos os gift cards
  app.get("/api/gift-cards", async (req, res) => {
    try {
      const giftCards = await storage.getAllGiftCards();
      res.json(giftCards);
    } catch (error) {
      handleError(error, res, "Falha ao obter gift cards");
    }
  });

  // Obter gift card por ID
  app.get("/api/gift-cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Formato de ID inválido" });
      }
      
      const giftCard = await storage.getGiftCardById(id);
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card não encontrado" });
      }
      
      res.json(giftCard);
    } catch (error) {
      handleError(error, res, "Falha ao obter gift card");
    }
  });

  // Obter gift cards por categoria
  app.get("/api/gift-cards/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const giftCards = await storage.getGiftCardsByCategory(category);
      res.json(giftCards);
    } catch (error) {
      handleError(error, res, "Falha ao obter gift cards por categoria");
    }
  });

  // Obter gift cards por merchant (loja)
  app.get("/api/merchants/:merchantId/gift-cards", async (req, res) => {
    try {
      const merchantId = parseInt(req.params.merchantId);
      if (isNaN(merchantId)) {
        return res.status(400).json({ message: "Formato de ID de merchant inválido" });
      }
      
      const giftCards = await storage.getGiftCardsByMerchant(merchantId);
      res.json(giftCards);
    } catch (error) {
      handleError(error, res, "Falha ao obter gift cards por merchant");
    }
  });

  // Obter gift cards recarregáveis
  app.get("/api/gift-cards/rechargeable", async (req, res) => {
    try {
      const giftCards = await storage.getRechargeableGiftCards();
      res.json(giftCards);
    } catch (error) {
      handleError(error, res, "Falha ao obter gift cards recarregáveis");
    }
  });

  // Obter gift cards com privacidade ZK
  app.get("/api/gift-cards/privacy-enabled", async (req, res) => {
    try {
      const giftCards = await storage.getPrivacyEnabledGiftCards();
      res.json(giftCards);
    } catch (error) {
      handleError(error, res, "Falha ao obter gift cards com privacidade");
    }
  });

  // Criar um gift card (mintCard)
  app.post("/api/gift-cards", async (req, res) => {
    try {
      const giftCardData = insertGiftCardSchema.parse(req.body);
      const newGiftCard = await storage.createGiftCard(giftCardData);
      
      // Criar notificação para o dono do gift card
      if (giftCardData.sellerId) {
        try {
          await storage.createNotification({
            userId: giftCardData.sellerId,
            type: "mint",
            title: "Novo Gift Card Criado",
            message: `Seu gift card "${giftCardData.title}" foi criado com sucesso com custo baixo (<0.5%)`,
            giftCardId: newGiftCard.id
          });
        } catch (notifError) {
          console.error("Erro ao criar notificação:", notifError);
        }
      }
      
      res.status(201).json(newGiftCard);
    } catch (error) {
      handleError(error, res, "Falha ao criar gift card");
    }
  });

  // Recarga de gift card (rechargeCard)
  app.post("/api/gift-cards/:id/recharge", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Formato de ID inválido" });
      }
      
      const rechargeSchema = z.object({
        userId: z.number(),
        amountEth: z.number().positive(),
        amountUsd: z.number().positive()
      });
      
      const { userId, amountEth, amountUsd } = rechargeSchema.parse(req.body);
      
      // Verificar se o gift card existe
      const giftCard = await storage.getGiftCardById(id);
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card não encontrado" });
      }
      
      // Verificar se o gift card é recarregável
      if (!giftCard.isRechargeable) {
        return res.status(400).json({ message: "Este gift card não aceita recargas" });
      }
      
      // Calcular novo saldo
      const newBalanceEth = Number((giftCard.balanceEth || 0)) + amountEth;
      const newBalanceUsd = Number((giftCard.balanceUsd || 0)) + amountUsd;
      
      // Atualizar saldo do gift card
      const updatedGiftCard = await storage.updateGiftCardBalance(id, newBalanceEth, newBalanceUsd);
      
      // Registrar transação de recarga
      await storage.createTransaction({
        userId,
        giftCardId: id,
        type: "recharge",
        totalEth: String(amountEth),
        totalUsd: String(amountUsd),
        status: "completed",
        quantity: 1,
        merchantId: giftCard.merchantId || null,
        transactionHash: null
      });
      
      // Criar notificação para o usuário
      await storage.createNotification({
        userId,
        type: "recharge",
        title: "Recarga Concluída",
        message: `Você recarregou o gift card "${giftCard.title}" com ${amountUsd} USD`,
        giftCardId: id
      });
      
      // Atribuir pontos de recompensa (10% do valor em USD como pontos)
      const rewardPoints = Math.floor(amountUsd * 10);
      await storage.updateUserRewardPoints(userId, rewardPoints);
      
      // Registrar recompensa
      await storage.createReward({
        userId,
        points: rewardPoints,
        type: "recharge",
        description: `Recompensa por recarga do gift card "${giftCard.title}"`,
        transactionId: null,
        expiresAt: null
      });
      
      res.json({ 
        giftCard: updatedGiftCard,
        message: "Recarga realizada com sucesso",
        rewardPoints
      });
    } catch (error) {
      handleError(error, res, "Falha ao recarregar gift card");
    }
  });

  //==========================================================================
  // ENDPOINTS DE MERCHANTS/CATEGORIAS (COMPONENTE: TRANSPARÊNCIA)
  //==========================================================================
  
  // Obter todas as categorias
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      handleError(error, res, "Falha ao obter categorias");
    }
  });
  
  // Criar categoria
  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      handleError(error, res, "Falha ao criar categoria");
    }
  });
  
  // Obter todos os merchants
  app.get("/api/merchants", async (req, res) => {
    try {
      const merchants = await storage.getAllMerchants();
      res.json(merchants);
    } catch (error) {
      handleError(error, res, "Falha ao obter merchants");
    }
  });
  
  // Obter merchant por ID
  app.get("/api/merchants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Formato de ID inválido" });
      }
      
      const merchant = await storage.getMerchant(id);
      if (!merchant) {
        return res.status(404).json({ message: "Merchant não encontrado" });
      }
      
      res.json(merchant);
    } catch (error) {
      handleError(error, res, "Falha ao obter merchant");
    }
  });
  
  // Criar merchant
  app.post("/api/merchants", async (req, res) => {
    try {
      const merchantData = insertMerchantSchema.parse(req.body);
      const newMerchant = await storage.createMerchant(merchantData);
      res.status(201).json(newMerchant);
    } catch (error) {
      handleError(error, res, "Falha ao criar merchant");
    }
  });
  
  // Obter merchants por categoria
  app.get("/api/merchants/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const merchants = await storage.getMerchantsByCategory(category);
      res.json(merchants);
    } catch (error) {
      handleError(error, res, "Falha ao obter merchants por categoria");
    }
  });

  //==========================================================================
  // ENDPOINTS DE USUÁRIOS
  //==========================================================================
  
  // Criar um usuário
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Verificar se o username já existe
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Nome de usuário já existe" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Criar notificação de boas-vindas
      await storage.createNotification({
        userId: newUser.id,
        type: "welcome",
        title: "Bem-vindo ao NFT Gift Card Marketplace!",
        message: "Conecte sua carteira para começar a comprar e resgatar gift cards NFT.",
        giftCardId: null
      });
      
      res.status(201).json(newUser);
    } catch (error) {
      handleError(error, res, "Falha ao criar usuário");
    }
  });
  
  // Obter usuário por ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Formato de ID inválido" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      res.json(user);
    } catch (error) {
      handleError(error, res, "Falha ao obter usuário");
    }
  });

  // Conectar carteira ao usuário
  app.post("/api/users/:userId/connect-wallet", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Formato de ID de usuário inválido" });
      }
      
      const walletSchema = z.object({
        walletAddress: z.string().min(1),
      });
      
      const { walletAddress } = walletSchema.parse(req.body);
      
      // Verificar se a carteira já está conectada a outro usuário
      const existingUser = await storage.getUserByWalletAddress(walletAddress);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({ message: "Carteira já está conectada a outro usuário" });
      }
      
      const updatedUser = await storage.connectWalletToUser(userId, walletAddress);
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Criar notificação
      await storage.createNotification({
        userId,
        type: "wallet",
        title: "Carteira Conectada",
        message: `Carteira ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)} conectada com sucesso`,
        giftCardId: null
      });
      
      // Dar pontos de recompensa pela primeira conexão
      await storage.updateUserRewardPoints(userId, 50);
      
      // Registrar recompensa
      await storage.createReward({
        userId,
        points: 50,
        type: "engagement",
        description: "Conectou carteira pela primeira vez",
        transactionId: null,
        expiresAt: null
      });
      
      res.json({
        user: updatedUser,
        rewardPoints: 50
      });
    } catch (error) {
      handleError(error, res, "Falha ao conectar carteira");
    }
  });

  //==========================================================================
  // ENDPOINTS DE TRANSAÇÕES
  //==========================================================================
  
  // Criar uma transação
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const newTransaction = await storage.createTransaction(transactionData);
      
      // Se for uma compra, dar pontos de recompensa (5% do valor em USD)
      if (transactionData.type === "purchase") {
        const rewardPoints = Math.floor(Number(transactionData.totalUsd) * 5);
        await storage.updateUserRewardPoints(transactionData.userId, rewardPoints);
        
        // Registrar recompensa
        await storage.createReward({
          userId: transactionData.userId,
          points: rewardPoints,
          type: "purchase",
          description: "Recompensa por compra de gift card",
          transactionId: newTransaction.id,
          expiresAt: null
        });
        
        // Criar notificação
        await storage.createNotification({
          userId: transactionData.userId,
          type: "purchase",
          title: "Compra Realizada com Sucesso",
          message: `Você ganhou ${rewardPoints} pontos de recompensa por sua compra!`,
          giftCardId: transactionData.giftCardId
        });
      }
      
      res.status(201).json(newTransaction);
    } catch (error) {
      handleError(error, res, "Falha ao criar transação");
    }
  });
  
  // Obter transações por usuário
  app.get("/api/users/:userId/transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Formato de ID de usuário inválido" });
      }
      
      const transactions = await storage.getTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      handleError(error, res, "Falha ao obter transações do usuário");
    }
  });
  
  // Obter transações por gift card
  app.get("/api/gift-cards/:giftCardId/transactions", async (req, res) => {
    try {
      const giftCardId = parseInt(req.params.giftCardId);
      if (isNaN(giftCardId)) {
        return res.status(400).json({ message: "Formato de ID de gift card inválido" });
      }
      
      const transactions = await storage.getTransactionsByGiftCardId(giftCardId);
      res.json(transactions);
    } catch (error) {
      handleError(error, res, "Falha ao obter transações do gift card");
    }
  });
  
  // Obter transações recentes
  app.get("/api/transactions/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const transactions = await storage.getRecentTransactions(limit);
      res.json(transactions);
    } catch (error) {
      handleError(error, res, "Falha ao obter transações recentes");
    }
  });

  //==========================================================================
  // ENDPOINTS DE ZK PROOFS (COMPONENTE: RESGATE)
  //==========================================================================
  
  // Criar prova ZK
  app.post("/api/zk-proofs", async (req, res) => {
    try {
      const proofData = insertZkProofSchema.parse(req.body);
      const newProof = await storage.createZkProof(proofData);
      
      // Criar notificação
      if (proofData.userId) {
        await storage.createNotification({
          userId: proofData.userId,
          type: "zk-proof",
          title: "ZK Proof Criada",
          message: "Sua prova zero-knowledge foi criada com sucesso e está pronta para uso.",
          giftCardId: proofData.giftCardId
        });
      }
      
      res.status(201).json(newProof);
    } catch (error) {
      handleError(error, res, "Falha ao criar prova ZK");
    }
  });
  
  // Verificar prova ZK
  app.post("/api/zk-proofs/:proofId/verify", async (req, res) => {
    try {
      const { proofId } = req.params;
      const verifySchema = z.object({
        verified: z.boolean(),
      });
      
      const { verified } = verifySchema.parse(req.body);
      
      const updatedProof = await storage.verifyZkProof(proofId, verified);
      if (!updatedProof) {
        return res.status(404).json({ message: "Prova ZK não encontrada" });
      }
      
      // Criar notificação
      if (updatedProof.userId) {
        await storage.createNotification({
          userId: updatedProof.userId,
          type: "zk-verify",
          title: verified ? "Prova ZK Verificada" : "Prova ZK Rejeitada",
          message: verified 
            ? "Sua prova zero-knowledge foi verificada com sucesso." 
            : "Sua prova zero-knowledge foi rejeitada. Por favor, tente novamente.",
          giftCardId: updatedProof.giftCardId
        });
      }
      
      res.json(updatedProof);
    } catch (error) {
      handleError(error, res, "Falha ao verificar prova ZK");
    }
  });
  
  // Usar prova ZK
  app.post("/api/zk-proofs/:proofId/use", async (req, res) => {
    try {
      const { proofId } = req.params;
      
      const updatedProof = await storage.useZkProof(proofId);
      if (!updatedProof) {
        return res.status(404).json({ message: "Prova ZK não encontrada" });
      }
      
      // Verificar se a prova foi verificada
      if (!updatedProof.verified) {
        return res.status(400).json({ message: "A prova ZK não foi verificada" });
      }
      
      // Criar notificação
      if (updatedProof.userId) {
        await storage.createNotification({
          userId: updatedProof.userId,
          type: "zk-used",
          title: "Prova ZK Utilizada",
          message: "Sua prova zero-knowledge foi utilizada com sucesso para resgatar o gift card.",
          giftCardId: updatedProof.giftCardId
        });
      }
      
      res.json(updatedProof);
    } catch (error) {
      handleError(error, res, "Falha ao usar prova ZK");
    }
  });
  
  // Obter provas ZK por gift card
  app.get("/api/gift-cards/:giftCardId/zk-proofs", async (req, res) => {
    try {
      const giftCardId = parseInt(req.params.giftCardId);
      if (isNaN(giftCardId)) {
        return res.status(400).json({ message: "Formato de ID de gift card inválido" });
      }
      
      const proofs = await storage.getZkProofsByGiftCardId(giftCardId);
      res.json(proofs);
    } catch (error) {
      handleError(error, res, "Falha ao obter provas ZK");
    }
  });

  //==========================================================================
  // ENDPOINTS DE NOTIFICAÇÕES (COMPONENTE: ENGAJAMENTO)
  //==========================================================================
  
  // Obter notificações do usuário
  app.get("/api/users/:userId/notifications", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Formato de ID de usuário inválido" });
      }
      
      const notifications = await storage.getNotificationsByUserId(userId);
      res.json(notifications);
    } catch (error) {
      handleError(error, res, "Falha ao obter notificações do usuário");
    }
  });
  
  // Marcar notificação como lida
  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Formato de ID inválido" });
      }
      
      const notification = await storage.markNotificationAsRead(id);
      if (!notification) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      
      res.json(notification);
    } catch (error) {
      handleError(error, res, "Falha ao marcar notificação como lida");
    }
  });
  
  // Obter contagem de notificações não lidas
  app.get("/api/users/:userId/notifications/unread-count", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Formato de ID de usuário inválido" });
      }
      
      const count = await storage.getUnreadNotificationsCount(userId);
      res.json({ count });
    } catch (error) {
      handleError(error, res, "Falha ao obter contagem de notificações não lidas");
    }
  });

  //==========================================================================
  // ENDPOINTS DE RECOMPENSAS (COMPONENTE: ENGAJAMENTO)
  //==========================================================================
  
  // Obter recompensas do usuário
  app.get("/api/users/:userId/rewards", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Formato de ID de usuário inválido" });
      }
      
      const rewards = await storage.getRewardsByUserId(userId);
      res.json(rewards);
    } catch (error) {
      handleError(error, res, "Falha ao obter recompensas do usuário");
    }
  });
  
  // Obter total de pontos de recompensa do usuário
  app.get("/api/users/:userId/reward-points", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Formato de ID de usuário inválido" });
      }
      
      const total = await storage.getTotalRewardPointsByUserId(userId);
      res.json({ total });
    } catch (error) {
      handleError(error, res, "Falha ao obter total de pontos de recompensa");
    }
  });
  
  // Criar recompensa
  app.post("/api/rewards", async (req, res) => {
    try {
      const rewardData = insertRewardSchema.parse(req.body);
      const newReward = await storage.createReward(rewardData);
      
      // Atualizar pontos do usuário
      await storage.updateUserRewardPoints(rewardData.userId, rewardData.points);
      
      // Criar notificação
      await storage.createNotification({
        userId: rewardData.userId,
        type: "reward",
        title: "Novos Pontos de Recompensa",
        message: `Você ganhou ${rewardData.points} pontos de recompensa! ${rewardData.description || ""}`,
        giftCardId: null
      });
      
      res.status(201).json(newReward);
    } catch (error) {
      handleError(error, res, "Falha ao criar recompensa");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
