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
import { ZodiacSign } from "@shared/types";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";

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
  zodiacSign: z.string({ required_error: "Please select your zodiac sign" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation, loginWithGoogle } = useAuth();
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

  // Initialize the register form with default empty values first
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      zodiacSign: "",
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
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
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
                      control={registerForm.control}
                      name="zodiacSign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zodiac Sign</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your zodiac sign" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="aries">Aries</SelectItem>
                              <SelectItem value="taurus">Taurus</SelectItem>
                              <SelectItem value="gemini">Gemini</SelectItem>
                              <SelectItem value="cancer">Cancer</SelectItem>
                              <SelectItem value="leo">Leo</SelectItem>
                              <SelectItem value="virgo">Virgo</SelectItem>
                              <SelectItem value="libra">Libra</SelectItem>
                              <SelectItem value="scorpio">Scorpio</SelectItem>
                              <SelectItem value="sagittarius">Sagittarius</SelectItem>
                              <SelectItem value="capricorn">Capricorn</SelectItem>
                              <SelectItem value="aquarius">Aquarius</SelectItem>
                              <SelectItem value="pisces">Pisces</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Your personalized horoscope will be based on your zodiac sign
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
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
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
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