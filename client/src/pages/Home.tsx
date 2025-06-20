import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation } from 'wouter';

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
    <CosmicHeroSection 
      onSignup={handleSignup} 
      isLoggedIn={isLoggedIn} 
    />
  );
}