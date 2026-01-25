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
    const search = (req.query.search as string) || undefined;
    const niche = (req.query.niche as string) || undefined;
    const creators = await storage.getCreators(search, niche);
    res.json(creators);
  });

  // Get creator by handle
  app.get(api.creators.getByHandle.path, async (req, res) => {
    const handle = req.params.handle;
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

  return httpServer;
}

// Seed function
async function seedDatabase() {
  const existing = await storage.getCreators();
  if (existing.length === 0) {
    // ... existing seed code ...
    
    // Seed some offers
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
    // Since we need valid userIds (which are usually UUIDs from Auth), we can't easily seed 
    // realistic creator profiles linked to real users without creating users first.
    // However, for the directory page to look good, we can seed some "orphan" creators 
    // or just rely on the user to create one.
    // To make the directory populated, I'll seed some with fake user IDs.
    // These won't be editable unless I login with that specific UUID (impossible).
    // But they will show up in the directory.
    
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
}

// Call seed in a timeout to ensure DB is ready
setTimeout(seedDatabase, 5000);
