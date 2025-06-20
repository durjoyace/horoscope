import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "This app told me to work out at 2 PM instead of mornings. I've never felt stronger. Turns out Leo energy peaks in the afternoon - who knew?",
      author: "Sarah M.",
      zodiacSign: "♌ Leo",
      rating: 5
    },
    {
      quote: "My sleep improved 300% after following their Cancer-specific bedtime routine. The timing recommendations are scary accurate for my body clock.",
      author: "Mike R.", 
      zodiacSign: "♋ Cancer",
      rating: 5
    },
    {
      quote: "Lost 15 pounds just by eating when they said to eat. The Taurus meal timing advice matched exactly when I was actually hungry.",
      author: "Jessica K.",
      zodiacSign: "♉ Taurus", 
      rating: 5
    }
  ];

  const stats = [
    { number: "50,000+", label: "People Discovering Their Timing" },
    { number: "87%", label: "Report Better Energy" },
    { number: "2.3x", label: "More Effective Workouts" }
  ];

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Real People, Real Results
          </h2>
          <p className="text-slate-300 text-lg">
            Discover what happens when you finally work with your body's natural timing instead of against it.
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

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-purple-400 mb-4" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">
                    {testimonial.author}
                  </div>
                  <div className="text-purple-300 text-sm">
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
            Your body already knows when it works best.
          </p>
          <div className="text-purple-400 font-medium">
            We just tell you when that is ↑
          </div>
        </div>
      </div>
    </section>
  );
};