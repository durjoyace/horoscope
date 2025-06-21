import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType } from "@shared/schema";
import { sendWelcomeSMS } from "./sms-service";

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

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error("No email found in Google profile"), false);
            }

            // Check if user already exists
            let user = await storage.getUserByEmail(email);
            
            if (user) {
              // Update Google ID if not set
              if (!user.googleId) {
                user = await storage.updateUserGoogleId(user.id, profile.id);
              }
              return done(null, user);
            } else {
              // Create new user with Google data
              const newUser = await storage.createUser({
                email,
                firstName: profile.name?.givenName || null,
                lastName: profile.name?.familyName || null,
                googleId: profile.id,
                zodiacSign: 'gemini', // Default - user will be prompted to update
                phone: null,
                password: null, // No password for OAuth users
                smsOptIn: false,
                emailOptIn: true,
                preferredDelivery: 'email',
              });
              
              return done(null, newUser);
            }
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, password, firstName, lastName, zodiacSign, phone, smsOptIn, emailOptIn } = req.body;
      
      if (!email || !password || !zodiacSign || !phone) {
        return res.status(400).json({
          success: false,
          message: "Email, password, phone number, and zodiac sign are required"
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
        phone,
        smsOptIn: smsOptIn !== false, // Default to true
        emailOptIn: emailOptIn === true, // Default to false
        preferredDelivery: 'sms',
      });

      // Send welcome SMS if user opted in
      if (user.smsOptIn && user.phone) {
        try {
          await sendWelcomeSMS(user);
        } catch (error) {
          console.error('Failed to send welcome SMS:', error);
        }
      }

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
            phone: user.phone,
            smsOptIn: user.smsOptIn,
            emailOptIn: user.emailOptIn,
            isPremium: false
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
            isPremium: false
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
        isPremium: false
      }
    });
  });

  // Google OAuth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth?error=google_auth_failed" }),
    (req, res) => {
      // Check if user needs to complete profile (no zodiac sign or phone)
      if (!req.user.zodiacSign || req.user.zodiacSign === 'gemini' || !req.user.phone) {
        res.redirect("/auth?complete_profile=true");
      } else {
        res.redirect("/");
      }
    }
  );

  // Magic link authentication for passwordless login
  app.post("/api/auth/magic-link", async (req, res) => {
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
          message: "No account found with this email"
        });
      }

      // Generate magic link token
      const token = randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      
      await storage.createMagicLink(user.id, token, expires);
      
      // Send magic link via email (implement email service)
      // For now, return the token for testing
      res.json({
        success: true,
        message: "Magic link sent to your email",
        // Remove token in production
        ...(process.env.NODE_ENV === 'development' && { token })
      });
    } catch (error) {
      console.error("Magic link error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send magic link"
      });
    }
  });

  app.get("/api/auth/magic/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      const magicLink = await storage.getMagicLink(token);
      if (!magicLink || magicLink.expires < new Date()) {
        return res.redirect("/auth?error=invalid_token");
      }

      const user = await storage.getUser(magicLink.userId);
      if (!user) {
        return res.redirect("/auth?error=user_not_found");
      }

      // Delete used magic link
      await storage.deleteMagicLink(token);

      req.login(user, (err) => {
        if (err) {
          return res.redirect("/auth?error=login_failed");
        }
        res.redirect("/");
      });
    } catch (error) {
      console.error("Magic link verification error:", error);
      res.redirect("/auth?error=verification_failed");
    }
  });
}