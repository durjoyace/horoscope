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
import { eq } from "drizzle-orm";
import { db, pool } from "./db";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface with CRUD methods
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
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
  
  // Session store for express-session
  sessionStore: session.Store;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private horoscopes: Map<number, Horoscope>;
  private deliveryLogs: Map<number, DeliveryLog>;
  private userCurrentId: number;
  private horoscopeCurrentId: number;
  private deliveryLogCurrentId: number;
  public sessionStore: session.Store;

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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      password: insertUser.password || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      birthdate: insertUser.birthdate || null,
      phone: insertUser.phone || null,
      smsOptIn: insertUser.smsOptIn !== undefined ? insertUser.smsOptIn : false,
      newsletterOptIn: insertUser.newsletterOptIn !== undefined ? insertUser.newsletterOptIn : true
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
    const horoscope: Horoscope = { ...insertHoroscope, id, createdAt };
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
}

// Database storage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, id))
        .returning();
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // Horoscope operations
  async getHoroscope(id: number): Promise<Horoscope | undefined> {
    try {
      const [horoscope] = await db.select().from(horoscopes).where(eq(horoscopes.id, id));
      return horoscope;
    } catch (error) {
      console.error('Error getting horoscope by ID:', error);
      return undefined;
    }
  }
  
  async getHoroscopeBySignAndDate(sign: string, date: string): Promise<Horoscope | undefined> {
    try {
      const [horoscope] = await db
        .select()
        .from(horoscopes)
        .where(eq(horoscopes.zodiacSign, sign))
        .where(eq(horoscopes.date, date));
      
      return horoscope;
    } catch (error) {
      console.error('Error getting horoscope by sign and date:', error);
      return undefined;
    }
  }
  
  async createHoroscope(insertHoroscope: InsertHoroscope): Promise<Horoscope> {
    try {
      const [horoscope] = await db.insert(horoscopes).values(insertHoroscope).returning();
      return horoscope;
    } catch (error) {
      console.error('Error creating horoscope:', error);
      throw error;
    }
  }

  // Delivery operations
  async createDeliveryLog(insertLog: InsertDeliveryLog): Promise<DeliveryLog> {
    try {
      const [log] = await db.insert(deliveryLogs).values(insertLog).returning();
      return log;
    } catch (error) {
      console.error('Error creating delivery log:', error);
      throw error;
    }
  }
  
  async getDeliveryLogsByUser(userId: number): Promise<DeliveryLog[]> {
    try {
      return await db
        .select()
        .from(deliveryLogs)
        .where(eq(deliveryLogs.userId, userId));
    } catch (error) {
      console.error('Error getting delivery logs by user:', error);
      return [];
    }
  }

  // Additional query methods
  async getUsersByZodiacSign(sign: ZodiacSign): Promise<User[]> {
    try {
      return await db
        .select()
        .from(users)
        .where(eq(users.zodiacSign, sign));
    } catch (error) {
      console.error('Error getting users by zodiac sign:', error);
      return [];
    }
  }
  
  async getUsersForDailyDelivery(): Promise<User[]> {
    try {
      // In a real application, you would apply additional filters here
      // For example, only select users who have opted in for daily delivery
      return await db.select().from(users);
    } catch (error) {
      console.error('Error getting users for daily delivery:', error);
      return [];
    }
  }
}

// Use DatabaseStorage instead of MemStorage since we've added a database
export const storage = new DatabaseStorage();