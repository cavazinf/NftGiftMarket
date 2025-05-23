import { InsertGiftCard, GiftCard, InsertTransaction, Transaction, InsertUser, User, InsertCategory, Category } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  connectWalletToUser(userId: number, walletAddress: string): Promise<User | undefined>;

  // Gift card operations
  getAllGiftCards(): Promise<GiftCard[]>;
  getGiftCardById(id: number): Promise<GiftCard | undefined>;
  getGiftCardsByCategory(category: string): Promise<GiftCard[]>;
  createGiftCard(giftCard: InsertGiftCard): Promise<GiftCard>;

  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private giftCards: Map<number, GiftCard>;
  private transactions: Map<number, Transaction>;
  private categories: Map<number, Category>;
  
  private userIdCounter: number;
  private giftCardIdCounter: number;
  private transactionIdCounter: number;
  private categoryIdCounter: number;

  constructor() {
    this.users = new Map();
    this.giftCards = new Map();
    this.transactions = new Map();
    this.categories = new Map();
    
    this.userIdCounter = 1;
    this.giftCardIdCounter = 1;
    this.transactionIdCounter = 1;
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
    ];

    defaultCategories.forEach(category => {
      const id = this.categoryIdCounter++;
      this.categories.set(id, {
        id,
        name: category.name,
        displayName: category.displayName,
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

  async createGiftCard(insertGiftCard: InsertGiftCard): Promise<GiftCard> {
    const id = this.giftCardIdCounter++;
    const now = new Date();
    const giftCard: GiftCard = { 
      ...insertGiftCard, 
      id, 
      createdAt: now 
    };
    this.giftCards.set(id, giftCard);
    return giftCard;
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

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
}

export const storage = new MemStorage();
