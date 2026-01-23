import { pgTable, text, serial, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

// Re-export auth models so they are available
export * from "./models/auth";

export const creators = pgTable("creators", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(), // One profile per user
  handle: text("handle").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  niches: jsonb("niches").$type<string[]>().default([]),
  socialLinks: jsonb("social_links").$type<{
    tiktok?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  }>().default({}),
  portfolio: jsonb("portfolio").$type<{
    id: string;
    title: string;
    url: string; // Video URL
    thumbnail?: string;
  }[]>().default([]),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  name: text("name").notNull(),
  industry: text("industry"),
  description: text("description"),
  logo: text("logo"),
  website: text("website"),
  niches: jsonb("niches").$type<string[]>().default([]),
});

export const insertCreatorSchema = createInsertSchema(creators).omit({ id: true });
export const insertBrandSchema = createInsertSchema(brands).omit({ id: true });

export type Creator = typeof creators.$inferSelect;
export type InsertCreator = z.infer<typeof insertCreatorSchema>;

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
