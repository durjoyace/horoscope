import React from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/context/LanguageContext';
import { zodiacSignNames, zodiacElements } from '@/data/zodiacData';
import { ZodiacSign } from '@shared/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ChevronRight, MessageSquare, Users } from 'lucide-react';

export function CommunityHome() {
  const { t } = useLanguage();
  const [_, setLocation] = useLocation();
  const [userZodiacSign] = useLocalStorage<ZodiacSign | null>('userZodiacSign', null);
  
  const getZodiacSymbol = (sign: string): string => {
    switch (sign) {
      case 'aries': return '♈';
      case 'taurus': return '♉';
      case 'gemini': return '♊';
      case 'cancer': return '♋';
      case 'leo': return '♌';
      case 'virgo': return '♍';
      case 'libra': return '♎';
      case 'scorpio': return '♏';
      case 'sagittarius': return '♐';
      case 'capricorn': return '♑';
      case 'aquarius': return '♒';
      case 'pisces': return '♓';
      default: return '';
    }
  };
  
  const getElementColor = (element: string): string => {
    switch (element) {
      case 'Fire': return 'bg-red-500/10 text-red-600 border-red-200/30';
      case 'Earth': return 'bg-green-500/10 text-green-600 border-green-200/30';
      case 'Air': return 'bg-purple-500/10 text-purple-600 border-purple-200/30';
      case 'Water': return 'bg-blue-500/10 text-blue-600 border-blue-200/30';
      default: return 'bg-primary/10 text-primary border-primary/30';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t('community.title') || 'Astrological Communities'}</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            {t('community.description') || 'Connect with others who share your zodiac sign. Discuss sign-specific wellness topics, share experiences, and get personalized advice tailored to your astrological profile.'}
          </p>
        </div>
        
        {userZodiacSign && (
          <Card className="mb-8 border-2 border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <span className="text-xl mr-2">{getZodiacSymbol(userZodiacSign)}</span>
                <span>{t('community.your') || 'Your'} {userZodiacSign.charAt(0).toUpperCase() + userZodiacSign.slice(1)} {t('community.community') || 'Community'}</span>
              </CardTitle>
              <CardDescription>
                {t('community.personal', 'Your personalized community based on your zodiac sign')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm">
                {t('community.recommendation', 'Recommended topics and discussions tailored specifically for')} {userZodiacSign.charAt(0).toUpperCase() + userZodiacSign.slice(1)}.
              </p>
            </CardContent>
            <CardFooter>
              <Link 
                href={`/community/${userZodiacSign}`}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t('community.enter', 'Enter Your Community')}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {zodiacSignNames.map((sign) => {
            const element = zodiacElements[sign.value as ZodiacSign];
            const elementClass = getElementColor(element);
            
            return (
              <Card key={sign.value} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-xl">{getZodiacSymbol(sign.value)}</span>
                      <span>{sign.label}</span>
                    </CardTitle>
                    <Badge variant="outline" className={elementClass}>
                      {element}
                    </Badge>
                  </div>
                  <CardDescription>
                    {t(`zodiac.${sign.value}.brief`, `${sign.label} community for wellness discussions`)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>~24 {t('community.topics', 'Topics')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>~120 {t('community.members', 'Members')}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link 
                    href={`/community/${sign.value}`}
                    className="w-full bg-muted hover:bg-muted/80 py-2 px-4 rounded-md flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>{t('community.view', 'View Community')}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CommunityHome;