import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ZodiacSign } from "@shared/types";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().min(10, { message: "Please enter a valid phone number" })
    .regex(/^\+?[\d\s\-\(\)]+$/, { message: "Please enter a valid phone number" }),
  zodiacSign: z.string({ required_error: "Please select your zodiac sign" }),
  smsOptIn: z.boolean().default(true),
  emailOptIn: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const signupParam = searchParams.get("signup");

  // Check for data from localStorage
  const [storedUserData, setStoredUserData] = useState<{
    email?: string;
    zodiacSign?: ZodiacSign;
  } | null>(null);



  useEffect(() => {
    // Redirect to home if user is already logged in with the auth system
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Initialize the register form with SMS-focused defaults
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      zodiacSign: "",
      phone: "",
      smsOptIn: true, // Default to SMS since it's the primary delivery method
      emailOptIn: false,
    },
  });
  
  // Use a separate useEffect to load and apply data from localStorage
  useEffect(() => {
    // Try to get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setStoredUserData(userData);
        
        // Auto-switch to register tab if we have data
        setActiveTab("register");
        
        // Set the form values
        if (userData.email) {
          registerForm.setValue("email", userData.email);
        }
        if (userData.zodiacSign) {
          registerForm.setValue("zodiacSign", userData.zodiacSign);
        }
        
        console.log("Loaded user data from localStorage:", userData);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
      }
    }

    // Also check query parameters
    if (signupParam === "true") {
      setActiveTab("register");
    }
    
    // Check for signup success
    const signupSuccess = localStorage.getItem("signupSuccess");
    if (signupSuccess === "true") {
      // Remove it to prevent showing multiple times
      localStorage.removeItem("signupSuccess");
    }
  }, [signupParam, registerForm, setActiveTab]);

  const onLoginSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate({
      ...registerData,
      zodiacSign: registerData.zodiacSign as ZodiacSign,
    });
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-8 md:w-1/2 md:pr-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome to HoroscopeHealth</h1>
          <p className="text-muted-foreground">Sign in or create an account to access your personalized health horoscopes</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <span className="mr-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                          Logging in...
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Join HoroscopeHealth to get personalized health insights</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                    {/* Name field - single input */}
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone Number */}
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="+1 555-123-4567" 
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            Receive daily horoscopes via SMS
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Zodiac Sign with visual enhancement */}
                    <FormField
                      control={registerForm.control}
                      name="zodiacSign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Zodiac Sign</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Choose your sign" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="aries">♈ Aries (Mar 21 - Apr 19)</SelectItem>
                              <SelectItem value="taurus">♉ Taurus (Apr 20 - May 20)</SelectItem>
                              <SelectItem value="gemini">♊ Gemini (May 21 - Jun 20)</SelectItem>
                              <SelectItem value="cancer">♋ Cancer (Jun 21 - Jul 22)</SelectItem>
                              <SelectItem value="leo">♌ Leo (Jul 23 - Aug 22)</SelectItem>
                              <SelectItem value="virgo">♍ Virgo (Aug 23 - Sep 22)</SelectItem>
                              <SelectItem value="libra">♎ Libra (Sep 23 - Oct 22)</SelectItem>
                              <SelectItem value="scorpio">♏ Scorpio (Oct 23 - Nov 21)</SelectItem>
                              <SelectItem value="sagittarius">♐ Sagittarius (Nov 22 - Dec 21)</SelectItem>
                              <SelectItem value="capricorn">♑ Capricorn (Dec 22 - Jan 19)</SelectItem>
                              <SelectItem value="aquarius">♒ Aquarius (Jan 20 - Feb 18)</SelectItem>
                              <SelectItem value="pisces">♓ Pisces (Feb 19 - Mar 20)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Simple opt-in with default checked */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <FormField
                        control={registerForm.control}
                        name="smsOptIn"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-purple-600"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium text-purple-900 dark:text-purple-100">
                                📱 Get daily horoscopes via SMS
                              </FormLabel>
                              <FormDescription className="text-xs text-purple-700 dark:text-purple-300">
                                Your personalized wellness insights delivered daily
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <span className="mr-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                          Setting up your horoscopes...
                        </>
                      ) : (
                        "🌟 Start My Horoscope Journey"
                      )}
                    </Button>
                    
                    <p className="text-xs text-center text-gray-500 mt-3">
                      By signing up, you agree to receive personalized horoscope messages. Unsubscribe anytime.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="hidden md:block md:w-1/2 pl-8">
        <div className="zodiac-card">
          <h2 className="text-2xl font-bold mb-4 text-primary">Your Horoscope Health Journey</h2>
          <p className="mb-4">Join us to discover how the stars influence your wellness and receive personalized health guidance aligned with your zodiac sign.</p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 mt-0.5 rounded-full bg-primary flex items-center justify-center text-white text-sm">✓</div>
              <div>
                <h3 className="font-medium">Daily Health Horoscopes</h3>
                <p className="text-sm text-muted-foreground">Personalized wellness insights delivered to your inbox daily</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 mt-0.5 rounded-full bg-primary flex items-center justify-center text-white text-sm">✓</div>
              <div>
                <h3 className="font-medium">Zodiac-based Wellness</h3>
                <p className="text-sm text-muted-foreground">Recommendations that align with your astrological profile</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 mt-0.5 rounded-full bg-primary flex items-center justify-center text-white text-sm">✓</div>
              <div>
                <h3 className="font-medium">Premium Reports</h3>
                <p className="text-sm text-muted-foreground">Unlock deeper insights with our premium membership</p>
              </div>
            </div>
          </div>
          
          <div className="italic text-sm text-muted-foreground">
            "The stars incline; they do not compel. Your health journey is guided by the cosmos but shaped by your choices."
          </div>
        </div>
      </div>
    </div>
  );
}