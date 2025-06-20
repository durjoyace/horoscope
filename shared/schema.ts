import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { ZodiacSign } from "./types";

// Zodiac sign schema for validation
export const zodiacSignSchema = z.enum([
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
]);

// Subscription status schema for validation
export const subscriptionStatusSchema = z.enum([
  'active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'none'
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  zodiacSign: text("zodiac_sign").notNull(),
  birthdate: text("birthdate"),
  phone: text("phone").notNull(),
  smsOptIn: boolean("sms_opt_in").default(true),
  emailOptIn: boolean("email_opt_in").default(false),
  preferredDelivery: text("preferred_delivery").default('sms'),
  // Premium subscription fields
  // Note: isPremium is not in the database, but we'll handle it in code
  // isPremium: boolean("is_premium").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default('none'),
  subscriptionTier: text("subscription_tier").default('free'),
  subscriptionEndDate: timestamp("subscription_end_date"),
  // Referral system fields
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"), // referral code of the person who referred this user
  referralRewards: integer("referral_rewards").default(0), // number of successful referrals
  createdAt: timestamp("created_at").defaultNow(),
});

export const horoscopes = pgTable("horoscopes", {
  id: serial("id").primaryKey(),
  zodiacSign: text("zodiac_sign").notNull(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  wellness: text("wellness").notNull(),
  nutrition: text("nutrition"),
  fitness: text("fitness"),
  mindfulness: text("mindfulness"),
  isPremium: boolean("is_premium").default(false),
  isAiGenerated: boolean("is_ai_generated").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveryLogs = pgTable("delivery_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  horoscopeId: integer("horoscope_id").notNull(),
  deliveryType: text("delivery_type").notNull(), // 'email' | 'sms'
  status: text("status").notNull(), // 'success' | 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const premiumReports = pgTable("premium_reports", {
  id: serial("id").primaryKey(),
  zodiacSign: text("zodiac_sign").notNull(),
  weekStartDate: text("week_start_date").notNull(),
  weekEndDate: text("week_end_date").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(), 
  name: text("name").notNull(),
  content: text("content").notNull(),
  linkUrl: text("link_url").notNull(),
  position: text("position").notNull().default('bottom'), // 'top', 'middle', 'bottom'
  isActive: boolean("is_active").default(true),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community features
export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  zodiacSign: text("zodiac_sign").notNull(),
  category: text("category").notNull().default('general'), // 'general', 'wellness', 'nutrition', etc.
  isPinned: boolean("is_pinned").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull(),
  referredUserId: integer("referred_user_id").notNull(),
  referralCode: text("referral_code").notNull(),
  status: text("status").default('pending'), // pending, completed, rewarded
  rewardType: text("reward_type"), // free_month, premium_upgrade, etc.
  rewardValue: text("reward_value"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertHoroscopeSchema = createInsertSchema(horoscopes).omit({
  id: true,
  createdAt: true,
});

export const insertDeliveryLogSchema = createInsertSchema(deliveryLogs).omit({
  id: true,
  createdAt: true,
});

export const insertPremiumReportSchema = createInsertSchema(premiumReports).omit({
  id: true,
  createdAt: true,
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  createdAt: true,
  impressions: true,
  clicks: true,
});

export const insertForumTopicSchema = createInsertSchema(forumTopics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  likeCount: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likeCount: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHoroscope = z.infer<typeof insertHoroscopeSchema>;
export type Horoscope = typeof horoscopes.$inferSelect;

export type InsertDeliveryLog = z.infer<typeof insertDeliveryLogSchema>;
export type DeliveryLog = typeof deliveryLogs.$inferSelect;

export type InsertPremiumReport = z.infer<typeof insertPremiumReportSchema>;
export type PremiumReport = typeof premiumReports.$inferSelect;

export type InsertAd = z.infer<typeof insertAdSchema>;
export type Ad = typeof ads.$inferSelect;

export type InsertForumTopic = z.infer<typeof insertForumTopicSchema>;
export type ForumTopic = typeof forumTopics.$inferSelect;

export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumReply = typeof forumReplies.$inferSelect;

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;
