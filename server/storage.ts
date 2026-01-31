import { creators, brands, offers, type Creator, type InsertCreator, type Brand, type InsertBrand, type Offer, type InsertOffer } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or } from "drizzle-orm";

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
}

type CreatorSocialLinks = { tiktok?: string; instagram?: string; youtube?: string; twitter?: string };
type CreatorPortfolioItem = { id: string; title: string; url: string; thumbnail?: string };
type BrandSocialLinks = { instagram?: string; twitter?: string; linkedin?: string };

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
}

export const storage = new DatabaseStorage();
