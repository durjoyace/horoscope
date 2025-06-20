import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Getting my horoscope via SMS every morning has become part of my routine. The wellness tips are actually helpful and I love that I don't need to remember to open an app.",
      author: "Sarah M.",
      zodiacSign: "♌ Leo",
      rating: 5
    },
    {
      quote: "I was skeptical at first, but these daily messages genuinely help me start my day with intention. The health guidance feels personalized to my Cancer traits.",
      author: "Mike R.", 
      zodiacSign: "♋ Cancer",
      rating: 5
    },
    {
      quote: "Perfect for busy mornings! I get my horoscope right on my phone and the wellness advice actually makes sense for my lifestyle. Love the convenience.",
      author: "Jessica K.",
      zodiacSign: "♉ Taurus", 
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Daily Messages Sent" },
    { number: "4.8/5", label: "Average Rating" },
    { number: "94%", label: "Users Read Daily" }
  ];

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Loved by Thousands
          </h2>
          <p className="text-slate-300 text-lg">
            Join the community of people starting their day with personalized wellness guidance.
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
            Ready to start your wellness journey?
          </p>
          <div className="text-purple-400 font-medium">
            Join thousands who start their day with purpose ↑
          </div>
        </div>
      </div>
    </section>
  );
};