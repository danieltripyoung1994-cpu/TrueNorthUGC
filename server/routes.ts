import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { registerChatRoutes } from "./replit_integrations/chat";
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

  // Object Storage routes for file uploads
  registerObjectStorageRoutes(app);

  // AI Chat routes for the assistant
  registerChatRoutes(app);

  // Analytics endpoints (fire-and-forget, no response needed)
  app.post("/api/analytics/vitals", (req, res) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] Web Vitals:", req.body);
    }
    res.status(204).send();
  });

  app.post("/api/analytics/experiment", (req, res) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] A/B Experiment:", req.body);
    }
    res.status(204).send();
  });

  app.post("/api/feedback", (req, res) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Feedback] Received:", req.body);
    }
    res.status(204).send();
  });

  // Admin endpoint to permanently delete seed/test creators
  app.delete("/api/admin/cleanup-seed-creators", async (req, res) => {
    try {
      const seedUserIds = ['seed-user-1', 'seed-user-2', 'seed-user-3'];
      let deletedCount = 0;
      
      for (const userId of seedUserIds) {
        const deleted = await storage.deleteCreatorByUserId(userId);
        if (deleted) deletedCount++;
      }
      
      res.json({ success: true, message: `Deleted ${deletedCount} seed creators` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

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

  // Brand tier feature endpoints
  app.get("/api/brands/tier/features", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const brand = await storage.getBrandByUserId(userId);
    if (!brand) {
      return res.status(404).json({ message: "Brand profile not found" });
    }
    
    const { BRAND_TIER_FEATURES } = await import("@shared/schema");
    const tier = (brand.tier || "starter") as keyof typeof BRAND_TIER_FEATURES;
    const features = BRAND_TIER_FEATURES[tier];
    
    res.json({
      currentTier: tier,
      features,
      allTiers: BRAND_TIER_FEATURES,
    });
  });

  // Upgrade brand tier (after successful payment)
  const tierUpgradeSchema = z.object({
    tier: z.enum(["starter", "growth", "premium"]),
    paypalOrderId: z.string().min(1, "PayPal order ID is required"),
  });
  
  app.post("/api/brands/tier/upgrade", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    
    // Validate input
    const parseResult = tierUpgradeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ 
        message: parseResult.error.errors[0].message,
        errors: parseResult.error.errors 
      });
    }
    
    const { tier, paypalOrderId } = parseResult.data;
    
    const brand = await storage.getBrandByUserId(userId);
    if (!brand) {
      return res.status(404).json({ message: "Brand profile not found" });
    }
    
    // Verify PayPal order exists and is completed
    const transaction = await storage.getTransactionByPaypalOrderId(paypalOrderId);
    if (!transaction) {
      return res.status(400).json({ message: "Payment not found. Please complete payment first." });
    }
    
    if (transaction.status !== "completed") {
      return res.status(400).json({ message: "Payment not completed. Please complete payment first." });
    }
    
    // Verify the payment amount matches the tier price
    const { BRAND_TIER_FEATURES } = await import("@shared/schema");
    const tierFeatures = BRAND_TIER_FEATURES[tier];
    const paidAmount = parseFloat(transaction.amount);
    
    if (paidAmount < tierFeatures.price) {
      return res.status(400).json({ 
        message: `Payment amount ($${paidAmount}) does not match tier price ($${tierFeatures.price})` 
      });
    }
    
    // Update brand tier
    const updatedBrand = await storage.updateBrandTier(userId, tier, paypalOrderId);
    res.json(updatedBrand);
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

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Log the contact message (could also store in database or send email)
      console.log("Contact form submission:", { name, email, subject, message, timestamp: new Date().toISOString() });
      
      // Send email notification to platform owner
      try {
        const { sendEmail } = await import("./gmail");
        await sendEmail(
          "TrueNorthUGCcanada@gmail.com",
          `Contact Form: ${subject}`,
          `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr />
            <p style="color: #666; font-size: 12px;">Sent from TrueNorthUGC Contact Form</p>
          </div>`
        );
      } catch (emailError) {
        console.error("Failed to send contact email:", emailError);
        // Continue without failing - message is logged
      }
      
      res.json({ success: true, message: "Your message has been received. We'll get back to you soon!" });
    } catch (error: any) {
      console.error("Failed to process contact form:", error);
      res.status(500).json({ message: error.message || "Failed to send message" });
    }
  });

  // Admin: Get all users with emails
  app.get("/api/admin/users", isAuthenticated, async (req, res) => {
    try {
      const users = await storage.getAllUsersWithEmail();
      res.json(users);
    } catch (error: any) {
      console.error("Failed to get users:", error);
      res.status(500).json({ message: error.message || "Failed to get users" });
    }
  });

  // Admin: Send announcement email to all users
  app.post("/api/admin/send-announcement", isAuthenticated, async (req, res) => {
    try {
      const { subject, htmlBody } = req.body;
      
      if (!subject || !htmlBody) {
        return res.status(400).json({ message: "Subject and htmlBody are required" });
      }

      const users = await storage.getAllUsersWithEmail();
      const validEmails = users
        .filter(u => u.email && !u.email.includes('@example.com') && !u.email.includes('@test.com'))
        .map(u => u.email as string);

      if (validEmails.length === 0) {
        return res.status(400).json({ message: "No valid user emails found" });
      }

      const results = await sendBulkEmails(validEmails, subject, htmlBody);
      res.json({ 
        sent: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results 
      });
    } catch (error: any) {
      console.error("Failed to send announcement:", error);
      res.status(500).json({ message: error.message || "Failed to send announcement" });
    }
  });

  // Platform stats endpoint (public)
  app.get("/api/stats", async (req, res) => {
    try {
      const creators = await storage.getCreators();
      const campaigns = await storage.getCampaigns();
      
      const completedCampaigns = campaigns.filter(c => c.status === "completed").length;
      // Estimate total paid based on completed campaigns with budgets
      const totalPaidOut = campaigns
        .filter(c => c.status === "completed" && c.budget)
        .reduce((sum, c) => sum + parseInt(c.budget?.replace(/[^0-9]/g, "") || "0"), 0);
      
      res.json({
        totalCreators: creators.length,
        totalCampaigns: campaigns.length,
        completedCampaigns,
        totalPaidOut: Math.round(totalPaidOut),
        activeBrands: new Set(campaigns.map(c => c.brandId)).size
      });
    } catch (error) {
      console.error("Failed to fetch platform stats:", error);
      res.json({ totalCreators: 0, totalCampaigns: 0, completedCampaigns: 0, totalPaidOut: 0, activeBrands: 0 });
    }
  });

  // Newsletter signup endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email, type } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email required" });
      }
      // In production, you'd store this in the database or send to an email service
      console.log(`[Newsletter] New subscription: ${email} (${type || 'general'})`);
      res.json({ success: true, message: "Successfully subscribed!" });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // AI Campaign Brief Generator endpoint
  app.post("/api/ai/generate-brief", isAuthenticated, async (req, res) => {
    try {
      const { productName, productDescription, targetAudience, campaignGoal, budget, platforms } = req.body;
      
      if (!productName || !campaignGoal) {
        return res.status(400).json({ message: "Product name and campaign goal are required" });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const platformsText = platforms?.length ? platforms.join(", ") : "TikTok, Instagram";
      
      const prompt = `You are an expert UGC (User Generated Content) marketing strategist. Generate a compelling campaign brief for a brand looking to work with content creators.

Product/Brand: ${productName}
${productDescription ? `Product Description: ${productDescription}` : ""}
${targetAudience ? `Target Audience: ${targetAudience}` : ""}
Campaign Goal: ${campaignGoal}
${budget ? `Budget: ${budget}` : ""}
Target Platforms: ${platformsText}

Generate a professional campaign brief in JSON format with the following fields:
{
  "title": "A catchy, attention-grabbing campaign title",
  "description": "A detailed 2-3 paragraph description explaining the campaign, what the brand is looking for, and the opportunity for creators",
  "requirements": "Bullet points of creator requirements (experience, style, deliverables)",
  "deliverables": ["Array of specific content deliverables expected"],
  "hashtags": ["Array of relevant hashtags to use"],
  "contentStyle": "Recommended content style (e.g., 'authentic', 'professional', 'casual')",
  "keyMessages": ["Array of 3-4 key messages creators should convey"]
}

Make it engaging and attractive to Canadian UGC creators. Be specific and actionable.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_completion_tokens: 1500,
      });

      const briefContent = response.choices[0]?.message?.content;
      if (!briefContent) {
        throw new Error("No response from AI");
      }

      const brief = JSON.parse(briefContent);
      res.json({ success: true, brief });
    } catch (error: any) {
      console.error("AI brief generation error:", error);
      res.status(500).json({ message: "Failed to generate campaign brief", error: error.message });
    }
  });

  // Auto-cleanup seed creators on startup
  (async () => {
    try {
      const seedUserIds = ['seed-user-1', 'seed-user-2', 'seed-user-3'];
      let deletedCount = 0;
      for (const userId of seedUserIds) {
        const deleted = await storage.deleteCreatorByUserId(userId);
        if (deleted) deletedCount++;
      }
      if (deletedCount > 0) {
        console.log(`[cleanup] Deleted ${deletedCount} seed creators from database`);
      }
    } catch (error) {
      console.error('[cleanup] Failed to cleanup seed creators:', error);
    }
  })();

  return httpServer;
}
