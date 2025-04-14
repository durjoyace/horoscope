import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// List of admin emails - can be extended as needed
const ADMIN_EMAILS = ['admin@horoscopehealth.com'];

// Helper to check if a user is an admin
export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
}

// Middleware to check for admin role
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }
  
  if (!req.user || !isAdmin(req.user.email)) {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }
  
  next();
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "horohealthsecret2025",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !user.password || !(await comparePasswords(password, user.password))) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Regular email/password registration
  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, password, firstName, lastName, zodiacSign } = req.body;
      
      if (!email || !password || !zodiacSign) {
        return res.status(400).json({
          success: false,
          message: "Email, password and zodiac sign are required"
        });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered"
        });
      }

      const hashedPassword = await hashPassword(password);
      
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        zodiacSign,
        newsletterOptIn: true,
        smsOptIn: false,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          success: true,
          message: "Registration successful",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            zodiacSign: user.zodiacSign,
            isPremium: false,
            isAdmin: isAdmin(user.email)
          }
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed. Please try again later."
      });
    }
  });

  // Google authentication handler
  app.post("/api/auth/google", async (req, res, next) => {
    try {
      const { 
        email, 
        uid, 
        displayName, 
        photoURL,
        zodiacSign 
      } = req.body;
      
      if (!email || !uid) {
        return res.status(400).json({
          success: false,
          message: "Email and UID are required"
        });
      }
      
      // Check if user exists already
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // New user - create account
        if (!zodiacSign) {
          return res.status(400).json({
            success: false,
            message: "Zodiac sign is required for new users"
          });
        }
        
        const nameParts = (displayName || '').split(' ');
        const firstName = nameParts[0] || null;
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
        
        user = await storage.createUser({
          email,
          password: null, // No password for Google auth
          firstName,
          lastName,
          zodiacSign,
          newsletterOptIn: true,
          smsOptIn: false,
          authProvider: 'google',
          providerUserId: uid,
          photoUrl: photoURL || null
        });
      } else {
        // Existing user - update provider info if needed
        if (!user.authProvider || !user.providerUserId) {
          user = await storage.updateUser(user.id, {
            authProvider: 'google',
            providerUserId: uid,
            photoUrl: photoURL || user.photoUrl
          });
        }
      }

      if (!user) {
        return res.status(500).json({
          success: false,
          message: "Failed to authenticate user"
        });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json({
          success: true,
          message: "Google authentication successful",
          user: {
            id: user!.id,
            email: user!.email,
            firstName: user!.firstName,
            lastName: user!.lastName,
            zodiacSign: user!.zodiacSign,
            photoUrl: user!.photoUrl,
            isPremium: user!.subscriptionTier === 'premium' || user!.subscriptionTier === 'pro',
            isAdmin: isAdmin(user!.email)
          }
        });
      });
    } catch (error) {
      console.error("Google authentication error:", error);
      res.status(500).json({
        success: false,
        message: "Authentication failed. Please try again later."
      });
    }
  });

  // Regular email/password login
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: UserType | false, info: any) => {
      if (err) return next(err);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        res.status(200).json({
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            zodiacSign: user.zodiacSign,
            photoUrl: user.photoUrl,
            isPremium: user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro',
            isAdmin: isAdmin(user.email)
          }
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Logout failed"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Logged out successfully"
      });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        zodiacSign: req.user.zodiacSign,
        photoUrl: req.user.photoUrl,
        isPremium: req.user.subscriptionTier === 'premium' || req.user.subscriptionTier === 'pro',
        isAdmin: isAdmin(req.user.email)
      }
    });
  });
}