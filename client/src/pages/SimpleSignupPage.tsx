import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { ZodiacSign } from "@shared/types";
import { Phone, Mail, Stars, MessageSquare, Shield } from "lucide-react";

// Simplified signup schema - only essentials
const signupSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  zodiacSign: z.string().min(1, "Please select your zodiac sign"),
  smsOptIn: z.boolean().default(true),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SimpleSignupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phone: "",
      zodiacSign: "",
      smsOptIn: true,
    },
  });

  // Pre-populate phone number from homepage
  useEffect(() => {
    const pendingPhone = localStorage.getItem('pendingSignupPhone');
    if (pendingPhone) {
      form.setValue('phone', pendingPhone);
      localStorage.removeItem('pendingSignupPhone');
    }
  }, [form]);

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormValues) => {
      const response = await apiRequest('POST', '/api/signup', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "Welcome to HoroscopeHealth!",
          description: "Your daily horoscopes will start arriving via SMS",
        });
        
        // Redirect to home after a moment
        setTimeout(() => {
          setLocation("/");
        }, 2000);
      } else {
        toast({
          title: "Signup failed",
          description: data.message || "Please try again",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: SignupFormValues) => {
    signupMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto bg-gray-900 border-purple-900/30">
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <Stars className="h-12 w-12 text-purple-400 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-white">Welcome to the stars!</h2>
              <p className="text-gray-400 mt-2">
                Your personalized horoscope journey begins now. Check your phone for daily wellness insights.
              </p>
            </div>
            
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800 mb-4">
              <MessageSquare className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-purple-200">
                Your first horoscope will arrive tomorrow morning via SMS
              </p>
            </div>
            
            <p className="text-xs text-gray-500">
              Redirecting you to explore more features...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Form */}
        <Card className="bg-gray-900 border-purple-900/30 max-w-md mx-auto w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Get Your Daily Horoscope</CardTitle>
            <CardDescription className="text-gray-400">
              Personalized wellness insights delivered to your phone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Your Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          {...field}
                          className="bg-gray-800 border-gray-700 text-white h-12 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1 555-123-4567" 
                          {...field}
                          className="bg-gray-800 border-gray-700 text-white h-12 text-base"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Where your daily horoscopes will be delivered
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="your@email.com" 
                          {...field}
                          className="bg-gray-800 border-gray-700 text-white h-12 text-base"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        For account management and premium features
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Zodiac Sign */}
                <FormField
                  control={form.control}
                  name="zodiacSign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Your Zodiac Sign</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-12 text-base">
                            <SelectValue placeholder="Choose your sign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
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

                {/* SMS Opt-in */}
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800">
                  <FormField
                    control={form.control}
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
                          <FormLabel className="text-sm font-medium text-purple-100">
                            Send daily horoscopes via SMS
                          </FormLabel>
                          <FormDescription className="text-xs text-purple-300">
                            Get personalized wellness insights delivered to your phone
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending ? (
                    <>
                      <span className="mr-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Starting your journey...
                    </>
                  ) : (
                    "Start My Horoscope Journey"
                  )}
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  <span>Free to start • Unsubscribe anytime • Privacy protected</span>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right: Benefits */}
        <div className="space-y-6 text-center lg:text-left">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Your Stars, Your Wellness
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Receive personalized health guidance based on your zodiac sign, delivered daily to your phone.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-700">
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Daily SMS Horoscopes</h3>
                <p className="text-gray-400">Personalized wellness insights delivered straight to your phone every morning</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-700">
                <Stars className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Cosmic Health Guidance</h3>
                <p className="text-gray-400">Nutrition, fitness, and mindfulness tips aligned with your zodiac energy</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-700">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Privacy First</h3>
                <p className="text-gray-400">Your data is secure and you can unsubscribe at any time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}