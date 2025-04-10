import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { zodiacSignSchema } from "../shared/schema";
import { getHoroscopeForSign, generateDailyHoroscopes } from "./horoscope-generator";
import { deliverHoroscopeToUser } from "./scheduler";
import { format } from "date-fns";
import { initializeScheduler } from "./scheduler";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the scheduler for daily horoscope generation and delivery
  initializeScheduler();

  // User signup endpoint
  app.post("/api/signup", async (req: Request, res: Response) => {
    try {
      const userInputSchema = z.object({
        email: z.string().email("Invalid email format"),
        zodiacSign: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        smsOptIn: z.boolean().default(false),
        birthdate: z.string().optional(),
      });

      const validatedInput = userInputSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedInput.email);
      if (existingUser) {
        return res.status(200).json({ 
          success: true, 
          message: "Welcome back! We'll continue sending your daily horoscopes.",
          user: {
            email: existingUser.email,
            zodiacSign: existingUser.zodiacSign
          }
        });
      }
      
      // Create new user
      const newUser = await storage.createUser({
        email: validatedInput.email,
        zodiacSign: validatedInput.zodiacSign,
        firstName: validatedInput.firstName,
        lastName: validatedInput.lastName,
        phone: validatedInput.phone,
        smsOptIn: validatedInput.smsOptIn,
        birthdate: validatedInput.birthdate,
        password: null,
        newsletterOptIn: true,
      });
      
      res.status(201).json({ 
        success: true, 
        message: "Successfully signed up for daily health horoscopes!",
        user: {
          email: newUser.email,
          zodiacSign: newUser.zodiacSign
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid input",
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        success: false, 
        message: "Could not process signup. Please try again later." 
      });
    }
  });

  // Get today's horoscope for a specific sign
  app.get("/api/horoscope/:sign", async (req: Request, res: Response) => {
    try {
      const sign = req.params.sign.toLowerCase();
      const date = req.query.date as string || format(new Date(), 'yyyy-MM-dd');
      
      // Validate zodiac sign
      if (!['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
             'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'].includes(sign)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid zodiac sign" 
        });
      }
      
      const horoscopeContent = await getHoroscopeForSign(sign as any, date);
      
      res.status(200).json({
        success: true,
        sign,
        date,
        content: horoscopeContent
      });
    } catch (error) {
      console.error("Error fetching horoscope:", error);
      res.status(500).json({ 
        success: false, 
        message: "Could not retrieve horoscope. Please try again later." 
      });
    }
  });

  // Test endpoint to trigger horoscope generation for all signs
  app.post("/api/admin/generate-horoscopes", async (req: Request, res: Response) => {
    try {
      const date = req.body.date || format(new Date(), 'yyyy-MM-dd');
      
      // Start the generation process (async)
      generateDailyHoroscopes(date).catch(err => {
        console.error("Error in horoscope generation job:", err);
      });
      
      res.status(202).json({ 
        success: true, 
        message: `Horoscope generation for ${date} started in the background` 
      });
    } catch (error) {
      console.error("Error starting horoscope generation:", error);
      res.status(500).json({ 
        success: false, 
        message: "Could not start horoscope generation. Please try again later." 
      });
    }
  });

  // Test endpoint to deliver horoscope to a specific user
  app.post("/api/admin/deliver-horoscope", async (req: Request, res: Response) => {
    try {
      const { email, date } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is required" 
        });
      }
      
      const targetDate = date || format(new Date(), 'yyyy-MM-dd');
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }
      
      // Start the delivery process (async)
      deliverHoroscopeToUser(user, targetDate).catch(err => {
        console.error(`Error delivering horoscope to ${email}:`, err);
      });
      
      res.status(202).json({ 
        success: true, 
        message: `Horoscope delivery to ${email} for ${targetDate} started in the background` 
      });
    } catch (error) {
      console.error("Error starting horoscope delivery:", error);
      res.status(500).json({ 
        success: false, 
        message: "Could not start horoscope delivery. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
