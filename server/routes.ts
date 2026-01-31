import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { sendBulkEmails } from "./gmail";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault, isPayPalConfigured, calculateFees } from "./paypal";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Creator Routes

  // List creators
  app.get(api.creators.list.path, async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const niche = typeof req.query.niche === 'string' ? req.query.niche : undefined;
    const creators = await storage.getCreators(search, niche);
    res.json(creators);
  });

  // Get creator by handle
  app.get(api.creators.getByHandle.path, async (req, res) => {
    const handleParam = req.params.handle;
    const handle = typeof handleParam === 'string' ? handleParam : handleParam[0];
    const creator = await storage.getCreatorByHandle(handle);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    res.json(creator);
  });

  // Get current creator profile
  app.get(api.creators.me.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const creator = await storage.getCreatorByUserId(userId);
    if (!creator) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(creator);
  });

  // Update/Create current creator profile
  app.post(api.creators.updateMe.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    try {
      const input = api.creators.updateMe.input.parse(req.body);
      
      const existing = await storage.getCreatorByUserId(userId);
      let creator;
      
      if (existing) {
        creator = await storage.updateCreator(userId, input);
      } else {
        creator = await storage.createCreator({ ...input, userId });
      }
      
      res.json(creator);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      // Handle unique constraint violation (handle)
      if ((err as any).code === '23505') {
         return res.status(400).json({ message: "Handle already taken" });
      }
      throw err;
    }
  });

  // Brand Routes
  app.get(api.brands.me.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const brand = await storage.getBrandByUserId(userId);
    if (!brand) {
      return res.status(404).json({ message: "Brand profile not found" });
    }
    res.json(brand);
  });

  app.post(api.brands.updateMe.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    try {
      const input = api.brands.updateMe.input.parse(req.body);
      const existing = await storage.getBrandByUserId(userId);
      let brand;
      if (existing) {
        brand = await storage.updateBrand(userId, input);
      } else {
        brand = await storage.createBrand({ ...input, userId });
      }
      res.json(brand);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Get brand by userId (public)
  app.get("/api/brands/:userId", async (req, res) => {
    const userId = req.params.userId;
    const brand = await storage.getBrandByUserId(userId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(brand);
  });

  // Offer Routes
  app.get("/api/offers", async (req, res) => {
    const target = (req.query.target as string) || undefined;
    const offers = await storage.getOffers(target);
    res.json(offers);
  });

  // Message Routes
  app.get(api.messages.inbox.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const messages = await storage.getMessages(userId);
    res.json(messages);
  });

  app.get(api.messages.sent.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const messages = await storage.getSentMessages(userId);
    res.json(messages);
  });

  app.post(api.messages.send.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    try {
      const input = api.messages.send.input.parse(req.body);
      
      // Determine sender type
      const creatorProfile = await storage.getCreatorByUserId(userId);
      const brandProfile = await storage.getBrandByUserId(userId);
      const senderType = creatorProfile ? "creator" : brandProfile ? "brand" : "unknown";
      
      const message = await storage.createMessage({
        senderId: userId,
        receiverId: input.receiverId,
        senderType,
        receiverType: input.receiverType,
        subject: input.subject,
        content: input.content,
        createdAt: new Date().toISOString(),
      });

      // Create notification for receiver
      await storage.createNotification({
        userId: input.receiverId,
        type: "message",
        title: "New Message",
        content: `You received a new message: "${input.subject}"`,
        link: "/dashboard?tab=messages",
        createdAt: new Date().toISOString(),
      });

      res.json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post("/api/messages/:id/read", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const idParam = req.params.id;
    const id = parseInt(typeof idParam === 'string' ? idParam : idParam[0]);
    const message = await storage.markMessageRead(id, userId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(message);
  });

  // Notification Routes
  app.get(api.notifications.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const notifications = await storage.getNotifications(userId);
    res.json(notifications);
  });

  app.get(api.notifications.unreadCount.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const count = await storage.getUnreadCount(userId);
    res.json({ count });
  });

  app.post("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const idParam = req.params.id;
    const id = parseInt(typeof idParam === 'string' ? idParam : idParam[0]);
    const notification = await storage.markNotificationRead(id, userId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  });

  app.post(api.notifications.markAllRead.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    await storage.markAllNotificationsRead(userId);
    res.json({ success: true });
  });

  // Review Routes
  app.post(api.reviews.create.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    try {
      const input = api.reviews.create.input.parse(req.body);
      
      // Determine reviewer type
      const creatorProfile = await storage.getCreatorByUserId(userId);
      const brandProfile = await storage.getBrandByUserId(userId);
      const reviewerType = creatorProfile ? "creator" : brandProfile ? "brand" : "unknown";
      
      if (reviewerType === "unknown") {
        return res.status(400).json({ message: "You need a profile to leave reviews" });
      }
      
      // Prevent self-review
      if (userId === input.revieweeUserId) {
        return res.status(400).json({ message: "You cannot review yourself" });
      }
      
      const review = await storage.createReview({
        reviewerUserId: userId,
        revieweeUserId: input.revieweeUserId,
        reviewerType,
        revieweeType: input.revieweeType,
        rating: input.rating,
        title: input.title || null,
        body: input.body,
        createdAt: new Date().toISOString(),
      });

      // Create notification for reviewee
      await storage.createNotification({
        userId: input.revieweeUserId,
        type: "review",
        title: "New Review",
        content: `You received a ${input.rating}-star review!`,
        link: "/dashboard",
        createdAt: new Date().toISOString(),
      });

      res.json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.reviews.byCreator.path, async (req, res) => {
    const userIdParam = req.params.userId;
    const userId = typeof userIdParam === 'string' ? userIdParam : userIdParam[0];
    const reviews = await storage.getReviewsByCreatorUserId(userId);
    res.json(reviews);
  });

  app.get(api.reviews.byBrand.path, async (req, res) => {
    const userIdParam = req.params.userId;
    const userId = typeof userIdParam === 'string' ? userIdParam : userIdParam[0];
    const reviews = await storage.getReviewsByBrandUserId(userId);
    res.json(reviews);
  });

  app.get(api.reviews.myReviews.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const reviews = await storage.getReviewsByReviewer(userId);
    res.json(reviews);
  });

  app.get(api.reviews.summary.path, async (req, res) => {
    const userIdParam = req.params.userId;
    const userId = typeof userIdParam === 'string' ? userIdParam : userIdParam[0];
    const summary = await storage.getReviewSummary(userId);
    res.json(summary);
  });

  app.delete(api.reviews.delete.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const idParam = req.params.id;
    const id = parseInt(typeof idParam === 'string' ? idParam : idParam[0]);
    const deleted = await storage.deleteReview(id, userId);
    if (!deleted) {
      return res.status(404).json({ message: "Review not found or not authorized" });
    }
    res.json({ success: true });
  });

  // Admin endpoint to send broadcast emails to all users
  app.post("/api/admin/broadcast-email", isAuthenticated, async (req, res) => {
    try {
      const { subject, body } = req.body;
      
      if (!subject || !body) {
        return res.status(400).json({ message: "Subject and body are required" });
      }
      
      // Get all users with emails
      const allUsers = await storage.getAllUsersWithEmail();
      const emails = allUsers.map(u => u.email).filter((e): e is string => !!e);
      
      if (emails.length === 0) {
        return res.status(400).json({ message: "No users with email addresses found" });
      }
      
      const results = await sendBulkEmails(emails, subject, body);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      res.json({
        message: `Sent ${successCount} emails successfully, ${failCount} failed`,
        total: emails.length,
        successCount,
        failCount,
        details: results
      });
    } catch (error: any) {
      console.error("Broadcast email error:", error);
      res.status(500).json({ message: error.message || "Failed to send emails" });
    }
  });

  // PayPal Routes
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const { amount, currency, intent, recipientUserId, description } = req.body;
    
    // Store temporary data for when we capture the order
    (req as any).paymentContext = {
      payerUserId: userId,
      recipientUserId,
      description,
    };
    
    await createPaypalOrder(req, res);
  });

  // Secure capture endpoint that also records the transaction server-side
  app.post("/paypal/order/:orderID/capture", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const orderID = req.params.orderID as string;
    const { recipientUserId, description } = req.body;
    
    try {
      // Check if transaction already exists for this order
      const existingTransaction = await storage.getTransactionByPaypalOrderId(orderID);
      if (existingTransaction) {
        return res.status(400).json({ 
          error: "Transaction already recorded for this order",
          transaction: existingTransaction 
        });
      }

      // Capture the PayPal order - this modifies req/res, so we need to handle it differently
      // We'll call the capture function but intercept the response to get payment data
      const captureResponse = await new Promise<any>((resolve, reject) => {
        const originalJson = res.json.bind(res);
        const originalStatus = res.status.bind(res);
        let statusCode = 200;
        
        res.status = (code: number) => {
          statusCode = code;
          return res;
        };
        
        res.json = (data: any) => {
          if (statusCode >= 400) {
            reject(new Error(data.error || "PayPal capture failed"));
          } else {
            resolve(data);
          }
          return res;
        };
        
        capturePaypalOrder(req, res).catch(reject);
      });

      // Extract payment details from PayPal capture response
      const purchaseUnit = captureResponse.purchase_units?.[0];
      const captureDetails = purchaseUnit?.payments?.captures?.[0];
      
      if (!captureDetails) {
        return res.status(500).json({ error: "Failed to extract capture details from PayPal" });
      }

      // Get verified amount from PayPal (not from client)
      const verifiedAmount = parseFloat(captureDetails.amount?.value || "0");
      const verifiedCurrency = captureDetails.amount?.currency_code || "CAD";
      const captureId = captureDetails.id;
      const captureStatus = captureDetails.status;

      if (verifiedAmount <= 0) {
        return res.status(400).json({ error: "Invalid payment amount" });
      }

      // Calculate fees based on verified amount
      const { platformFee, creatorPayout } = calculateFees(verifiedAmount);

      // Record the transaction with verified PayPal data
      const transaction = await storage.createTransaction({
        paypalOrderId: orderID,
        payerUserId: userId,
        recipientUserId: recipientUserId || "platform", // Default to platform if no recipient
        amount: verifiedAmount.toFixed(2),
        currency: verifiedCurrency,
        platformFee: platformFee.toFixed(2),
        creatorPayout: creatorPayout.toFixed(2),
        status: captureStatus === "COMPLETED" ? "completed" : "pending",
        description: description || "Creator service payment",
        createdAt: new Date().toISOString(),
        completedAt: captureStatus === "COMPLETED" ? new Date().toISOString() : undefined,
      });

      res.json({
        ...captureResponse,
        transaction,
        feeBreakdown: {
          totalAmount: verifiedAmount.toFixed(2),
          platformFee: platformFee.toFixed(2),
          creatorPayout: creatorPayout.toFixed(2),
          platformFeePercentage: "20%",
        },
      });
    } catch (error: any) {
      console.error("Failed to capture order:", error);
      res.status(500).json({ error: error.message || "Failed to capture order" });
    }
  });

  // Get user's transactions
  app.get("/api/transactions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const transactions = await storage.getTransactionsByUser(userId);
      res.json(transactions);
    } catch (error: any) {
      console.error("Failed to fetch transactions:", error);
      res.status(500).json({ message: error.message || "Failed to fetch transactions" });
    }
  });

  // Campaign Routes
  // Get all active campaigns (public)
  app.get("/api/campaigns", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const campaigns = await storage.getCampaigns(status || "active");
      res.json(campaigns);
    } catch (error: any) {
      console.error("Failed to fetch campaigns:", error);
      res.status(500).json({ message: error.message || "Failed to fetch campaigns" });
    }
  });

  // Get a specific campaign
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaignById(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error: any) {
      console.error("Failed to fetch campaign:", error);
      res.status(500).json({ message: error.message || "Failed to fetch campaign" });
    }
  });

  // Get my campaigns (for brands)
  app.get("/api/campaigns/my/list", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const campaigns = await storage.getCampaignsByBrand(userId);
      res.json(campaigns);
    } catch (error: any) {
      console.error("Failed to fetch my campaigns:", error);
      res.status(500).json({ message: error.message || "Failed to fetch campaigns" });
    }
  });

  // Create a campaign (brands only)
  app.post("/api/campaigns", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      
      // Check if user has a brand profile
      const brand = await storage.getBrandByUserId(userId);
      if (!brand) {
        return res.status(403).json({ message: "Only brands can create campaigns" });
      }

      const campaignData = {
        ...req.body,
        brandUserId: userId,
        createdAt: new Date().toISOString(),
      };

      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error: any) {
      console.error("Failed to create campaign:", error);
      res.status(500).json({ message: error.message || "Failed to create campaign" });
    }
  });

  // Update a campaign
  app.patch("/api/campaigns/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const idParam = req.params.id;
      const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);

      const campaign = await storage.updateCampaign(id, userId, req.body);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found or you don't have permission" });
      }
      res.json(campaign);
    } catch (error: any) {
      console.error("Failed to update campaign:", error);
      res.status(500).json({ message: error.message || "Failed to update campaign" });
    }
  });

  // Delete a campaign
  app.delete("/api/campaigns/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const idParam = req.params.id;
      const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);

      const deleted = await storage.deleteCampaign(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Campaign not found or you don't have permission" });
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to delete campaign:", error);
      res.status(500).json({ message: error.message || "Failed to delete campaign" });
    }
  });

  return httpServer;
}

// Seed function
async function seedDatabase() {
  const existingCreators = await storage.getCreators();
  if (existingCreators.length === 0) {
    await storage.createCreator({
      userId: "seed-user-1",
      handle: "sarahfitness",
      name: "Sarah Jenkins",
      bio: "Certified personal trainer and nutrition coach. Helping you build a sustainable lifestyle.",
      niches: ["fitness", "health", "lifestyle"],
      socialLinks: { instagram: "https://instagram.com", tiktok: "https://tiktok.com" },
      portfolio: [
        { id: "1", title: "HIIT Workout Reel", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { id: "2", title: "Meal Prep Guide", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
      ],
      profileImage: "https://images.unsplash.com/photo-1594381898411-85a769805445?w=400&h=400&fit=crop"
    });

    await storage.createCreator({
      userId: "seed-user-2",
      handle: "techwithalex",
      name: "Alex Rivera",
      bio: "Tech reviewer and gadget enthusiast. Unboxing the future, one device at a time.",
      niches: ["tech", "gaming", "reviews"],
      socialLinks: { youtube: "https://youtube.com", instagram: "https://instagram.com" },
      portfolio: [
        { id: "1", title: "iPhone 15 Review", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
      ],
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    });
    
    await storage.createCreator({
      userId: "seed-user-3",
      handle: "travelbug",
      name: "Emma Wong",
      bio: "Backpacking across Asia. Sharing hidden gems and budget travel tips.",
      niches: ["travel", "photography", "food"],
      socialLinks: { tiktok: "https://tiktok.com" },
      portfolio: [],
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    });
  }

  const existingOffers = await storage.getOffers();
  if (existingOffers.length === 0) {
    await storage.createOffer({
      target: "creator",
      title: "Creator Pro Launch Offer",
      description: "Get verified and unlock advanced analytics with our partner program.",
      discount: "50% OFF",
      code: "TRUENORTH50",
    });

    await storage.createOffer({
      target: "brand",
      title: "Brand Enterprise Pilot",
      description: "Exclusive access to our AI matching engine for your first campaign.",
      discount: "FREE MONTH",
      code: "OFFICIAL2026",
    });
  }
}

// Call seed in a timeout to ensure DB is ready
setTimeout(seedDatabase, 5000);
