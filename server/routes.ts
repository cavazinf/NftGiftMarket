import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGiftCardSchema, insertUserSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all gift cards
  app.get("/api/gift-cards", async (req, res) => {
    try {
      const giftCards = await storage.getAllGiftCards();
      res.json(giftCards);
    } catch (error) {
      console.error("Error fetching gift cards:", error);
      res.status(500).json({ message: "Failed to fetch gift cards" });
    }
  });

  // Get gift card by ID
  app.get("/api/gift-cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const giftCard = await storage.getGiftCardById(id);
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card not found" });
      }
      
      res.json(giftCard);
    } catch (error) {
      console.error("Error fetching gift card:", error);
      res.status(500).json({ message: "Failed to fetch gift card" });
    }
  });

  // Get gift cards by category
  app.get("/api/gift-cards/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const giftCards = await storage.getGiftCardsByCategory(category);
      res.json(giftCards);
    } catch (error) {
      console.error("Error fetching gift cards by category:", error);
      res.status(500).json({ message: "Failed to fetch gift cards by category" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Create a gift card
  app.post("/api/gift-cards", async (req, res) => {
    try {
      const giftCardData = insertGiftCardSchema.parse(req.body);
      const newGiftCard = await storage.createGiftCard(giftCardData);
      res.status(201).json(newGiftCard);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid gift card data", 
          errors: error.errors 
        });
      }
      console.error("Error creating gift card:", error);
      res.status(500).json({ message: "Failed to create gift card" });
    }
  });

  // Create a user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: error.errors 
        });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Create a transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const newTransaction = await storage.createTransaction(transactionData);
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid transaction data", 
          errors: error.errors 
        });
      }
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Get transactions by user ID
  app.get("/api/users/:userId/transactions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }
      
      const transactions = await storage.getTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      res.status(500).json({ message: "Failed to fetch user transactions" });
    }
  });

  // Connect wallet to user
  app.post("/api/users/:userId/connect-wallet", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }
      
      const walletSchema = z.object({
        walletAddress: z.string().min(1),
      });
      
      const { walletAddress } = walletSchema.parse(req.body);
      
      const updatedUser = await storage.connectWalletToUser(userId, walletAddress);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid wallet data", 
          errors: error.errors 
        });
      }
      console.error("Error connecting wallet:", error);
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
