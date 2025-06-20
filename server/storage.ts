import { 
  users, 
  horoscopes, 
  deliveryLogs, 
  ads,
  forumTopics,
  forumReplies,
  type User, 
  type InsertUser, 
  type Horoscope, 
  type InsertHoroscope,
  type DeliveryLog,
  type InsertDeliveryLog,
  type Ad,
  type InsertAd,
  type ForumTopic,
  type InsertForumTopic,
  type ForumReply,
  type InsertForumReply
} from "@shared/schema";
import { ZodiacSign } from "@shared/types";
import session from "express-session";
import { db, pool } from "./db";
import { eq, and, sql } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";

const PostgresSessionStore = connectPgSimple(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByStripeCustomerId(stripeCustomerId: string): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersByZodiacSign(sign: ZodiacSign): Promise<User[]>;
  getUsersForDailyDelivery(): Promise<User[]>;
  getAllUsersForCRM(): Promise<User[]>;
  getUsersForSMSBroadcast(): Promise<User[]>;
  
  // Horoscope operations
  getHoroscope(id: number): Promise<Horoscope | undefined>;
  getHoroscopeBySignAndDate(sign: string, date: string): Promise<Horoscope | undefined>;
  createHoroscope(horoscope: InsertHoroscope): Promise<Horoscope>;
  getAllHoroscopes(): Promise<Horoscope[]>;
  
  // Delivery operations
  createDeliveryLog(log: InsertDeliveryLog): Promise<DeliveryLog>;
  getDeliveryLogsByUser(userId: number): Promise<DeliveryLog[]>;
  getAllDeliveryLogs(): Promise<DeliveryLog[]>;
  
  // Analytics operations
  getUserLoginHistory(userId: number): Promise<any[]>;
  getContentInteractions(contentType: string): Promise<any[]>;
  
  // Ad operations
  getAd(id: number): Promise<Ad | undefined>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: number, ad: Partial<InsertAd>): Promise<Ad | undefined>;
  deleteAd(id: number): Promise<boolean>;
  getAllAds(): Promise<Ad[]>;
  getActiveAds(): Promise<Ad[]>;
  getAdsByPosition(position: string): Promise<Ad[]>;
  incrementAdImpressions(id: number): Promise<void>;
  incrementAdClicks(id: number): Promise<void>;
  
  // Premium user operations
  getPremiumUsers(): Promise<User[]>;
  
  // Community features
  getForumTopic(id: number): Promise<ForumTopic | undefined>;
  getForumTopicsByZodiacSign(sign: string, limit?: number, offset?: number): Promise<ForumTopic[]>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  updateForumTopic(id: number, topic: Partial<InsertForumTopic>): Promise<ForumTopic | undefined>;
  deleteForumTopic(id: number): Promise<boolean>;
  incrementTopicViewCount(id: number): Promise<void>;
  incrementTopicLikeCount(id: number): Promise<void>;
  
  getForumReply(id: number): Promise<ForumReply | undefined>;
  getForumRepliesByTopicId(topicId: number, limit?: number, offset?: number): Promise<ForumReply[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  updateForumReply(id: number, reply: Partial<InsertForumReply>): Promise<ForumReply | undefined>;
  deleteForumReply(id: number): Promise<boolean>;
  incrementReplyLikeCount(id: number): Promise<void>;
  
  // Session store for express-session
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUsersByStripeCustomerId(stripeCustomerId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsersByZodiacSign(sign: ZodiacSign): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.zodiacSign, sign));
  }

  async getUsersForDailyDelivery(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(sql`${users.smsOptIn} = true OR ${users.emailOptIn} = true`);
  }

  async getAllUsersForCRM(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsersForSMSBroadcast(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(and(
        eq(users.smsOptIn, true),
        sql`${users.phone} IS NOT NULL`
      ));
  }

  async getPremiumUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(sql`${users.stripeSubscriptionId} IS NOT NULL`);
  }

  async getHoroscope(id: number): Promise<Horoscope | undefined> {
    const [horoscope] = await db.select().from(horoscopes).where(eq(horoscopes.id, id));
    return horoscope || undefined;
  }

  async getHoroscopeBySignAndDate(sign: string, date: string): Promise<Horoscope | undefined> {
    const [horoscope] = await db
      .select()
      .from(horoscopes)
      .where(and(eq(horoscopes.zodiacSign, sign), eq(horoscopes.date, date)));
    return horoscope || undefined;
  }

  async createHoroscope(insertHoroscope: InsertHoroscope): Promise<Horoscope> {
    const [horoscope] = await db
      .insert(horoscopes)
      .values(insertHoroscope)
      .returning();
    return horoscope;
  }

  async getAllHoroscopes(): Promise<Horoscope[]> {
    return await db.select().from(horoscopes);
  }

  async createDeliveryLog(insertLog: InsertDeliveryLog): Promise<DeliveryLog> {
    const [log] = await db
      .insert(deliveryLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async getDeliveryLogsByUser(userId: number): Promise<DeliveryLog[]> {
    return await db
      .select()
      .from(deliveryLogs)
      .where(eq(deliveryLogs.userId, userId));
  }

  async getAllDeliveryLogs(): Promise<DeliveryLog[]> {
    return await db.select().from(deliveryLogs);
  }

  async getUserLoginHistory(userId: number): Promise<any[]> {
    // Mock implementation for analytics
    return [];
  }

  async getContentInteractions(contentType: string): Promise<any[]> {
    // Mock implementation for analytics
    return [];
  }

  async getAd(id: number): Promise<Ad | undefined> {
    const [ad] = await db.select().from(ads).where(eq(ads.id, id));
    return ad || undefined;
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const [ad] = await db
      .insert(ads)
      .values(insertAd)
      .returning();
    return ad;
  }

  async updateAd(id: number, updates: Partial<InsertAd>): Promise<Ad | undefined> {
    const [ad] = await db
      .update(ads)
      .set(updates)
      .where(eq(ads.id, id))
      .returning();
    return ad || undefined;
  }

  async deleteAd(id: number): Promise<boolean> {
    const result = await db.delete(ads).where(eq(ads.id, id));
    return result.rowCount > 0;
  }

  async getAllAds(): Promise<Ad[]> {
    return await db.select().from(ads);
  }

  async getActiveAds(): Promise<Ad[]> {
    return await db
      .select()
      .from(ads)
      .where(eq(ads.isActive, true));
  }

  async getAdsByPosition(position: string): Promise<Ad[]> {
    return await db
      .select()
      .from(ads)
      .where(and(eq(ads.position, position), eq(ads.isActive, true)));
  }

  async incrementAdImpressions(id: number): Promise<void> {
    await db
      .update(ads)
      .set({ impressions: sql`${ads.impressions} + 1` })
      .where(eq(ads.id, id));
  }

  async incrementAdClicks(id: number): Promise<void> {
    await db
      .update(ads)
      .set({ clicks: sql`${ads.clicks} + 1` })
      .where(eq(ads.id, id));
  }

  async getForumTopic(id: number): Promise<ForumTopic | undefined> {
    const [topic] = await db.select().from(forumTopics).where(eq(forumTopics.id, id));
    return topic || undefined;
  }

  async getForumTopicsByZodiacSign(sign: string, limit = 10, offset = 0): Promise<ForumTopic[]> {
    return await db
      .select()
      .from(forumTopics)
      .where(eq(forumTopics.zodiacSign, sign))
      .limit(limit)
      .offset(offset);
  }

  async createForumTopic(insertTopic: InsertForumTopic): Promise<ForumTopic> {
    const [topic] = await db
      .insert(forumTopics)
      .values(insertTopic)
      .returning();
    return topic;
  }

  async updateForumTopic(id: number, updates: Partial<InsertForumTopic>): Promise<ForumTopic | undefined> {
    const [topic] = await db
      .update(forumTopics)
      .set(updates)
      .where(eq(forumTopics.id, id))
      .returning();
    return topic || undefined;
  }

  async deleteForumTopic(id: number): Promise<boolean> {
    const result = await db.delete(forumTopics).where(eq(forumTopics.id, id));
    return result.rowCount > 0;
  }

  async incrementTopicViewCount(id: number): Promise<void> {
    await db
      .update(forumTopics)
      .set({ viewCount: sql`${forumTopics.viewCount} + 1` })
      .where(eq(forumTopics.id, id));
  }

  async incrementTopicLikeCount(id: number): Promise<void> {
    await db
      .update(forumTopics)
      .set({ likeCount: sql`${forumTopics.likeCount} + 1` })
      .where(eq(forumTopics.id, id));
  }

  async getForumReply(id: number): Promise<ForumReply | undefined> {
    const [reply] = await db.select().from(forumReplies).where(eq(forumReplies.id, id));
    return reply || undefined;
  }

  async getForumRepliesByTopicId(topicId: number, limit = 10, offset = 0): Promise<ForumReply[]> {
    return await db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.topicId, topicId))
      .limit(limit)
      .offset(offset);
  }

  async createForumReply(insertReply: InsertForumReply): Promise<ForumReply> {
    const [reply] = await db
      .insert(forumReplies)
      .values(insertReply)
      .returning();
    return reply;
  }

  async updateForumReply(id: number, updates: Partial<InsertForumReply>): Promise<ForumReply | undefined> {
    const [reply] = await db
      .update(forumReplies)
      .set(updates)
      .where(eq(forumReplies.id, id))
      .returning();
    return reply || undefined;
  }

  async deleteForumReply(id: number): Promise<boolean> {
    const result = await db.delete(forumReplies).where(eq(forumReplies.id, id));
    return result.rowCount > 0;
  }

  async incrementReplyLikeCount(id: number): Promise<void> {
    await db
      .update(forumReplies)
      .set({ likeCount: sql`${forumReplies.likeCount} + 1` })
      .where(eq(forumReplies.id, id));
  }
}

export const storage = new DatabaseStorage();