import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { ZodiacSign } from "@shared/types";
import { Phone, Mail, Stars, CheckCircle, ArrowRight } from "lucide-react";
import { useCosmicLoader } from "@/hooks/useCosmicLoader";

const signupSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  zodiacSign: z.string().min(1, "Please select your zodiac sign"),
  smsOptIn: z.boolean().default(true),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const zodiacSigns: { value: ZodiacSign; label: string }[] = [
  { value: "aries", label: "♈ Aries (Mar 21 - Apr 19)" },
  { value: "taurus", label: "♉ Taurus (Apr 20 - May 20)" },
  { value: "gemini", label: "♊ Gemini (May 21 - Jun 20)" },
  { value: "cancer", label: "♋ Cancer (Jun 21 - Jul 22)" },
  { value: "leo", label: "♌ Leo (Jul 23 - Aug 22)" },
  { value: "virgo", label: "♍ Virgo (Aug 23 - Sep 22)" },
  { value: "libra", label: "♎ Libra (Sep 23 - Oct 22)" },
  { value: "scorpio", label: "♏ Scorpio (Oct 23 - Nov 21)" },
  { value: "sagittarius", label: "♐ Sagittarius (Nov 22 - Dec 21)" },
  { value: "capricorn", label: "♑ Capricorn (Dec 22 - Jan 19)" },
  { value: "aquarius", label: "♒ Aquarius (Jan 20 - Feb 18)" },
  { value: "pisces", label: "♓ Pisces (Feb 19 - Mar 20)" },
];

export default function SimpleSignupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const { showLoader, setLoadingMessage } = useCosmicLoader();

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

  useEffect(() => {
    const pendingPhone = localStorage.getItem('pendingSignupPhone');
    if (pendingPhone) {
      form.setValue('phone', pendingPhone);
      localStorage.removeItem('pendingSignupPhone');
    }
  }, [form]);

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormValues) => {
      // Set cosmic loading message based on zodiac sign
      const zodiacMessages = {
        aries: "Igniting your fiery energy...",
        taurus: "Grounding your earthy wisdom...",
        gemini: "Aligning your twin energies...",
        cancer: "Channeling lunar intuition...",
        leo: "Awakening your solar power...",
        virgo: "Harmonizing your analytical mind...",
        libra: "Balancing your cosmic scales...",
        scorpio: "Unleashing your transformative power...",
        sagittarius: "Expanding your cosmic horizons...",
        capricorn: "Building your celestial foundation...",
        aquarius: "Activating your universal connection...",
        pisces: "Flowing with oceanic wisdom..."
      };
      
      setLoadingMessage(zodiacMessages[data.zodiacSign as ZodiacSign] || "Aligning your cosmic energy...");
      
      // Show cosmic loader for 4 seconds to demonstrate the animation
      await showLoader(4000);
      
      // Include referral code if available
      const referralCode = localStorage.getItem('referralCode');
      const signupData = {
        ...data,
        ...(referralCode && { referralCode })
      };
      
      const response = await apiRequest('POST', '/api/signup', signupData);
      
      // Clear stored referral code after successful signup
      if (referralCode) {
        localStorage.removeItem('referralCode');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      toast({
        title: "Welcome aboard!",
        description: "Your daily horoscopes will start arriving tomorrow morning.",
      });
      
      setTimeout(() => {
        setLocation('/');
      }, 3000);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">You're all set!</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Your personalized wellness horoscopes will start arriving tomorrow morning via SMS.
            </p>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-purple-300 text-sm">
                First horoscope arrives tomorrow at 8 AM
              </p>
            </div>
            
            <p className="text-slate-400 text-sm">
              Redirecting you back to the homepage...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Stars className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
            <p className="text-slate-300">Just a few details to personalize your horoscopes</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-sm font-medium">Your Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your first name" 
                        {...field}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-sm font-medium">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          placeholder="your.email@example.com" 
                          type="email"
                          {...field}
                          className="h-12 pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-sm font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          placeholder="+1 (555) 123-4567" 
                          type="tel"
                          {...field}
                          className="h-12 pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              {/* Zodiac Sign */}
              <FormField
                control={form.control}
                name="zodiacSign"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-sm font-medium">Zodiac Sign</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-purple-500/20">
                          <SelectValue placeholder="Select your zodiac sign" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {zodiacSigns.map((sign) => (
                          <SelectItem key={sign.value} value={sign.value} className="text-slate-200 focus:bg-slate-700">
                            {sign.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={signupMutation.isPending}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 border-0 shadow-lg shadow-purple-500/25"
              >
                {signupMutation.isPending ? "Creating Account..." : "Get Started"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              {/* Trust indicators */}
              <div className="flex justify-center items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Instant access</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>No spam</span>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}