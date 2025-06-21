import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Smartphone, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCosmicLoader } from '@/hooks/useCosmicLoader';
import { useLanguage } from '@/context/LanguageContext';

interface CosmicHeroSectionProps {
  onSignup?: (phone: string) => void;
  isLoggedIn?: boolean;
}

export const CosmicHeroSection: React.FC<CosmicHeroSectionProps> = ({ 
  onSignup, 
  isLoggedIn = false 
}) => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { showLoader, setLoadingMessage } = useCosmicLoader();
  const { t } = useLanguage();

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/[^\d]/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Validate phone number
  const validatePhone = (phoneValue: string) => {
    const cleanPhone = phoneValue.replace(/[^\d]/g, '');
    
    if (cleanPhone.length === 0) {
      return "Phone number is required";
    }
    if (cleanPhone.length < 10) {
      return "Phone number must be at least 10 digits";
    }
    if (cleanPhone.length > 11) {
      return "Phone number is too long";
    }
    if (cleanPhone.length === 11 && !cleanPhone.startsWith('1')) {
      return "Invalid country code";
    }
    
    return '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
    
    // Clear error when user starts typing
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleSignupClick = () => {
    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      toast({
        title: "Invalid Phone Number",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    // Clean phone number for submission
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    if (onSignup) {
      onSignup(cleanPhone);
    } else {
      localStorage.setItem('pendingSignupPhone', cleanPhone);
      navigate('/signup');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignupClick();
    }
  };

  const testCosmicLoader = async () => {
    setLoadingMessage("Demonstrating cosmic constellation transitions...");
    await showLoader(5000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 relative overflow-hidden">
      {/* Enhanced premium background effects */}
      <div className="absolute inset-0">
        {/* Shimmering particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                background: `radial-gradient(circle, ${['#ffffff88', '#fbbf2488', '#a78bfa88'][Math.floor(Math.random() * 3)]} 0%, transparent 70%)`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                filter: 'blur(0.5px)',
                boxShadow: `0 0 ${1 + Math.random() * 3}px ${['#ffffff', '#fbbf24', '#a78bfa'][Math.floor(Math.random() * 3)]}`
              }}
            />
          ))}
        </div>
        
        {/* Premium gradient orbs with sophisticated shadows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
             style={{
               background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(147,51,234,0.08) 40%, transparent 70%)',
               boxShadow: 'inset 0 0 60px rgba(147,51,234,0.1), 0 0 120px rgba(147,51,234,0.05)',
               animationDuration: '6s'
             }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
             style={{
               background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)',
               boxShadow: 'inset 0 0 60px rgba(124,58,237,0.1), 0 0 120px rgba(124,58,237,0.05)',
               animationDuration: '8s',
               animationDelay: '2s'
             }}></div>
             
        {/* Elegant constellation overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="starline" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor:'#a78bfa', stopOpacity:0}} />
              <stop offset="50%" style={{stopColor:'#a78bfa', stopOpacity:0.6}} />
              <stop offset="100%" style={{stopColor:'#a78bfa', stopOpacity:0}} />
            </linearGradient>
          </defs>
          <path d="M100,200 Q300,150 500,200 T900,250" 
                stroke="url(#starline)" 
                strokeWidth="1" 
                fill="none"
                className="animate-pulse"
                style={{animationDuration: '4s'}} />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Premium Badge with shimmer effect */}
          <div className="relative inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-purple-500/10 via-violet-500/15 to-purple-500/10 border border-purple-400/30 text-purple-200 text-sm font-medium mb-8 backdrop-blur-sm shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CheckCircle className="w-4 h-4 text-emerald-400 drop-shadow-sm" />
            <span className="relative z-10">{t('hero.tagline')}</span>
          </div>
          
          {/* Enhanced headline with text shadow */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="drop-shadow-2xl">{t('hero.title1')}</span>
            <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent mt-2 drop-shadow-lg animate-pulse" style={{animationDuration: '3s'}}>
              {t('hero.title2')}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
          
          {!isLoggedIn && (
            <>
              {/* Enhanced mobile number input form */}
              <div className="max-w-md mx-auto mb-8">
                <div className="text-center mb-3">
                  <p className="text-slate-300 text-sm">
                    Enter your mobile number to receive daily horoscopes via SMS
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative group">
                    <Smartphone className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      phoneError ? 'text-red-400' : 'text-slate-400 group-focus-within:text-purple-400'
                    }`} />
                    <Input
                      value={phone}
                      onChange={handlePhoneChange}
                      onKeyPress={handleKeyPress}
                      placeholder="(555) 123-4567"
                      type="tel"
                      maxLength={14}
                      className={`h-14 pl-12 text-lg backdrop-blur-sm text-white placeholder:text-slate-400 transition-all duration-300 shadow-lg shadow-black/10 ${
                        phoneError 
                          ? 'bg-red-500/10 border-red-400/50 focus:border-red-400 focus:ring-red-400/30' 
                          : 'bg-white/5 border-white/20 focus:border-purple-400 focus:ring-purple-400/30 focus:bg-white/10 hover:border-white/30'
                      }`}
                    />
                    <div className={`absolute inset-0 rounded-md transition-opacity duration-300 pointer-events-none ${
                      phoneError 
                        ? 'bg-gradient-to-r from-red-500/10 to-red-500/10 opacity-100' 
                        : 'bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 group-focus-within:opacity-100'
                    }`}></div>
                    
                    {/* Validation message */}
                    {phoneError && (
                      <div className="absolute -bottom-6 left-0 text-red-400 text-sm font-medium animate-pulse">
                        {phoneError}
                      </div>
                    )}
                    
                    {/* Success indicator */}
                    {phone && !phoneError && phone.replace(/[^\d]/g, '').length >= 10 && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={handleSignupClick}
                    className="relative h-14 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 border-0 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative z-10">{t('signup.button')}</span>
                    <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
              
              {/* Enhanced trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-slate-300 mb-8">
                <div className="flex items-center gap-2 group">
                  <CheckCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:text-white transition-colors duration-300">Instant SMS delivery</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <CheckCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:text-white transition-colors duration-300">No spam ever</span>
                </div>
                <div className="flex items-center gap-2 group">
                  <CheckCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:text-white transition-colors duration-300">Cancel anytime</span>
                </div>
              </div>
              
              {/* Demo button for cosmic loader */}
              <div className="mt-8">
                <Button
                  onClick={testCosmicLoader}
                  variant="outline"
                  className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400"
                >
                  <Sparkles className="mr-2 w-4 h-4" />
                  Preview Cosmic Loading Animation
                </Button>
              </div>
            </>
          )}
          
          {isLoggedIn && (
            <div className="max-w-md mx-auto">
              <Button
                onClick={() => navigate('/dashboard')}
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};