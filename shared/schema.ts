import { pgTable, text, serial, integer, boolean, numeric, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  email: text("email"),
  profilePic: text("profile_pic"),
  role: text("role").default("user"),
  rewardPoints: integer("reward_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Merchants schema (empresas que emitem gift cards)
export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  description: text("description"),
  walletAddress: text("wallet_address").notNull(),
  website: text("website"),
  isVerified: boolean("is_verified").default(false),
  categories: text("categories").array(),
  supportedBlockchains: text("supported_blockchains").array(),
  acceptsStablecoins: boolean("accepts_stablecoins").default(true),
  commissionRate: numeric("commission_rate").default("0.01"),
  joinDate: timestamp("join_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// NFT Gift Card schema
export const giftCards = pgTable("gift_cards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  priceEth: numeric("price_eth").notNull(),
  priceUsd: numeric("price_usd").notNull(),
  balanceEth: numeric("balance_eth"), // Saldo atual do cartão
  balanceUsd: numeric("balance_usd"), // Saldo atual em USD
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  isRechargeable: boolean("is_rechargeable").default(true),
  hasZkPrivacy: boolean("has_zk_privacy").default(false),
  contractAddress: text("contract_address"),
  tokenId: text("token_id"),
  blockchain: text("blockchain").default("Ethereum"),
  standard: text("standard").default("ERC-721"),
  creationCost: numeric("creation_cost"), // Custo de minting do cartão
  totalRecharges: integer("total_recharges").default(0),
  expirationDate: timestamp("expiration_date"),
  createdAt: timestamp("created_at").defaultNow(),
  merchantId: integer("merchant_id").references(() => merchants.id),
  sellerId: integer("seller_id").references(() => users.id),
  benefits: jsonb("benefits"), // Benefícios fornecidos pelo cartão
});

// Transactions schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  giftCardId: integer("gift_card_id").references(() => giftCards.id).notNull(),
  type: text("type").notNull(), // "purchase", "recharge", "redeem"
  quantity: integer("quantity").notNull().default(1),
  totalEth: numeric("total_eth").notNull(),
  totalUsd: numeric("total_usd").notNull(),
  status: text("status").notNull().default("completed"),
  transactionHash: text("transaction_hash"),
  merchantId: integer("merchant_id").references(() => merchants.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// ZK Proofs schema - armazena informações de provas zero-knowledge
export const zkProofs = pgTable("zk_proofs", {
  id: serial("id").primaryKey(),
  proofId: uuid("proof_id").defaultRandom().notNull(),
  userId: integer("user_id").references(() => users.id),
  giftCardId: integer("gift_card_id").references(() => giftCards.id).notNull(),
  proofType: text("proof_type").notNull(), // "balance", "ownership"
  proofHash: text("proof_hash").notNull(),
  publicSignals: jsonb("public_signals"), // Sinais públicos (sem revelar valores reais)
  verified: boolean("verified").default(false),
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications schema - notificações de recarga, expiração etc
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  giftCardId: integer("gift_card_id").references(() => giftCards.id),
  type: text("type").notNull(), // "expiration", "recharge", "promo"
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  icon: text("icon"),
});

// Cashback / Rewards schema - sistema de recompensas
export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  points: integer("points").notNull(),
  type: text("type").notNull(), // "purchase", "referral", "engagement"
  transactionId: integer("transaction_id").references(() => transactions.id),
  description: text("description"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  rewardPoints: true,
});

export const insertMerchantSchema = createInsertSchema(merchants).omit({
  id: true,
  createdAt: true,
  joinDate: true,
});

export const insertGiftCardSchema = createInsertSchema(giftCards).omit({
  id: true,
  createdAt: true,
  totalRecharges: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertZkProofSchema = createInsertSchema(zkProofs).omit({
  id: true,
  createdAt: true,
  proofId: true,
  verified: true,
  usedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMerchant = z.infer<typeof insertMerchantSchema>;
export type Merchant = typeof merchants.$inferSelect;

export type InsertGiftCard = z.infer<typeof insertGiftCardSchema>;
export type GiftCard = typeof giftCards.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertZkProof = z.infer<typeof insertZkProofSchema>;
export type ZkProof = typeof zkProofs.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;
