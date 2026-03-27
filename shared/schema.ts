import { pgTable, text, serial, jsonb, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

// Re-export auth models so they are available
export * from "./models/auth";

// Re-export chat models for AI integration
export * from "./models/chat";

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  target: text("target").notNull(), // "creator" or "brand"
  title: text("title").notNull(),
  description: text("description").notNull(),
  discount: text("discount"),
  code: text("code"),
  active: text("active").default("true"),
});

export const insertOfferSchema = createInsertSchema(offers).omit({ id: true });
export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;

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
    facebook?: string;
    canva?: string;
  }>().default({}),
  portfolio: jsonb("portfolio").$type<{
    id: string;
    title: string;
    url: string; // Video URL
    thumbnail?: string;
  }[]>().default([]),
  location: text("location"),
  languages: jsonb("languages").$type<string[]>().default([]),
  experienceLevel: text("experience_level"), // e.g., Beginner, Pro, Elite
  rateCard: jsonb("rate_card").$type<{
    cpmRate?: number;       // $ per 1,000 views
    postRate?: number;      // $ per static post
    storyRate?: number;     // $ per story/short
    videoRate?: number;     // $ per video
    currency?: string;      // CAD by default
    minBudget?: number;     // min project budget
    notes?: string;         // rate notes
  }>().default({}),
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
  location: text("location"),
  socialLinks: jsonb("social_links").$type<{
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    canva?: string;
  }>().default({}),
  // Brand subscription tier for feature gating
  tier: text("tier").default("starter"), // starter, growth, premium
  tierPurchasedAt: text("tier_purchased_at"),
});

// Brand tier feature definitions
export const BRAND_TIER_FEATURES = {
  starter: {
    name: "Starter",
    price: 199,
    analytics: "basic", // impressions, clicks, basic engagement
    creatorAccess: "limited", // select creator pool
    campaignPlacement: "standard",
    support: "email",
    accountManager: false,
    coBranded: false,
    earlyAccess: false,
  },
  growth: {
    name: "Growth",
    price: 300,
    analytics: "enhanced", // detailed engagement, demographics, performance insights
    creatorAccess: "expanded", // broader creator pool
    campaignPlacement: "priority",
    support: "basic",
    accountManager: false,
    coBranded: false,
    earlyAccess: false,
  },
  premium: {
    name: "Premium",
    price: 500,
    analytics: "premium", // ROI analysis, trend forecasting, advanced reporting
    creatorAccess: "full", // entire network
    campaignPlacement: "featured",
    support: "priority",
    accountManager: true,
    coBranded: true,
    earlyAccess: true,
  },
} as const;

export type BrandTier = keyof typeof BRAND_TIER_FEATURES;

export const insertCreatorSchema = createInsertSchema(creators).omit({ id: true });
export const insertBrandSchema = createInsertSchema(brands).omit({ id: true });

export type Creator = typeof creators.$inferSelect;
export type InsertCreator = z.infer<typeof insertCreatorSchema>;

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;

// Messages for creator-brand communication
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id").notNull(),
  receiverId: varchar("receiver_id").notNull(),
  senderType: text("sender_type").notNull(), // "creator" or "brand"
  receiverType: text("receiver_type").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  read: text("read").default("false"),
  createdAt: text("created_at").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // "message", "profile_view", "inquiry"
  title: text("title").notNull(),
  content: text("content").notNull(),
  read: text("read").default("false"),
  link: text("link"),
  createdAt: text("created_at").notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Reviews for rating creators and brands after collaborations
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  reviewerUserId: varchar("reviewer_user_id").notNull(),
  revieweeUserId: varchar("reviewee_user_id").notNull(),
  reviewerType: text("reviewer_type").notNull(), // "creator" or "brand"
  revieweeType: text("reviewee_type").notNull(), // "creator" or "brand"
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews)
  .omit({ id: true })
  .extend({
    rating: z.number().min(1).max(5),
  });
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Transactions for tracking payments with platform fees
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  paypalOrderId: varchar("paypal_order_id").notNull().unique(),
  payerUserId: varchar("payer_user_id").notNull(), // The brand paying
  recipientUserId: varchar("recipient_user_id").notNull(), // The creator receiving
  amount: text("amount").notNull(), // Total amount paid
  currency: text("currency").notNull().default("CAD"),
  platformFee: text("platform_fee").notNull(), // 20% platform fee
  creatorPayout: text("creator_payout").notNull(), // 80% to creator
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  description: text("description"), // What the payment was for
  createdAt: text("created_at").notNull(),
  completedAt: text("completed_at"),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true });
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Campaigns for brands to post opportunities for creators
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  brandUserId: varchar("brand_user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"), // What the brand is looking for
  budget: text("budget"), // Budget range e.g., "$500-$1000"
  niches: jsonb("niches").$type<string[]>().default([]),
  deliverables: jsonb("deliverables").$type<string[]>().default([]), // e.g., ["1 TikTok video", "2 Instagram stories"]
  deadline: text("deadline"), // Application deadline
  status: text("status").notNull().default("active"), // active, paused, closed
  location: text("location"), // Target location for creators
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
  // New customization fields
  campaignType: text("campaign_type"), // product_review, testimonial, unboxing, tutorial, lifestyle, brand_awareness
  platforms: jsonb("platforms").$type<string[]>().default([]), // tiktok, instagram, youtube, twitter
  experienceLevel: text("experience_level"), // any, beginner, intermediate, pro, elite
  compensationType: text("compensation_type"), // fixed, product_gifting, commission, negotiable, hybrid
  applicationDeadline: text("application_deadline"), // When applications close
  creatorCount: integer("creator_count"), // How many creators needed
  contentStyle: text("content_style"), // professional, casual, authentic, polished, ugc_style
  usageRights: text("usage_rights"), // 30_days, 90_days, 1_year, perpetual, negotiable
  exclusivity: text("exclusivity"), // none, category, full
  productProvided: text("product_provided"), // yes, no
  briefDocument: text("brief_document"), // URL to campaign brief
  hashtags: jsonb("hashtags").$type<string[]>().default([]), // Required hashtags
  mentions: jsonb("mentions").$type<string[]>().default([]), // Required mentions
  // Deal type — top-level categorization
  dealType: text("deal_type").default("campaign"), // campaign, contest, cpm_deal
  // Contest-specific fields
  prizeValue: text("prize_value"), // e.g. "$500 cash prize"
  contestRules: text("contest_rules"), // Eligibility / how to enter
  winnerCount: integer("winner_count"), // Number of winners
  // CPM deal fields
  cpmRate: text("cpm_rate"), // e.g. "$5 CPM"
  viewsGuaranteed: text("views_guaranteed"), // e.g. "50,000 views"
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true });
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
