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

// modify the interface with any CRUD methods
// you might need

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
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private horoscopes: Map<number, Horoscope>;
  private deliveryLogs: Map<number, DeliveryLog>;
  private userCurrentId: number;
  private horoscopeCurrentId: number;
  private deliveryLogCurrentId: number;

  constructor() {
    this.users = new Map();
    this.horoscopes = new Map();
    this.deliveryLogs = new Map();
    this.userCurrentId = 1;
    this.horoscopeCurrentId = 1;
    this.deliveryLogCurrentId = 1;
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
    const user: User = { ...insertUser, id, createdAt };
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

export const storage = new MemStorage();
