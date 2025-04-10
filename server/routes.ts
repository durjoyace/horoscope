import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { zodiacSignSchema } from "../shared/schema";
import { getHoroscopeForSign, generateDailyHoroscopes } from "./horoscope-generator";
import { deliverHoroscopeToUser } from "./scheduler";
import { format } from "date-fns";
import { initializeScheduler } from "./scheduler";
import { 
  createStripeCustomer, 
  createCheckoutSession, 
  pricingPlans, 
  updateUserSubscriptionStatus,
  getSubscription,
  cancelSubscription,
  createPaymentIntent
} from "./stripe-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the scheduler for daily horoscope generation and delivery
  initializeScheduler();

  // User signup endpoint
  app.post("/api/signup", async (req: Request, res: Response) => {
    try {
      console.log('Server - Signup request received:', {
        email: req.body.email,
        zodiacSign: req.body.zodiacSign,
        firstName: req.body.firstName,
      });
      
      const userInputSchema = z.object({
        email: z.string().email("Invalid email format"),
        zodiacSign: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        smsOptIn: z.boolean().default(false),
        birthdate: z.string().optional(),
        password: z.string().optional(),
      });

      const validatedInput = userInputSchema.parse(req.body);
      console.log('Server - Validated input:', {
        email: validatedInput.email,
        zodiacSign: validatedInput.zodiacSign,
        smsOptIn: validatedInput.smsOptIn,
      });
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedInput.email);
      if (existingUser) {
        console.log('Server - User already exists:', existingUser.email);
        return res.status(200).json({ 
          success: true, 
          message: "Welcome back! We'll continue sending your daily horoscopes.",
          user: {
            email: existingUser.email,
            zodiacSign: existingUser.zodiacSign
          }
        });
      }
      
      console.log('Server - Creating new user with zodiacSign:', validatedInput.zodiacSign);
      
      // Create new user
      const newUser = await storage.createUser({
        email: validatedInput.email,
        zodiacSign: validatedInput.zodiacSign,
        firstName: validatedInput.firstName,
        lastName: validatedInput.lastName,
        phone: validatedInput.phone,
        smsOptIn: validatedInput.smsOptIn,
        birthdate: validatedInput.birthdate,
        password: validatedInput.password || null,
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

  // Get subscription plans
  app.get("/api/subscription/plans", (req: Request, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        plans: pricingPlans
      });
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve subscription plans. Please try again later."
      });
    }
  });

  // Get user subscription status
  app.get("/api/subscription/status", async (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      const user = await storage.getUserByEmail(email as string);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.status(200).json({
        success: true,
        subscription: {
          status: user.subscriptionStatus,
          tier: user.subscriptionTier,
          endsAt: user.subscriptionEndDate
        }
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve subscription status. Please try again later."
      });
    }
  });

  // Create Stripe checkout session for subscription
  app.post("/api/subscription/create-checkout", async (req: Request, res: Response) => {
    try {
      const { email, priceId, successUrl, cancelUrl } = req.body;
      
      if (!email || !priceId || !successUrl || !cancelUrl) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: email, priceId, successUrl, or cancelUrl"
        });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Create or get Stripe customer
      const customerId = await createStripeCustomer(user);
      
      // Create checkout session
      const session = await createCheckoutSession(
        customerId,
        priceId,
        successUrl,
        cancelUrl
      );

      res.status(200).json({
        success: true,
        sessionId: session.id,
        url: session.url
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({
        success: false,
        message: "Could not create checkout session. Please try again later."
      });
    }
  });

  // Create payment intent for subscription
  app.post("/api/subscription/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { email, amount } = req.body;
      
      if (!email || !amount) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: email or amount"
        });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Create or get Stripe customer
      const customerId = await createStripeCustomer(user);
      
      // Create payment intent (amount in cents)
      const paymentIntent = await createPaymentIntent(
        Math.round(parseFloat(amount.toString()) * 100),
        customerId
      );

      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        success: false,
        message: "Could not create payment intent. Please try again later."
      });
    }
  });

  // Cancel subscription
  app.post("/api/subscription/cancel", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({
          success: false,
          message: "No active subscription found"
        });
      }

      // Cancel the subscription in Stripe
      await cancelSubscription(user.stripeSubscriptionId);
      
      // Update user subscription status in our database
      await updateUserSubscriptionStatus(
        user.id,
        'canceled',
        'free',
        undefined
      );

      res.status(200).json({
        success: true,
        message: "Subscription successfully canceled"
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({
        success: false,
        message: "Could not cancel subscription. Please try again later."
      });
    }
  });
  
  // Get premium weekly report
  app.get("/api/premium/weekly-report", async (req: Request, res: Response) => {
    try {
      const { email, sign } = req.query;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      const user = await storage.getUserByEmail(email as string);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Check if user has premium access
      if (user.subscriptionTier !== 'premium' && user.subscriptionTier !== 'pro' || 
          user.subscriptionStatus !== 'active') {
        return res.status(403).json({
          success: false,
          message: "Premium subscription required to access weekly reports",
          subscriptionRequired: true
        });
      }

      // Determine which zodiac sign to use (user's sign or requested sign)
      const zodiacSign = sign ? (sign as string).toLowerCase() : user.zodiacSign;
      
      // Validate zodiac sign
      if (!['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
             'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'].includes(zodiacSign)) {
        return res.status(400).json({
          success: false,
          message: "Invalid zodiac sign"
        });
      }

      // Calculate the current week's start and end dates
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as the first day
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const weekStartDate = format(startOfWeek, 'yyyy-MM-dd');
      const weekEndDate = format(endOfWeek, 'yyyy-MM-dd');

      // Find existing premium report or generate a new one
      let premiumReport = await findPremiumReport(zodiacSign, weekStartDate, weekEndDate);
      
      if (!premiumReport) {
        // In a real app, we would generate a new premium report here
        // For now, we'll create a mock report
        const reportContent = generateMockPremiumReport(zodiacSign, startOfWeek, endOfWeek);
        
        premiumReport = {
          sign: zodiacSign,
          weekStartDate,
          weekEndDate,
          content: reportContent
        };
      }

      res.status(200).json({
        success: true,
        premiumReport
      });
    } catch (error) {
      console.error("Error fetching premium weekly report:", error);
      res.status(500).json({
        success: false,
        message: "Could not retrieve premium weekly report. Please try again later."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
