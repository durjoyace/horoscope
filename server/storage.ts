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
import { Store as SessionStore } from "express-session";
import createMemoryStore from "memorystore";
import { db, pool } from "./db";
import { eq, and, sql } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";

// Init Memorystore for sessions
const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByStripeCustomerId(stripeCustomerId: string): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
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
  
  // Additional query methods
  getUsersByZodiacSign(sign: ZodiacSign): Promise<User[]>;
  getUsersForDailyDelivery(): Promise<User[]>;
  getPremiumUsers(): Promise<User[]>;
  
  // Community features
  // Forum topics
  getForumTopic(id: number): Promise<ForumTopic | undefined>;
  getForumTopicsByZodiacSign(sign: string, limit?: number, offset?: number): Promise<ForumTopic[]>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  updateForumTopic(id: number, topic: Partial<InsertForumTopic>): Promise<ForumTopic | undefined>;
  deleteForumTopic(id: number): Promise<boolean>;
  incrementTopicViewCount(id: number): Promise<void>;
  incrementTopicLikeCount(id: number): Promise<void>;
  
  // Forum replies
  getForumReply(id: number): Promise<ForumReply | undefined>;
  getForumRepliesByTopicId(topicId: number, limit?: number, offset?: number): Promise<ForumReply[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  updateForumReply(id: number, reply: Partial<InsertForumReply>): Promise<ForumReply | undefined>;
  deleteForumReply(id: number): Promise<boolean>;
  incrementReplyLikeCount(id: number): Promise<void>;
  
  // Session store for express-session
  sessionStore: SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private horoscopes: Map<number, Horoscope>;
  private deliveryLogs: Map<number, DeliveryLog>;
  private ads: Map<number, Ad>;
  private forumTopics: Map<number, ForumTopic>;
  private forumReplies: Map<number, ForumReply>;
  private userCurrentId: number;
  private horoscopeCurrentId: number;
  private deliveryLogCurrentId: number;
  private adCurrentId: number;
  private forumTopicCurrentId: number;
  private forumReplyCurrentId: number;
  public sessionStore: SessionStore;

  constructor() {
    // Initialize in-memory storage
    this.users = new Map();
    this.horoscopes = new Map();
    this.deliveryLogs = new Map();
    this.ads = new Map();
    this.forumTopics = new Map();
    this.forumReplies = new Map();
    this.userCurrentId = 1;
    this.horoscopeCurrentId = 1;
    this.deliveryLogCurrentId = 1;
    this.adCurrentId = 1;
    this.forumTopicCurrentId = 1;
    this.forumReplyCurrentId = 1;
    
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with sample topics for each zodiac sign
    this.initializeForumTopics();
  }
  
  // Initialize forum topics with sample data for each zodiac sign
  private initializeForumTopics() {
    const adminUser = this.createDefaultAdminUser();
    
    // Create sample topics for each zodiac sign
    const zodiacSigns: ZodiacSign[] = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];
    
    // Import initial topics from our data file
    import('../client/src/data/initialForumTopics').then(({ initialForumTopics }) => {
      zodiacSigns.forEach(sign => {
        const signTopics = initialForumTopics[sign];
        if (signTopics) {
          signTopics.forEach(topicData => {
            const topicId = this.forumTopicCurrentId++;
            const now = new Date();
            
            const topic: ForumTopic = {
              id: topicId,
              title: topicData.title,
              content: topicData.content,
              userId: adminUser.id,
              zodiacSign: sign,
              category: topicData.category,
              isPinned: topicData.isPinned || false,
              viewCount: Math.floor(Math.random() * 50) + 5, // Random view count
              likeCount: Math.floor(Math.random() * 10), // Random like count
              createdAt: now,
              updatedAt: now
            };
            
            this.forumTopics.set(topicId, topic);
          });
        }
      });
    }).catch(err => {
      console.error("Failed to initialize forum topics:", err);
    });
  }
  
  // Create a default admin user for sample content
  private createDefaultAdminUser(): User {
    const adminUserId = this.userCurrentId++;
    const adminUser: User = {
      id: adminUserId,
      email: "admin@horoscopehealth.com",
      password: "hashed_password_placeholder", // In a real app, this would be properly hashed
      firstName: "Admin",
      lastName: "User",
      zodiacSign: "leo",
      birthdate: null,
      phone: null,
      smsOptIn: false,
      newsletterOptIn: true,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: 'none',
      subscriptionTier: 'free',
      subscriptionEndDate: null,
      createdAt: new Date()
    };
    
    this.users.set(adminUserId, adminUser);
    return adminUser;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getUsersByStripeCustomerId(stripeCustomerId: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.stripeCustomerId === stripeCustomerId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    
    // Ensure all properties are properly set with fallbacks
    const user: User = {
      id,
      email: insertUser.email,
      zodiacSign: insertUser.zodiacSign,
      password: insertUser.password || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      birthdate: insertUser.birthdate || null,
      phone: insertUser.phone || null,
      smsOptIn: insertUser.smsOptIn ?? null,
      newsletterOptIn: insertUser.newsletterOptIn ?? null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: 'none',
      subscriptionTier: 'free',
      subscriptionEndDate: null,
      createdAt: createdAt
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Horoscope operations
  async getHoroscope(id: number): Promise<Horoscope | undefined> {
    return this.horoscopes.get(id);
  }
  
  async getHoroscopeBySignAndDate(sign: string, date: string): Promise<Horoscope | undefined> {
    return Array.from(this.horoscopes.values()).find(
      (horoscope) => horoscope.zodiacSign === sign && horoscope.date === date,
    );
  }
  
  async createHoroscope(insertHoroscope: InsertHoroscope): Promise<Horoscope> {
    const id = this.horoscopeCurrentId++;
    const createdAt = new Date();
    // Create with proper null handling for optional fields
    const horoscope: Horoscope = { 
      id,
      zodiacSign: insertHoroscope.zodiacSign,
      date: insertHoroscope.date,
      title: insertHoroscope.title,
      content: insertHoroscope.content,
      wellness: insertHoroscope.wellness,
      nutrition: insertHoroscope.nutrition || null,
      fitness: insertHoroscope.fitness || null,
      mindfulness: insertHoroscope.mindfulness || null,
      isPremium: insertHoroscope.isPremium || false,
      isAiGenerated: insertHoroscope.isAiGenerated || true,
      createdAt
    };
    this.horoscopes.set(id, horoscope);
    return horoscope;
  }

  // Delivery operations
  async createDeliveryLog(insertLog: InsertDeliveryLog): Promise<DeliveryLog> {
    const id = this.deliveryLogCurrentId++;
    const createdAt = new Date();
    const log: DeliveryLog = { ...insertLog, id, createdAt };
    this.deliveryLogs.set(id, log);
    return log;
  }
  
  async getDeliveryLogsByUser(userId: number): Promise<DeliveryLog[]> {
    return Array.from(this.deliveryLogs.values()).filter(
      (log) => log.userId === userId,
    );
  }
  
  // Additional query methods
  async getUsersByZodiacSign(sign: ZodiacSign): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.zodiacSign === sign,
    );
  }
  
  async getUsersForDailyDelivery(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getPremiumUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro'
    );
  }
  
  // Analytics-specific methods
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getAllHoroscopes(): Promise<Horoscope[]> {
    return Array.from(this.horoscopes.values());
  }
  
  async getAllDeliveryLogs(): Promise<DeliveryLog[]> {
    return Array.from(this.deliveryLogs.values());
  }
  
  // Mock methods for analytics
  async getUserLoginHistory(userId: number): Promise<any[]> {
    // Simulate login history
    return [];
  }
  
  async getContentInteractions(contentType: string): Promise<any[]> {
    // Simulate content interactions
    return [];
  }

  // Ad operations
  async getAd(id: number): Promise<Ad | undefined> {
    return this.ads.get(id);
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const id = this.adCurrentId++;
    const createdAt = new Date();
    const ad: Ad = {
      id,
      name: insertAd.name,
      content: insertAd.content,
      linkUrl: insertAd.linkUrl,
      position: insertAd.position || 'bottom',
      isActive: insertAd.isActive ?? true,
      impressions: 0,
      clicks: 0,
      createdAt
    };
    this.ads.set(id, ad);
    return ad;
  }

  async updateAd(id: number, updates: Partial<InsertAd>): Promise<Ad | undefined> {
    const ad = await this.getAd(id);
    if (!ad) return undefined;
    
    const updatedAd = { ...ad, ...updates };
    this.ads.set(id, updatedAd);
    return updatedAd;
  }

  async deleteAd(id: number): Promise<boolean> {
    return this.ads.delete(id);
  }

  async getAllAds(): Promise<Ad[]> {
    return Array.from(this.ads.values());
  }

  async getActiveAds(): Promise<Ad[]> {
    return Array.from(this.ads.values()).filter(
      (ad) => ad.isActive
    );
  }

  async getAdsByPosition(position: string): Promise<Ad[]> {
    return Array.from(this.ads.values()).filter(
      (ad) => ad.position === position && ad.isActive
    );
  }

  async incrementAdImpressions(id: number): Promise<void> {
    const ad = await this.getAd(id);
    if (ad) {
      const impressions = ad.impressions ?? 0;
      ad.impressions = impressions + 1;
      this.ads.set(id, ad);
    }
  }

  async incrementAdClicks(id: number): Promise<void> {
    const ad = await this.getAd(id);
    if (ad) {
      const clicks = ad.clicks ?? 0;
      ad.clicks = clicks + 1;
      this.ads.set(id, ad);
    }
  }

  // Forum Topic operations
  async getForumTopic(id: number): Promise<ForumTopic | undefined> {
    return this.forumTopics.get(id);
  }

  async getForumTopicsByZodiacSign(sign: string, limit?: number, offset?: number): Promise<ForumTopic[]> {
    let topics = Array.from(this.forumTopics.values()).filter(
      (topic) => topic.zodiacSign === sign
    );
    
    // Sort by most recent first
    topics.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Apply pagination if specified
    if (offset !== undefined && limit !== undefined) {
      topics = topics.slice(offset, offset + limit);
    } else if (limit !== undefined) {
      topics = topics.slice(0, limit);
    }
    
    return topics;
  }

  async createForumTopic(insertTopic: InsertForumTopic): Promise<ForumTopic> {
    const id = this.forumTopicCurrentId++;
    const now = new Date();
    
    const topic: ForumTopic = {
      id,
      title: insertTopic.title,
      content: insertTopic.content,
      userId: insertTopic.userId,
      zodiacSign: insertTopic.zodiacSign,
      category: insertTopic.category || 'general',
      isPinned: insertTopic.isPinned || false,
      viewCount: 0,
      likeCount: 0,
      createdAt: now,
      updatedAt: now
    };
    
    this.forumTopics.set(id, topic);
    return topic;
  }

  async updateForumTopic(id: number, updates: Partial<InsertForumTopic>): Promise<ForumTopic | undefined> {
    const topic = await this.getForumTopic(id);
    if (!topic) return undefined;
    
    const updatedTopic = { 
      ...topic, 
      ...updates,
      updatedAt: new Date()
    };
    
    this.forumTopics.set(id, updatedTopic);
    return updatedTopic;
  }

  async deleteForumTopic(id: number): Promise<boolean> {
    return this.forumTopics.delete(id);
  }

  async incrementTopicViewCount(id: number): Promise<void> {
    const topic = await this.getForumTopic(id);
    if (topic) {
      topic.viewCount = (topic.viewCount || 0) + 1;
      this.forumTopics.set(id, topic);
    }
  }

  async incrementTopicLikeCount(id: number): Promise<void> {
    const topic = await this.getForumTopic(id);
    if (topic) {
      topic.likeCount = (topic.likeCount || 0) + 1;
      this.forumTopics.set(id, topic);
    }
  }

  // Forum Reply operations
  async getForumReply(id: number): Promise<ForumReply | undefined> {
    return this.forumReplies.get(id);
  }

  async getForumRepliesByTopicId(topicId: number, limit?: number, offset?: number): Promise<ForumReply[]> {
    let replies = Array.from(this.forumReplies.values()).filter(
      (reply) => reply.topicId === topicId
    );
    
    // Sort by oldest first by default (chronological order)
    replies.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    
    // Apply pagination if specified
    if (offset !== undefined && limit !== undefined) {
      replies = replies.slice(offset, offset + limit);
    } else if (limit !== undefined) {
      replies = replies.slice(0, limit);
    }
    
    return replies;
  }

  async createForumReply(insertReply: InsertForumReply): Promise<ForumReply> {
    const id = this.forumReplyCurrentId++;
    const now = new Date();
    
    const reply: ForumReply = {
      id,
      topicId: insertReply.topicId,
      userId: insertReply.userId,
      content: insertReply.content,
      likeCount: 0,
      createdAt: now,
      updatedAt: now
    };
    
    this.forumReplies.set(id, reply);
    return reply;
  }

  async updateForumReply(id: number, updates: Partial<InsertForumReply>): Promise<ForumReply | undefined> {
    const reply = await this.getForumReply(id);
    if (!reply) return undefined;
    
    const updatedReply = { 
      ...reply, 
      ...updates,
      updatedAt: new Date()
    };
    
    this.forumReplies.set(id, updatedReply);
    return updatedReply;
  }

  async deleteForumReply(id: number): Promise<boolean> {
    return this.forumReplies.delete(id);
  }

  async incrementReplyLikeCount(id: number): Promise<void> {
    const reply = await this.getForumReply(id);
    if (reply) {
      reply.likeCount = (reply.likeCount || 0) + 1;
      this.forumReplies.set(id, reply);
    }
  }
}

// Database storage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  public sessionStore: SessionStore;
  private pgSessionStore: any;

  constructor() {
    const PgStore = connectPgSimple(session);
    
    this.pgSessionStore = new PgStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true
    });
    
    this.sessionStore = this.pgSessionStore;
    
    // Check if we need to initialize the database with sample data
    this.initializeForumTopicsIfEmpty();
  }
  
  // Initialize forum topics if the database is empty
  private async initializeForumTopicsIfEmpty() {
    try {
      // Check if there are any topics in the database
      const existingTopics = await db.select({ count: sql`count(*)` }).from(forumTopics);
      const count = Number(existingTopics[0]?.count || 0);
      
      if (count === 0) {
        console.log("Initializing forum topics in database...");
        const adminUser = await this.createDefaultAdminUser();
        
        // Create sample topics for each zodiac sign
        const zodiacSigns: ZodiacSign[] = [
          'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
          'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
        ];
        
        // Import initial topics from our data file
        import('../client/src/data/initialForumTopics').then(async ({ initialForumTopics }) => {
          for (const sign of zodiacSigns) {
            const signTopics = initialForumTopics[sign];
            if (signTopics) {
              for (const topicData of signTopics) {
                const now = new Date();
                
                try {
                  await db.insert(forumTopics).values({
                    title: topicData.title,
                    content: topicData.content,
                    userId: adminUser.id,
                    zodiacSign: sign,
                    category: topicData.category,
                    isPinned: topicData.isPinned || false,
                    viewCount: Math.floor(Math.random() * 50) + 5, // Random view count
                    likeCount: Math.floor(Math.random() * 10), // Random like count
                    createdAt: now,
                    updatedAt: now
                  });
                } catch (err) {
                  console.error(`Error inserting topic for ${sign}:`, err);
                }
              }
            }
          }
          console.log("Forum topics initialization complete");
        }).catch(err => {
          console.error("Failed to initialize forum topics:", err);
        });
      }
    } catch (err) {
      console.error("Error checking forum topics count:", err);
    }
  }
  
  // Create a default admin user for sample content
  private async createDefaultAdminUser(): Promise<User> {
    try {
      // Check if admin user already exists
      const existingAdmin = await this.getUserByEmail("admin@horoscopehealth.com");
      if (existingAdmin) {
        return existingAdmin;
      }
      
      // Create admin user if it doesn't exist
      const now = new Date();
      const [adminUser] = await db.insert(users).values({
        email: "admin@horoscopehealth.com",
        password: "hashed_password_placeholder", // In a real app, this would be properly hashed
        firstName: "Admin",
        lastName: "User",
        zodiacSign: "leo",
        birthdate: null,
        phone: null,
        smsOptIn: false,
        newsletterOptIn: true,
        createdAt: now
      }).returning();
      
      return adminUser as User;
    } catch (err) {
      console.error("Error creating admin user:", err);
      // Return a mock user as fallback
      return {
        id: 1,
        email: "admin@horoscopehealth.com",
        password: "hashed_password_placeholder",
        firstName: "Admin",
        lastName: "User",
        zodiacSign: "leo",
        birthdate: null,
        phone: null,
        smsOptIn: false,
        newsletterOptIn: true,
        createdAt: new Date(),
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionStatus: 'none',
        subscriptionTier: 'free',
        subscriptionEndDate: null
      };
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      // Use a specific column selection to avoid issues with missing columns
      const result = await db.select({
        id: users.id,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
        birthdate: users.birthdate,
        phone: users.phone,
        smsOptIn: users.smsOptIn,
        newsletterOptIn: users.newsletterOptIn,
        createdAt: users.createdAt
      }).from(users).where(eq(users.id, id));
      
      return result.length > 0 ? result[0] as User : undefined;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      // Use a specific column selection to avoid issues with missing columns
      const result = await db.select({
        id: users.id,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
        birthdate: users.birthdate,
        phone: users.phone,
        smsOptIn: users.smsOptIn,
        newsletterOptIn: users.newsletterOptIn,
        createdAt: users.createdAt
      }).from(users).where(eq(users.email, email));
      
      return result.length > 0 ? result[0] as User : undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }
  
  async getUsersByStripeCustomerId(stripeCustomerId: string): Promise<User[]> {
    try {
      // Since the stripeCustomerId column might not exist, we'll return an empty array
      console.log('Note: getUsersByStripeCustomerId may not work if column does not exist');
      return [];
      
      // If the column exists in the future, uncomment this code:
      /*
      const result = await db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, stripeCustomerId));
      
      return result; 
      */
    } catch (error) {
      console.error('Error getting users by Stripe customer ID:', error);
      return [];
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Select only the fields that exist in the database table
      const userFields = {
        email: insertUser.email,
        password: insertUser.password,
        firstName: insertUser.firstName,
        lastName: insertUser.lastName,
        zodiacSign: insertUser.zodiacSign,
        birthdate: insertUser.birthdate,
        phone: insertUser.phone,
        smsOptIn: insertUser.smsOptIn,
        newsletterOptIn: insertUser.newsletterOptIn
      };
      
      // Log the exact fields being inserted for debugging
      console.log('Creating user with fields:', userFields);
      
      const result = await db.insert(users).values(userFields).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    try {
      // Filter to only include fields that exist in the database table
      const validFields: Record<string, any> = {};
      
      if ('email' in updates) validFields.email = updates.email;
      if ('password' in updates) validFields.password = updates.password;
      if ('firstName' in updates) validFields.firstName = updates.firstName;
      if ('lastName' in updates) validFields.lastName = updates.lastName;
      if ('zodiacSign' in updates) validFields.zodiacSign = updates.zodiacSign;
      if ('birthdate' in updates) validFields.birthdate = updates.birthdate;
      if ('phone' in updates) validFields.phone = updates.phone;
      if ('smsOptIn' in updates) validFields.smsOptIn = updates.smsOptIn;
      if ('newsletterOptIn' in updates) validFields.newsletterOptIn = updates.newsletterOptIn;
      
      // Debug the update operation
      console.log('Updating user with fields:', validFields);
      
      const result = await db
        .update(users)
        .set(validFields)
        .where(eq(users.id, id))
        .returning();
      
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // Horoscope operations
  async getHoroscope(id: number): Promise<Horoscope | undefined> {
    try {
      const result = await db.select().from(horoscopes).where(eq(horoscopes.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('Error getting horoscope by ID:', error);
      return undefined;
    }
  }
  
  async getHoroscopeBySignAndDate(sign: string, date: string): Promise<Horoscope | undefined> {
    try {
      const result = await db
        .select()
        .from(horoscopes)
        .where(eq(horoscopes.zodiacSign, sign))
      
      // Filter for date in JavaScript
      const filtered = result.filter(h => h.date === date);
      return filtered.length > 0 ? filtered[0] : undefined;
    } catch (error) {
      console.error('Error getting horoscope by sign and date:', error);
      return undefined;
    }
  }
  
  async createHoroscope(insertHoroscope: InsertHoroscope): Promise<Horoscope> {
    try {
      const result = await db.insert(horoscopes).values(insertHoroscope).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating horoscope:', error);
      throw error;
    }
  }

  // Delivery operations
  async createDeliveryLog(insertLog: InsertDeliveryLog): Promise<DeliveryLog> {
    try {
      const result = await db.insert(deliveryLogs).values(insertLog).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating delivery log:', error);
      throw error;
    }
  }
  
  async getDeliveryLogsByUser(userId: number): Promise<DeliveryLog[]> {
    try {
      const result = await db
        .select()
        .from(deliveryLogs)
        .where(eq(deliveryLogs.userId, userId));
      
      return result;
    } catch (error) {
      console.error('Error getting delivery logs by user:', error);
      return [];
    }
  }

  // Additional query methods
  async getUsersByZodiacSign(sign: ZodiacSign): Promise<User[]> {
    try {
      // Use a specific column selection to avoid issues with missing columns
      const result = await db.select({
        id: users.id,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
        birthdate: users.birthdate,
        phone: users.phone,
        smsOptIn: users.smsOptIn,
        newsletterOptIn: users.newsletterOptIn,
        createdAt: users.createdAt
      }).from(users).where(eq(users.zodiacSign, sign));
      
      return result as User[];
    } catch (error) {
      console.error('Error getting users by zodiac sign:', error);
      return [];
    }
  }
  
  async getUsersForDailyDelivery(): Promise<User[]> {
    try {
      // In a real application, you would apply additional filters here
      // For example, only select users who have opted in for daily delivery
      // Use a specific column selection to avoid issues with missing columns
      const result = await db.select({
        id: users.id,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
        birthdate: users.birthdate,
        phone: users.phone,
        smsOptIn: users.smsOptIn,
        newsletterOptIn: users.newsletterOptIn,
        createdAt: users.createdAt
      }).from(users);
      
      return result as User[];
    } catch (error) {
      console.error('Error getting users for daily delivery:', error);
      return [];
    }
  }
  
  async getPremiumUsers(): Promise<User[]> {
    try {
      // Since subscription columns might not exist yet, return an empty array
      console.log('Note: getPremiumUsers may not work if columns do not exist');
      return [];
      
      // If the columns exist in the future, uncomment this code:
      /*
      const result = await db
        .select()
        .from(users)
        .where(eq(users.subscriptionStatus, 'active'));
      
      return result.filter(user => 
        user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro'
      );
      */
    } catch (error) {
      console.error('Error getting premium users:', error);
      return [];
    }
  }
  
  // Analytics-specific methods for database storage
  async getAllUsers(): Promise<User[]> {
    try {
      const result = await db.select({
        id: users.id,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        zodiacSign: users.zodiacSign,
        birthdate: users.birthdate,
        phone: users.phone,
        smsOptIn: users.smsOptIn,
        newsletterOptIn: users.newsletterOptIn,
        createdAt: users.createdAt
      }).from(users);
      
      return result as User[];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
  
  async getAllHoroscopes(): Promise<Horoscope[]> {
    try {
      const result = await db.select().from(horoscopes);
      return result;
    } catch (error) {
      console.error('Error getting all horoscopes:', error);
      return [];
    }
  }
  
  async getAllDeliveryLogs(): Promise<DeliveryLog[]> {
    try {
      const result = await db.select().from(deliveryLogs);
      return result;
    } catch (error) {
      console.error('Error getting all delivery logs:', error);
      return [];
    }
  }
  
  // Mock methods for analytics
  async getUserLoginHistory(userId: number): Promise<any[]> {
    try {
      // This would be implemented with actual database tables in a real app
      return [];
    } catch (error) {
      console.error('Error getting user login history:', error);
      return [];
    }
  }
  
  async getContentInteractions(contentType: string): Promise<any[]> {
    try {
      // This would be implemented with actual database tables in a real app
      return [];
    } catch (error) {
      console.error('Error getting content interactions:', error);
      return [];
    }
  }

  // Ad operations
  async getAd(id: number): Promise<Ad | undefined> {
    try {
      const result = await db.select().from(ads).where(eq(ads.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('Error getting ad by ID:', error);
      return undefined;
    }
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    try {
      const result = await db.insert(ads).values({
        ...insertAd,
        impressions: 0,
        clicks: 0
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating ad:', error);
      throw error;
    }
  }

  async updateAd(id: number, updates: Partial<InsertAd>): Promise<Ad | undefined> {
    try {
      const result = await db
        .update(ads)
        .set(updates)
        .where(eq(ads.id, id))
        .returning();
      
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('Error updating ad:', error);
      return undefined;
    }
  }

  async deleteAd(id: number): Promise<boolean> {
    try {
      await db.delete(ads).where(eq(ads.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting ad:', error);
      return false;
    }
  }

  async getAllAds(): Promise<Ad[]> {
    try {
      const result = await db.select().from(ads);
      return result;
    } catch (error) {
      console.error('Error getting all ads:', error);
      return [];
    }
  }

  async getActiveAds(): Promise<Ad[]> {
    try {
      const result = await db
        .select()
        .from(ads)
        .where(eq(ads.isActive, true));
      
      return result;
    } catch (error) {
      console.error('Error getting active ads:', error);
      return [];
    }
  }

  async getAdsByPosition(position: string): Promise<Ad[]> {
    try {
      const result = await db
        .select()
        .from(ads)
        .where(
          and(
            eq(ads.isActive, true),
            eq(ads.position, position)
          )
        );
      
      return result;
    } catch (error) {
      console.error('Error getting ads by position:', error);
      return [];
    }
  }

  async incrementAdImpressions(id: number): Promise<void> {
    try {
      const ad = await this.getAd(id);
      if (ad) {
        const currentImpressions = ad.impressions || 0;
        await db
          .update(ads)
          .set({ impressions: currentImpressions + 1 })
          .where(eq(ads.id, id));
      }
    } catch (error) {
      console.error('Error incrementing ad impressions:', error);
    }
  }

  async incrementAdClicks(id: number): Promise<void> {
    try {
      const ad = await this.getAd(id);
      if (ad) {
        const currentClicks = ad.clicks || 0;
        await db
          .update(ads)
          .set({ clicks: currentClicks + 1 })
          .where(eq(ads.id, id));
      }
    } catch (error) {
      console.error('Error incrementing ad clicks:', error);
    }
  }

  // Forum Topic operations
  async getForumTopic(id: number): Promise<ForumTopic | undefined> {
    try {
      const result = await db.select().from(forumTopics).where(eq(forumTopics.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('Error getting forum topic by ID:', error);
      return undefined;
    }
  }

  async getForumTopicsByZodiacSign(sign: string, limit?: number, offset?: number): Promise<ForumTopic[]> {
    try {
      let query = db.select().from(forumTopics).where(eq(forumTopics.zodiacSign, sign));
      
      // Apply pagination if specified - this would be better handled with proper SQL limits
      // but we'll keep it simple for now
      const result = await query;
      
      let topics = [...result];
      
      // Sort by most recent first
      topics.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      // Apply pagination
      if (offset !== undefined && limit !== undefined) {
        topics = topics.slice(offset, offset + limit);
      } else if (limit !== undefined) {
        topics = topics.slice(0, limit);
      }
      
      return topics;
    } catch (error) {
      console.error('Error getting forum topics by zodiac sign:', error);
      return [];
    }
  }

  async createForumTopic(insertTopic: InsertForumTopic): Promise<ForumTopic> {
    try {
      const result = await db.insert(forumTopics).values(insertTopic).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating forum topic:', error);
      throw error;
    }
  }

  async updateForumTopic(id: number, updates: Partial<InsertForumTopic>): Promise<ForumTopic | undefined> {
    try {
      // Include updatedAt timestamp
      const updateData = { ...updates, updatedAt: new Date() };
      
      const result = await db
        .update(forumTopics)
        .set(updateData)
        .where(eq(forumTopics.id, id))
        .returning();
      
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('Error updating forum topic:', error);
      return undefined;
    }
  }

  async deleteForumTopic(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(forumTopics)
        .where(eq(forumTopics.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting forum topic:', error);
      return false;
    }
  }

  async incrementTopicViewCount(id: number): Promise<void> {
    try {
      await db
        .update(forumTopics)
        .set({ viewCount: sql`${forumTopics.viewCount} + 1` })
        .where(eq(forumTopics.id, id));
    } catch (error) {
      console.error('Error incrementing topic view count:', error);
    }
  }

  async incrementTopicLikeCount(id: number): Promise<void> {
    try {
      await db
        .update(forumTopics)
        .set({ likeCount: sql`${forumTopics.likeCount} + 1` })
        .where(eq(forumTopics.id, id));
    } catch (error) {
      console.error('Error incrementing topic like count:', error);
    }
  }

  // Forum Reply operations
  async getForumReply(id: number): Promise<ForumReply | undefined> {
    try {
      const result = await db.select().from(forumReplies).where(eq(forumReplies.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('Error getting forum reply by ID:', error);
      return undefined;
    }
  }

  async getForumRepliesByTopicId(topicId: number, limit?: number, offset?: number): Promise<ForumReply[]> {
    try {
      let query = db.select().from(forumReplies).where(eq(forumReplies.topicId, topicId));
      
      const result = await query;
      
      let replies = [...result];
      
      // Sort by oldest first by default (chronological order)
      replies.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      
      // Apply pagination
      if (offset !== undefined && limit !== undefined) {
        replies = replies.slice(offset, offset + limit);
      } else if (limit !== undefined) {
        replies = replies.slice(0, limit);
      }
      
      return replies;
    } catch (error) {
      console.error('Error getting forum replies by topic ID:', error);
      return [];
    }
  }

  async createForumReply(insertReply: InsertForumReply): Promise<ForumReply> {
    try {
      const result = await db.insert(forumReplies).values(insertReply).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating forum reply:', error);
      throw error;
    }
  }

  async updateForumReply(id: number, updates: Partial<InsertForumReply>): Promise<ForumReply | undefined> {
    try {
      // Include updatedAt timestamp
      const updateData = { ...updates, updatedAt: new Date() };
      
      const result = await db
        .update(forumReplies)
        .set(updateData)
        .where(eq(forumReplies.id, id))
        .returning();
      
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('Error updating forum reply:', error);
      return undefined;
    }
  }

  async deleteForumReply(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(forumReplies)
        .where(eq(forumReplies.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting forum reply:', error);
      return false;
    }
  }

  async incrementReplyLikeCount(id: number): Promise<void> {
    try {
      await db
        .update(forumReplies)
        .set({ likeCount: sql`${forumReplies.likeCount} + 1` })
        .where(eq(forumReplies.id, id));
    } catch (error) {
      console.error('Error incrementing reply like count:', error);
    }
  }
}

// Temporarily using memory storage for ad testing
// We'll switch back to database storage after migrations are properly set up
export const storage = new MemStorage();
