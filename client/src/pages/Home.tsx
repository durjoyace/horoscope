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
  
  // Handle signup from hero section - using registerMutation from useAuth instead of useUser
  const handleSignup = async (email: string) => {
    if (!email || !email.includes('@')) {
      toast({
        title: t('toast.email.required.title'),
        description: t('toast.email.required.description'),
        variant: "destructive",
      });
      return;
    }
    
    // Store the email in localStorage for the auth page
    localStorage.setItem('pendingSignupEmail', email);
    navigate('/auth?signup=true');
    
    // We'll handle the actual registration on the auth page
    if (onUserRegistered) {
      onUserRegistered();
    }
  };

  return (
    <div className="flex flex-col text-black" style={{ color: '#333', backgroundColor: '#fff' }}>
      {/* Hero section with signup */}
      <CosmicHeroSection 
        onSignup={handleSignup} 
        isLoggedIn={isLoggedIn} 
      />
      
      {/* Features section */}
      <FeaturesSection />
      
      {/* Explanation of how it works */}
      <WhyItWorks />
      
      {/* Interactive compatibility quiz section */}
      <CompatibilityQuizSection />
      
      {/* Testimonials carousel */}
      <TestimonialsSection />
      
      {/* Premium subscription section */}
      <PremiumSection />
      
      {/* Final call to action and footer */}
      <FooterCTA />
    </div>
  );
}