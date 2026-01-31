import { creators, brands, offers, messages, notifications, users, reviews, transactions, campaigns, type Creator, type InsertCreator, type Brand, type InsertBrand, type Offer, type InsertOffer, type Message, type InsertMessage, type Notification, type InsertNotification, type User, type Review, type InsertReview, type Transaction, type InsertTransaction, type Campaign, type InsertCampaign } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, desc, and, isNotNull } from "drizzle-orm";

export interface IStorage {
  getCreators(search?: string, niche?: string): Promise<Creator[]>;
  getCreatorByHandle(handle: string): Promise<Creator | undefined>;
  getCreatorByUserId(userId: string): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator): Promise<Creator>;
  updateCreator(userId: string, updates: Partial<InsertCreator>): Promise<Creator>;
  
  getBrandByUserId(userId: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(userId: string, updates: Partial<InsertBrand>): Promise<Brand>;

  getOffers(target?: string): Promise<Offer[]>;
  createOffer(offer: InsertOffer): Promise<Offer>;

  // Messages
  getMessages(userId: string): Promise<Message[]>;
  getSentMessages(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageRead(id: number, userId: string): Promise<Message | undefined>;

  // Notifications
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number, userId: string): Promise<Notification | undefined>;
  markAllNotificationsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;

  // Users
  getAllUsersWithEmail(): Promise<User[]>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByCreatorUserId(creatorUserId: string): Promise<Review[]>;
  getReviewsByBrandUserId(brandUserId: string): Promise<Review[]>;
  getReviewsByReviewer(reviewerUserId: string): Promise<Review[]>;
  getReviewSummary(revieweeUserId: string): Promise<{ averageRating: number; totalReviews: number }>;
  deleteReview(id: number, reviewerUserId: string): Promise<boolean>;

  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionByPaypalOrderId(paypalOrderId: string): Promise<Transaction | undefined>;
  updateTransactionStatus(paypalOrderId: string, status: string, completedAt?: string): Promise<Transaction | undefined>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;

  // Campaigns
  getCampaigns(status?: string): Promise<Campaign[]>;
  getCampaignById(id: number): Promise<Campaign | undefined>;
  getCampaignsByBrand(brandUserId: string): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, brandUserId: string, updates: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number, brandUserId: string): Promise<boolean>;
}

type CreatorSocialLinks = { tiktok?: string; instagram?: string; youtube?: string; twitter?: string; facebook?: string; canva?: string };
type CreatorPortfolioItem = { id: string; title: string; url: string; thumbnail?: string };
type BrandSocialLinks = { instagram?: string; twitter?: string; linkedin?: string; facebook?: string; canva?: string };

function normalizeCreator(creator: typeof creators.$inferSelect): Creator {
  return {
    ...creator,
    niches: (creator.niches ?? []) as string[],
    languages: (creator.languages ?? []) as string[],
    portfolio: (creator.portfolio ?? []) as CreatorPortfolioItem[]
  };
}

function normalizeBrand(brand: typeof brands.$inferSelect): Brand {
  return {
    ...brand,
    niches: (brand.niches ?? []) as string[]
  };
}

export class DatabaseStorage implements IStorage {
  async getOffers(target?: string): Promise<Offer[]> {
    if (target) {
      return await db.select().from(offers).where(eq(offers.target, target));
    }
    return await db.select().from(offers);
  }

  async createOffer(insertOffer: InsertOffer): Promise<Offer> {
    const [offer] = await db.insert(offers).values(insertOffer).returning();
    return offer;
  }

  async getCreators(search?: string, niche?: string): Promise<Creator[]> {
    const conditions = [];
    if (search) {
      conditions.push(or(
        ilike(creators.name, `%${search}%`),
        ilike(creators.bio, `%${search}%`)
      ));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(creators).where(or(...conditions));
    }
    return await db.select().from(creators);
  }

  async getCreatorByHandle(handle: string): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.handle, handle));
    return creator;
  }

  async getCreatorByUserId(userId: string): Promise<Creator | undefined> {
    const [creator] = await db.select().from(creators).where(eq(creators.userId, userId));
    if (!creator) return undefined;
    return normalizeCreator(creator);
  }

  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const values = {
      userId: insertCreator.userId,
      handle: insertCreator.handle,
      name: insertCreator.name,
      bio: insertCreator.bio ?? null,
      profileImage: insertCreator.profileImage ?? null,
      niches: (insertCreator.niches ?? []) as string[],
      socialLinks: (insertCreator.socialLinks ?? {}) as CreatorSocialLinks,
      portfolio: (insertCreator.portfolio ?? []) as CreatorPortfolioItem[],
      location: insertCreator.location ?? null,
      languages: (insertCreator.languages ?? []) as string[],
      experienceLevel: insertCreator.experienceLevel ?? null
    };
    const [creator] = await db.insert(creators).values(values).returning();
    return normalizeCreator(creator);
  }

  async updateCreator(userId: string, updates: Partial<InsertCreator>): Promise<Creator> {
    const existing = await this.getCreatorByUserId(userId);
    if (!existing) {
      const newCreator: InsertCreator = {
        userId,
        handle: updates.handle ?? "",
        name: updates.name ?? "",
        bio: updates.bio,
        profileImage: updates.profileImage,
        niches: updates.niches ?? [],
        socialLinks: updates.socialLinks,
        portfolio: updates.portfolio ?? [],
        location: updates.location,
        languages: updates.languages ?? [],
        experienceLevel: updates.experienceLevel
      };
      return await this.createCreator(newCreator);
    }

    const setData = {
      handle: updates.handle ?? existing.handle,
      name: updates.name ?? existing.name,
      bio: updates.bio !== undefined ? updates.bio : existing.bio,
      profileImage: updates.profileImage !== undefined ? updates.profileImage : existing.profileImage,
      niches: (updates.niches ?? existing.niches ?? []) as string[],
      socialLinks: (updates.socialLinks !== undefined ? updates.socialLinks : existing.socialLinks ?? {}) as CreatorSocialLinks,
      portfolio: (updates.portfolio ?? existing.portfolio ?? []) as CreatorPortfolioItem[],
      location: updates.location !== undefined ? updates.location : existing.location,
      languages: (updates.languages ?? existing.languages ?? []) as string[],
      experienceLevel: updates.experienceLevel !== undefined ? updates.experienceLevel : existing.experienceLevel
    };
    const [updated] = await db
      .update(creators)
      .set(setData)
      .where(eq(creators.userId, userId))
      .returning();
    return normalizeCreator(updated);
  }

  async getBrandByUserId(userId: string): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.userId, userId));
    if (!brand) return undefined;
    return normalizeBrand(brand);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const values = {
      userId: insertBrand.userId,
      name: insertBrand.name,
      industry: insertBrand.industry ?? null,
      description: insertBrand.description ?? null,
      logo: insertBrand.logo ?? null,
      website: insertBrand.website ?? null,
      niches: (insertBrand.niches ?? []) as string[],
      location: insertBrand.location ?? null,
      socialLinks: (insertBrand.socialLinks ?? {}) as BrandSocialLinks
    };
    const [brand] = await db.insert(brands).values(values).returning();
    return normalizeBrand(brand);
  }

  async updateBrand(userId: string, updates: Partial<InsertBrand>): Promise<Brand> {
    const existing = await this.getBrandByUserId(userId);
    if (!existing) {
      const newBrand: InsertBrand = {
        userId,
        name: updates.name ?? "",
        industry: updates.industry,
        description: updates.description,
        logo: updates.logo,
        website: updates.website,
        niches: updates.niches ?? [],
        location: updates.location,
        socialLinks: updates.socialLinks
      };
      return await this.createBrand(newBrand);
    }

    const setData = {
      name: updates.name ?? existing.name,
      industry: updates.industry !== undefined ? updates.industry : existing.industry,
      description: updates.description !== undefined ? updates.description : existing.description,
      logo: updates.logo !== undefined ? updates.logo : existing.logo,
      website: updates.website !== undefined ? updates.website : existing.website,
      niches: (updates.niches ?? existing.niches ?? []) as string[],
      location: updates.location !== undefined ? updates.location : existing.location,
      socialLinks: (updates.socialLinks !== undefined ? updates.socialLinks : existing.socialLinks ?? {}) as BrandSocialLinks
    };
    const [updated] = await db
      .update(brands)
      .set(setData)
      .where(eq(brands.userId, userId))
      .returning();
    return normalizeBrand(updated);
  }

  // Messages
  async getMessages(userId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.receiverId, userId))
      .orderBy(desc(messages.createdAt));
  }

  async getSentMessages(userId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.senderId, userId))
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async markMessageRead(id: number, userId: string): Promise<Message | undefined> {
    const [message] = await db.update(messages)
      .set({ read: "true" })
      .where(and(eq(messages.id, id), eq(messages.receiverId, userId)))
      .returning();
    return message;
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async markNotificationRead(id: number, userId: string): Promise<Notification | undefined> {
    const [notification] = await db.update(notifications)
      .set({ read: "true" })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();
    return notification;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await db.update(notifications)
      .set({ read: "true" })
      .where(eq(notifications.userId, userId));
  }

  async getUnreadCount(userId: string): Promise<number> {
    const unread = await db.select().from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, "false")));
    return unread.length;
  }

  async getAllUsersWithEmail(): Promise<User[]> {
    return await db.select().from(users).where(isNotNull(users.email));
  }

  // Reviews
  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async getReviewsByCreatorUserId(creatorUserId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(and(eq(reviews.revieweeUserId, creatorUserId), eq(reviews.revieweeType, "creator")))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByBrandUserId(brandUserId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(and(eq(reviews.revieweeUserId, brandUserId), eq(reviews.revieweeType, "brand")))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByReviewer(reviewerUserId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.reviewerUserId, reviewerUserId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewSummary(revieweeUserId: string): Promise<{ averageRating: number; totalReviews: number }> {
    const allReviews = await db.select().from(reviews)
      .where(eq(reviews.revieweeUserId, revieweeUserId));
    
    if (allReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }
    
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      averageRating: Math.round((totalRating / allReviews.length) * 10) / 10,
      totalReviews: allReviews.length
    };
  }

  async deleteReview(id: number, reviewerUserId: string): Promise<boolean> {
    const result = await db.delete(reviews)
      .where(and(eq(reviews.id, id), eq(reviews.reviewerUserId, reviewerUserId)))
      .returning();
    return result.length > 0;
  }

  // Transaction methods
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async getTransactionByPaypalOrderId(paypalOrderId: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.paypalOrderId, paypalOrderId));
    return result[0];
  }

  async updateTransactionStatus(paypalOrderId: string, status: string, completedAt?: string): Promise<Transaction | undefined> {
    const updates: Partial<Transaction> = { status };
    if (completedAt) {
      updates.completedAt = completedAt;
    }
    const result = await db.update(transactions)
      .set(updates)
      .where(eq(transactions.paypalOrderId, paypalOrderId))
      .returning();
    return result[0];
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    const result = await db.select().from(transactions)
      .where(or(eq(transactions.payerUserId, userId), eq(transactions.recipientUserId, userId)))
      .orderBy(desc(transactions.createdAt));
    return result;
  }

  // Campaign methods
  async getCampaigns(status?: string): Promise<Campaign[]> {
    if (status) {
      const result = await db.select().from(campaigns)
        .where(eq(campaigns.status, status))
        .orderBy(desc(campaigns.createdAt));
      return result;
    }
    const result = await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
    return result;
  }

  async getCampaignById(id: number): Promise<Campaign | undefined> {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return result[0];
  }

  async getCampaignsByBrand(brandUserId: string): Promise<Campaign[]> {
    const result = await db.select().from(campaigns)
      .where(eq(campaigns.brandUserId, brandUserId))
      .orderBy(desc(campaigns.createdAt));
    return result;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const campaignData = {
      brandUserId: campaign.brandUserId,
      title: campaign.title,
      description: campaign.description,
      requirements: campaign.requirements,
      budget: campaign.budget,
      niches: campaign.niches as string[] || [],
      deliverables: campaign.deliverables as string[] || [],
      deadline: campaign.deadline,
      status: campaign.status || "active",
      location: campaign.location,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    };
    const result = await db.insert(campaigns).values(campaignData).returning();
    return result[0];
  }

  async updateCampaign(id: number, brandUserId: string, updates: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const updateData: any = { ...updates, updatedAt: new Date().toISOString() };
    if (updates.niches) updateData.niches = updates.niches;
    if (updates.deliverables) updateData.deliverables = updates.deliverables;
    
    const result = await db.update(campaigns)
      .set(updateData)
      .where(and(eq(campaigns.id, id), eq(campaigns.brandUserId, brandUserId)))
      .returning();
    return result[0];
  }

  async deleteCampaign(id: number, brandUserId: string): Promise<boolean> {
    const result = await db.delete(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.brandUserId, brandUserId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
