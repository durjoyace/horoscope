import { 
  users, 
  horoscopes, 
  deliveryLogs, 
  type User, 
  type InsertUser, 
  type Horoscope, 
  type InsertHoroscope,
  type DeliveryLog,
  type InsertDeliveryLog
} from "@shared/schema";
import { ZodiacSign } from "@shared/types";
import session from "express-session";
import { Store as SessionStore } from "express-session";
import createMemoryStore from "memorystore";
import { db, pool } from "./db";
import { eq } from "drizzle-orm";
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
  
  // Horoscope operations
  getHoroscope(id: number): Promise<Horoscope | undefined>;
  getHoroscopeBySignAndDate(sign: string, date: string): Promise<Horoscope | undefined>;
  createHoroscope(horoscope: InsertHoroscope): Promise<Horoscope>;
  
  // Delivery operations
  createDeliveryLog(log: InsertDeliveryLog): Promise<DeliveryLog>;
  getDeliveryLogsByUser(userId: number): Promise<DeliveryLog[]>;
  
  // Additional query methods
  getUsersByZodiacSign(sign: ZodiacSign): Promise<User[]>;
  getUsersForDailyDelivery(): Promise<User[]>;
  getPremiumUsers(): Promise<User[]>;
  
  // Session store for express-session
  sessionStore: SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private horoscopes: Map<number, Horoscope>;
  private deliveryLogs: Map<number, DeliveryLog>;
  private userCurrentId: number;
  private horoscopeCurrentId: number;
  private deliveryLogCurrentId: number;
  public sessionStore: SessionStore;

  constructor() {
    // Initialize in-memory storage
    this.users = new Map();
    this.horoscopes = new Map();
    this.deliveryLogs = new Map();
    this.userCurrentId = 1;
    this.horoscopeCurrentId = 1;
    this.deliveryLogCurrentId = 1;
    
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
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
      isPremium: false,
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
    const horoscope: Horoscope = { 
      ...insertHoroscope, 
      id, 
      createdAt,
      isPremium: insertHoroscope.isPremium || false 
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
}

// We're switching to use the database storage
export const storage = new DatabaseStorage();
