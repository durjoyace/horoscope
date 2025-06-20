import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

// Modular homepage components
import { CosmicHeroSection } from '@/components/homepage/CosmicHeroSection';
import { FeaturesSection } from '@/components/homepage/FeaturesSection';
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection';
import { PremiumSection } from '@/components/homepage/PremiumSection';
import { FooterCTA } from '@/components/homepage/FooterCTA';
import { CompatibilityQuizSection } from '@/components/homepage/CompatibilityQuizSection';

// Import the existing WhyItWorks component
import { WhyItWorks } from '@/components/WhyItWorks';

// Type definition for Home props
interface HomeProps {
  onUserRegistered?: () => void;
  isLoggedIn?: boolean;
}

export default function Home({ onUserRegistered, isLoggedIn = false }: HomeProps) {
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  // Detect and store referral code from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode) {
      // Store the referral code in localStorage for the signup process
      localStorage.setItem('referralCode', referralCode);
      
      // Validate the referral code and show welcome message
      fetch(`/api/referrals/validate/${referralCode}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            toast({
              title: "Welcome from " + data.data.referrerName + "!",
              description: "Sign up now to unlock premium wellness features together.",
            });
          }
        })
        .catch(() => {
          // Silent fail for invalid codes
        });
    }
  }, [toast]);
  
  // Handle signup from hero section with phone number
  const handleSignup = async (phone: string) => {
    if (!phone || phone.length < 10) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a valid phone number to receive your daily horoscope via SMS.",
        variant: "destructive",
      });
      return;
    }
    
    // Store the phone number in localStorage for the signup page
    localStorage.setItem('pendingSignupPhone', phone);
    navigate('/signup');
    
    if (onUserRegistered) {
      onUserRegistered();
    }
  };

  return (
    <div className="flex flex-col">
      <CosmicHeroSection 
        onSignup={handleSignup} 
        isLoggedIn={isLoggedIn} 
      />
      <FeaturesSection />
      <TestimonialsSection />
    </div>
  );
}