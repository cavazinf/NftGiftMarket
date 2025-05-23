import { 
  InsertGiftCard, GiftCard, 
  InsertTransaction, Transaction, 
  InsertUser, User, 
  InsertCategory, Category, 
  InsertMerchant, Merchant,
  InsertZkProof, ZkProof,
  InsertNotification, Notification,
  InsertReward, Reward,
  merchants, users, giftCards, transactions, categories, zkProofs, notifications, rewards
} from "@shared/schema";
import { db } from './db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { PostgresError } from 'postgres';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  connectWalletToUser(userId: number, walletAddress: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  updateUserRewardPoints(userId: number, points: number): Promise<User | undefined>;

  // Merchant operations
  getMerchant(id: number): Promise<Merchant | undefined>;
  getMerchantByName(name: string): Promise<Merchant | undefined>;
  createMerchant(merchant: InsertMerchant): Promise<Merchant>;
  getMerchantsByCategory(category: string): Promise<Merchant[]>;
  getAllMerchants(): Promise<Merchant[]>;

  // Gift card operations
  getAllGiftCards(): Promise<GiftCard[]>;
  getGiftCardById(id: number): Promise<GiftCard | undefined>;
  getGiftCardsByCategory(category: string): Promise<GiftCard[]>;
  getGiftCardsByMerchant(merchantId: number): Promise<GiftCard[]>;
  createGiftCard(giftCard: InsertGiftCard): Promise<GiftCard>;
  updateGiftCardBalance(id: number, balanceEth: number, balanceUsd: number): Promise<GiftCard | undefined>;
  getRechargeableGiftCards(): Promise<GiftCard[]>;
  getPrivacyEnabledGiftCards(): Promise<GiftCard[]>;

  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getTransactionsByGiftCardId(giftCardId: number): Promise<Transaction[]>;
  getRecentTransactions(limit?: number): Promise<Transaction[]>;

  // ZK Proof operations
  createZkProof(proof: InsertZkProof): Promise<ZkProof>;
  getZkProofById(id: number): Promise<ZkProof | undefined>;
  getZkProofsByGiftCardId(giftCardId: number): Promise<ZkProof[]>;
  verifyZkProof(proofId: string, verified: boolean): Promise<ZkProof | undefined>;
  useZkProof(proofId: string): Promise<ZkProof | undefined>;

  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  getUnreadNotificationsCount(userId: number): Promise<number>;

  // Reward operations
  createReward(reward: InsertReward): Promise<Reward>;
  getRewardsByUserId(userId: number): Promise<Reward[]>;
  getTotalRewardPointsByUserId(userId: number): Promise<number>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
}

// Implementação principal com banco de dados PostgreSQL
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      if (error instanceof PostgresError && error.code === '23505') {
        throw new Error('Username já existe');
      }
      throw error;
    }
  }

  async connectWalletToUser(userId: number, walletAddress: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ walletAddress })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user;
  }

  async updateUserRewardPoints(userId: number, points: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        rewardPoints: sql`${users.rewardPoints} + ${points}` 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Merchant operations
  async getMerchant(id: number): Promise<Merchant | undefined> {
    const [merchant] = await db.select().from(merchants).where(eq(merchants.id, id));
    return merchant;
  }

  async getMerchantByName(name: string): Promise<Merchant | undefined> {
    const [merchant] = await db.select().from(merchants).where(eq(merchants.name, name));
    return merchant;
  }

  async createMerchant(insertMerchant: InsertMerchant): Promise<Merchant> {
    try {
      const [merchant] = await db.insert(merchants).values(insertMerchant).returning();
      return merchant;
    } catch (error) {
      if (error instanceof PostgresError && error.code === '23505') {
        throw new Error('Merchant já existe');
      }
      throw error;
    }
  }

  async getMerchantsByCategory(category: string): Promise<Merchant[]> {
    // Busca merchants que tenham a categoria especificada no array de categorias
    const merchantsList = await db
      .select()
      .from(merchants)
      .where(sql`${category} = ANY(${merchants.categories})`);
    return merchantsList;
  }

  async getAllMerchants(): Promise<Merchant[]> {
    return db.select().from(merchants);
  }

  // Gift card operations
  async getAllGiftCards(): Promise<GiftCard[]> {
    return db.select().from(giftCards);
  }

  async getGiftCardById(id: number): Promise<GiftCard | undefined> {
    const [giftCard] = await db.select().from(giftCards).where(eq(giftCards.id, id));
    return giftCard;
  }

  async getGiftCardsByCategory(category: string): Promise<GiftCard[]> {
    return db.select().from(giftCards).where(eq(giftCards.category, category));
  }

  async getGiftCardsByMerchant(merchantId: number): Promise<GiftCard[]> {
    return db.select().from(giftCards).where(eq(giftCards.merchantId, merchantId));
  }

  async createGiftCard(insertGiftCard: InsertGiftCard): Promise<GiftCard> {
    const [giftCard] = await db.insert(giftCards).values(insertGiftCard).returning();
    return giftCard;
  }

  async updateGiftCardBalance(id: number, balanceEth: number, balanceUsd: number): Promise<GiftCard | undefined> {
    const [giftCard] = await db
      .update(giftCards)
      .set({ 
        balanceEth: balanceEth,
        balanceUsd: balanceUsd,
        totalRecharges: sql`${giftCards.totalRecharges} + 1`
      })
      .where(eq(giftCards.id, id))
      .returning();
    return giftCard;
  }

  async getRechargeableGiftCards(): Promise<GiftCard[]> {
    return db.select().from(giftCards).where(eq(giftCards.isRechargeable, true));
  }

  async getPrivacyEnabledGiftCards(): Promise<GiftCard[]> {
    return db.select().from(giftCards).where(eq(giftCards.hasZkPrivacy, true));
  }

  // Transaction operations
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async getTransactionsByGiftCardId(giftCardId: number): Promise<Transaction[]> {
    return db.select().from(transactions).where(eq(transactions.giftCardId, giftCardId));
  }

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    return db.select()
      .from(transactions)
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  // ZK Proof operations
  async createZkProof(insertZkProof: InsertZkProof): Promise<ZkProof> {
    const [zkProof] = await db.insert(zkProofs).values(insertZkProof).returning();
    return zkProof;
  }

  async getZkProofById(id: number): Promise<ZkProof | undefined> {
    const [zkProof] = await db.select().from(zkProofs).where(eq(zkProofs.id, id));
    return zkProof;
  }

  async getZkProofsByGiftCardId(giftCardId: number): Promise<ZkProof[]> {
    return db.select().from(zkProofs).where(eq(zkProofs.giftCardId, giftCardId));
  }

  async verifyZkProof(proofId: string, verified: boolean): Promise<ZkProof | undefined> {
    const [zkProof] = await db
      .update(zkProofs)
      .set({ verified })
      .where(eq(zkProofs.proofId, proofId))
      .returning();
    return zkProof;
  }

  async useZkProof(proofId: string): Promise<ZkProof | undefined> {
    const now = new Date();
    const [zkProof] = await db
      .update(zkProofs)
      .set({ usedAt: now })
      .where(eq(zkProofs.proofId, proofId))
      .returning();
    return zkProof;
  }

  // Notification operations
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [notification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
    return result[0]?.count || 0;
  }

  // Reward operations
  async createReward(insertReward: InsertReward): Promise<Reward> {
    const [reward] = await db.insert(rewards).values(insertReward).returning();
    return reward;
  }

  async getRewardsByUserId(userId: number): Promise<Reward[]> {
    return db
      .select()
      .from(rewards)
      .where(eq(rewards.userId, userId))
      .orderBy(desc(rewards.createdAt));
  }

  async getTotalRewardPointsByUserId(userId: number): Promise<number> {
    const result = await db
      .select({ total: sql<number>`sum(${rewards.points})` })
      .from(rewards)
      .where(eq(rewards.userId, userId));
    return result[0]?.total || 0;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.name, name));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      const [category] = await db.insert(categories).values(insertCategory).returning();
      return category;
    } catch (error) {
      if (error instanceof PostgresError && error.code === '23505') {
        throw new Error('Categoria já existe');
      }
      throw error;
    }
  }
}

// Implementação temporária com armazenamento em memória (para uso durante desenvolvimento)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private merchants: Map<number, Merchant>;
  private giftCards: Map<number, GiftCard>;
  private transactions: Map<number, Transaction>;
  private zkProofs: Map<number, ZkProof>;
  private notifications: Map<number, Notification>;
  private rewards: Map<number, Reward>;
  private categories: Map<number, Category>;
  
  private userIdCounter: number;
  private merchantIdCounter: number;
  private giftCardIdCounter: number;
  private transactionIdCounter: number;
  private zkProofIdCounter: number;
  private notificationIdCounter: number;
  private rewardIdCounter: number;
  private categoryIdCounter: number;

  constructor() {
    this.users = new Map();
    this.merchants = new Map();
    this.giftCards = new Map();
    this.transactions = new Map();
    this.zkProofs = new Map();
    this.notifications = new Map();
    this.rewards = new Map();
    this.categories = new Map();
    
    this.userIdCounter = 1;
    this.merchantIdCounter = 1;
    this.giftCardIdCounter = 1;
    this.transactionIdCounter = 1;
    this.zkProofIdCounter = 1;
    this.notificationIdCounter = 1;
    this.rewardIdCounter = 1;
    this.categoryIdCounter = 1;
    
    // Initialize with some default categories
    this.initializeCategories();
  }

  private initializeCategories() {
    const defaultCategories = [
      { name: "gaming", displayName: "Gaming" },
      { name: "restaurants", displayName: "Restaurants" },
      { name: "travel", displayName: "Travel" },
      { name: "shopping", displayName: "Shopping" },
      { name: "entertainment", displayName: "Entertainment" },
      { name: "subscription", displayName: "Subscription" },
      { name: "services", displayName: "Services" },
      { name: "defi", displayName: "DeFi" },
      { name: "nft", displayName: "NFT Collectibles" },
    ];

    defaultCategories.forEach(category => {
      const id = this.categoryIdCounter++;
      this.categories.set(id, {
        id,
        name: category.name,
        displayName: category.displayName,
        icon: null
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      rewardPoints: 0,
      role: 'user',
      profilePic: null,
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }

  async connectWalletToUser(userId: number, walletAddress: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) {
      return undefined;
    }
    
    const updatedUser: User = {
      ...user,
      walletAddress,
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async updateUserRewardPoints(userId: number, points: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) {
      return undefined;
    }
    
    const updatedUser: User = {
      ...user,
      rewardPoints: (user.rewardPoints || 0) + points,
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Merchant operations
  async getMerchant(id: number): Promise<Merchant | undefined> {
    return this.merchants.get(id);
  }

  async getMerchantByName(name: string): Promise<Merchant | undefined> {
    return Array.from(this.merchants.values()).find(
      (merchant) => merchant.name === name,
    );
  }

  async createMerchant(insertMerchant: InsertMerchant): Promise<Merchant> {
    const id = this.merchantIdCounter++;
    const now = new Date();
    const merchant: Merchant = { 
      ...insertMerchant, 
      id, 
      commissionRate: insertMerchant.commissionRate || "0.01",
      joinDate: now,
      createdAt: now 
    };
    this.merchants.set(id, merchant);
    return merchant;
  }

  async getMerchantsByCategory(category: string): Promise<Merchant[]> {
    return Array.from(this.merchants.values()).filter(
      (merchant) => merchant.categories && merchant.categories.includes(category)
    );
  }

  async getAllMerchants(): Promise<Merchant[]> {
    return Array.from(this.merchants.values());
  }

  // Gift card operations
  async getAllGiftCards(): Promise<GiftCard[]> {
    return Array.from(this.giftCards.values());
  }

  async getGiftCardById(id: number): Promise<GiftCard | undefined> {
    return this.giftCards.get(id);
  }

  async getGiftCardsByCategory(category: string): Promise<GiftCard[]> {
    return Array.from(this.giftCards.values()).filter(
      (giftCard) => giftCard.category === category
    );
  }

  async getGiftCardsByMerchant(merchantId: number): Promise<GiftCard[]> {
    return Array.from(this.giftCards.values()).filter(
      (giftCard) => giftCard.merchantId === merchantId
    );
  }

  async createGiftCard(insertGiftCard: InsertGiftCard): Promise<GiftCard> {
    const id = this.giftCardIdCounter++;
    const now = new Date();
    const giftCard: GiftCard = { 
      ...insertGiftCard, 
      id, 
      totalRecharges: 0,
      createdAt: now 
    };
    this.giftCards.set(id, giftCard);
    return giftCard;
  }

  async updateGiftCardBalance(id: number, balanceEth: number, balanceUsd: number): Promise<GiftCard | undefined> {
    const giftCard = this.giftCards.get(id);
    if (!giftCard) {
      return undefined;
    }
    
    const updatedGiftCard: GiftCard = {
      ...giftCard,
      balanceEth,
      balanceUsd,
      totalRecharges: (giftCard.totalRecharges || 0) + 1,
    };
    
    this.giftCards.set(id, updatedGiftCard);
    return updatedGiftCard;
  }

  async getRechargeableGiftCards(): Promise<GiftCard[]> {
    return Array.from(this.giftCards.values()).filter(
      (giftCard) => giftCard.isRechargeable
    );
  }

  async getPrivacyEnabledGiftCards(): Promise<GiftCard[]> {
    return Array.from(this.giftCards.values()).filter(
      (giftCard) => giftCard.hasZkPrivacy
    );
  }

  // Transaction operations
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: now 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }

  async getTransactionsByGiftCardId(giftCardId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.giftCardId === giftCardId
    );
  }

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // ZK Proof operations
  async createZkProof(insertZkProof: InsertZkProof): Promise<ZkProof> {
    const id = this.zkProofIdCounter++;
    const now = new Date();
    const proofId = `zk-proof-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    const zkProof: ZkProof = { 
      ...insertZkProof, 
      id,
      proofId,
      verified: false,
      usedAt: null,
      createdAt: now 
    };
    this.zkProofs.set(id, zkProof);
    return zkProof;
  }

  async getZkProofById(id: number): Promise<ZkProof | undefined> {
    return this.zkProofs.get(id);
  }

  async getZkProofsByGiftCardId(giftCardId: number): Promise<ZkProof[]> {
    return Array.from(this.zkProofs.values()).filter(
      (zkProof) => zkProof.giftCardId === giftCardId
    );
  }

  async verifyZkProof(proofId: string, verified: boolean): Promise<ZkProof | undefined> {
    const zkProof = Array.from(this.zkProofs.values()).find(
      (zkProof) => zkProof.proofId === proofId
    );
    
    if (!zkProof) {
      return undefined;
    }
    
    const updatedZkProof: ZkProof = {
      ...zkProof,
      verified,
    };
    
    this.zkProofs.set(zkProof.id, updatedZkProof);
    return updatedZkProof;
  }

  async useZkProof(proofId: string): Promise<ZkProof | undefined> {
    const zkProof = Array.from(this.zkProofs.values()).find(
      (zkProof) => zkProof.proofId === proofId
    );
    
    if (!zkProof) {
      return undefined;
    }
    
    const updatedZkProof: ZkProof = {
      ...zkProof,
      usedAt: new Date(),
    };
    
    this.zkProofs.set(zkProof.id, updatedZkProof);
    return updatedZkProof;
  }

  // Notification operations
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    const notification: Notification = { 
      ...insertNotification, 
      id,
      isRead: false,
      createdAt: now 
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) {
      return undefined;
    }
    
    const updatedNotification: Notification = {
      ...notification,
      isRead: true,
    };
    
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId && !notification.isRead
    ).length;
  }

  // Reward operations
  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = this.rewardIdCounter++;
    const now = new Date();
    const reward: Reward = { 
      ...insertReward, 
      id,
      createdAt: now 
    };
    this.rewards.set(id, reward);
    return reward;
  }

  async getRewardsByUserId(userId: number): Promise<Reward[]> {
    return Array.from(this.rewards.values())
      .filter((reward) => reward.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTotalRewardPointsByUserId(userId: number): Promise<number> {
    return Array.from(this.rewards.values())
      .filter((reward) => reward.userId === userId)
      .reduce((total, reward) => total + reward.points, 0);
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.name === name
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    // Verificar se já existe uma categoria com o mesmo nome
    const existingCategory = await this.getCategoryByName(insertCategory.name);
    if (existingCategory) {
      throw new Error('Categoria já existe');
    }
    
    const id = this.categoryIdCounter++;
    const category: Category = { 
      ...insertCategory, 
      id,
    };
    this.categories.set(id, category);
    return category;
  }
}

// Usa a implementação de banco de dados por padrão, mas pode ser substituída pela MemStorage para testes
export const storage = new DatabaseStorage();
