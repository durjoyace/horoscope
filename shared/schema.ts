import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  createdAt: timestamp("created_at").defaultNow(),
});

export const horoscopes = pgTable("horoscopes", {
  id: serial("id").primaryKey(),
  zodiacSign: text("zodiac_sign").notNull(),
  date: text("date").notNull(),
  content: json("content").notNull(),
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHoroscope = z.infer<typeof insertHoroscopeSchema>;
export type Horoscope = typeof horoscopes.$inferSelect;

export type InsertDeliveryLog = z.infer<typeof insertDeliveryLogSchema>;
export type DeliveryLog = typeof deliveryLogs.$inferSelect;
