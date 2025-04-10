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
  phone: text("phone"),
  smsOptIn: boolean("sms_opt_in").default(false),
  newsletterOptIn: boolean("newsletter_opt_in").default(true),
  // Premium subscription fields
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default('none'),
  subscriptionTier: text("subscription_tier").default('free'),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const horoscopes = pgTable("horoscopes", {
  id: serial("id").primaryKey(),
  zodiacSign: text("zodiac_sign").notNull(),
  date: text("date").notNull(),
  content: json("content").notNull(),
  isPremium: boolean("is_premium").default(false),
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHoroscope = z.infer<typeof insertHoroscopeSchema>;
export type Horoscope = typeof horoscopes.$inferSelect;

export type InsertDeliveryLog = z.infer<typeof insertDeliveryLogSchema>;
export type DeliveryLog = typeof deliveryLogs.$inferSelect;

export type InsertPremiumReport = z.infer<typeof insertPremiumReportSchema>;
export type PremiumReport = typeof premiumReports.$inferSelect;
