import { creators, brands, type Creator, type InsertCreator, type Brand, type InsertBrand } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or } from "drizzle-orm";

export interface IStorage {
  getCreators(search?: string, niche?: string): Promise<Creator[]>;
  getCreatorByHandle(handle: string): Promise<Creator | undefined>;
  getCreatorByUserId(userId: string): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator): Promise<Creator>;
  updateCreator(userId: string, updates: Partial<InsertCreator>): Promise<Creator>;
  
  // Brand operations
  getBrandByUserId(userId: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(userId: string, updates: Partial<InsertBrand>): Promise<Brand>;
}

export class DatabaseStorage implements IStorage {
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
    return creator;
  }

  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const [creator] = await db.insert(creators).values(insertCreator).returning();
    return creator;
  }

  async updateCreator(userId: string, updates: Partial<InsertCreator>): Promise<Creator> {
    const existing = await this.getCreatorByUserId(userId);
    if (!existing) {
       throw new Error("Creator not found");
    }

    const [updated] = await db
      .update(creators)
      .set(updates)
      .where(eq(creators.userId, userId))
      .returning();
    return updated;
  }

  // Brand Implementations
  async getBrandByUserId(userId: string): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.userId, userId));
    return brand;
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const [brand] = await db.insert(brands).values(insertBrand).returning();
    return brand;
  }

  async updateBrand(userId: string, updates: Partial<InsertBrand>): Promise<Brand> {
    const existing = await this.getBrandByUserId(userId);
    if (!existing) {
       throw new Error("Brand not found");
    }

    const [updated] = await db
      .update(brands)
      .set(updates)
      .where(eq(brands.userId, userId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
