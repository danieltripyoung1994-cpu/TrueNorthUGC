import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";

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
