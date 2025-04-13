import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Quote } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  quote: string;
  author: string;
  zodiacSign: string;
  imageSrc?: string;
}

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();
  
  const testimonials: Testimonial[] = [
    {
      quote: t('testimonials.quote1'),
      author: t('testimonials.author1'),
      zodiacSign: t('zodiac.leo'),
    },
    {
      quote: t('testimonials.quote2'),
      author: t('testimonials.author2'),
      zodiacSign: t('zodiac.cancer'),
    },
    {
      quote: t('testimonials.quote3'),
      author: t('testimonials.author3'),
      zodiacSign: t('zodiac.taurus'),
    },
    {
      quote: t('testimonials.quote4'),
      author: t('testimonials.author4'),
      zodiacSign: t('zodiac.gemini'),
    },
    {
      quote: t('testimonials.quote5'),
      author: t('testimonials.author5'),
      zodiacSign: t('zodiac.pisces'),
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-black to-purple-950/30">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute h-full w-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('testimonials.heading')}
          </h2>
          <p className="text-lg text-purple-200/70 max-w-3xl mx-auto">
            {t('testimonials.subheading')}
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 h-full flex flex-col">
                    <div className="mb-4">
                      <Quote className="h-8 w-8 text-purple-400 opacity-50" />
                    </div>
                    <p className="text-white/90 italic flex-grow mb-4">
                      "{testimonial.quote}"
                    </p>
                    <div className="mt-auto">
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-purple-300/70">{testimonial.zodiacSign}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="static transform-none bg-white/10 hover:bg-white/20 border-purple-500/30" />
              <CarouselNext className="static transform-none bg-white/10 hover:bg-white/20 border-purple-500/30" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};