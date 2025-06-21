import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();
  
  const testimonials = [
    {
      quote: t('testimonials.1.quote'),
      author: t('testimonials.1.author'),
      zodiacSign: "♌ Leo",
      rating: 5
    },
    {
      quote: t('testimonials.2.quote'),
      author: t('testimonials.2.author'), 
      zodiacSign: "♋ Cancer",
      rating: 5
    },
    {
      quote: t('testimonials.3.quote'),
      author: t('testimonials.3.author'),
      zodiacSign: "♉ Taurus", 
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: t('stats.messages') },
    { number: "4.8/5", label: t('stats.rating') },
    { number: "94%", label: t('stats.readDaily') }
  ];

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('testimonials.heading')}
          </h2>
          <p className="text-slate-300 text-lg">
            {t('testimonials.subheading')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">
                {stat.number}
              </div>
              <div className="text-slate-400 text-sm sm:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Premium Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
              
              {/* Quote Icon with animation */}
              <Quote className="w-8 h-8 text-purple-400 mb-4 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300" />
              
              {/* Animated Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>

              {/* Quote with subtle animation */}
              <p className="text-slate-300 leading-relaxed mb-6 group-hover:text-slate-200 transition-colors duration-300">
                "{testimonial.quote}"
              </p>

              {/* Author with enhanced styling */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium group-hover:text-purple-200 transition-colors duration-300">
                    {testimonial.author}
                  </div>
                  <div className="text-purple-300 text-sm font-medium group-hover:text-purple-200 transition-colors duration-300">
                    {testimonial.zodiacSign}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">
            {t('testimonials.cta.ready')}
          </p>
          <div className="text-purple-400 font-medium">
            {t('testimonials.cta.join')}
          </div>
        </div>
      </div>
    </section>
  );
};