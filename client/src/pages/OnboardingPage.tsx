import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { ZodiacSign } from '@shared/types';
import { Loader2 } from 'lucide-react';

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  zodiacSign: ZodiacSign;
  referralCode?: string;
}

const OnboardingPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleOnboardingComplete = async (userData: UserData) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, we would send the data to the server here
      console.log('User data:', userData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save user data to localStorage (temporary solution)
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        // Default values for other user properties
        createdAt: new Date().toISOString(),
        isPremium: false,
      }));
      
      // Show success message
      toast({
        title: t('onboarding.success.title'),
        description: t('onboarding.success.description'),
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error during registration:', error);
      toast({
        title: t('onboarding.error.title'),
        description: t('onboarding.error.description'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('onboarding.submitting.title')}</h2>
        <p className="text-muted-foreground">{t('onboarding.submitting.description')}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col py-12 bg-gradient-to-b from-background to-background/80">
      <div className="flex-grow container mx-auto px-4">
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </div>
    </div>
  );
};

export default OnboardingPage;