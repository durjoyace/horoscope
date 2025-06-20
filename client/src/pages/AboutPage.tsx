import { Star, HeartPulse, Users, Brain, Sparkles, Leaf, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <Star className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          About HoroscopeHealth
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Where ancient astrological wisdom meets modern health science
        </p>
      </div>

      {/* Our Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-6">Our Story</h2>
          <p className="text-lg text-muted-foreground mb-4">
            HoroscopeHealth was founded with a simple but powerful vision: to bridge the ancient wisdom of astrology with modern health science, creating personalized wellness insights that honor both tradition and innovation.
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            We believe that true wellness encompasses not just physical health, but also the mind-body connection that has been recognized by ancient traditions for millennia. By studying how astrological patterns relate to human health tendencies, we've developed a unique approach to wellness that respects individuality.
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            Our approach is grounded in chronobiology - the scientific study of biological rhythms and how they affect human health. We integrate research on circadian cycles, seasonal patterns, and biological timing with astrological insights to create recommendations that align with both your natural rhythms and cosmic influences.
          </p>
          <p className="text-lg text-muted-foreground">
            Our team of astrologers, chronobiologists, and wellness experts work together to deliver daily insights and recommendations tailored to your zodiac sign's unique constitution and optimal timing patterns.
          </p>
        </div>
        <div className="bg-muted rounded-lg p-8 md:p-12">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <HeartPulse className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Personalized Health</h3>
              <p className="text-sm text-muted-foreground">
                Tailored wellness insights based on your unique astrological profile
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ancient Wisdom</h3>
              <p className="text-sm text-muted-foreground">
                Centuries of astrological knowledge applied to modern wellness
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Modern Science</h3>
              <p className="text-sm text-muted-foreground">
                Evidence-based approaches integrated with astrological insights
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Holistic Approach</h3>
              <p className="text-sm text-muted-foreground">
                Addressing physical, mental, and energetic dimensions of health
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="bg-primary/5 rounded-xl p-8 md:p-12 mb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Our Mission</h2>
          <p className="text-xl mb-8">
            "To empower individuals with personalized astrological wellness insights, helping them make health choices aligned with their zodiac nature and highest potential."
          </p>
          <div className="flex justify-center">
            <Link href="/science">
              <Button size="lg">
                Explore Our Methodology
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Science & Chronobiology */}
      <div className="mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-muted rounded-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-blue-500/20 rounded-full mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Chronobiology Foundation</h3>
            </div>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Circadian Rhythms:</strong> Your body's internal clock affects hormone production, metabolism, and immune function throughout 24-hour cycles.
              </p>
              <p>
                <strong className="text-foreground">Seasonal Patterns:</strong> Research shows how seasonal light changes influence mood, energy levels, and dietary needs.
              </p>
              <p>
                <strong className="text-foreground">Optimal Timing:</strong> Studies in chronotherapy demonstrate that timing of activities, meals, and rest significantly impacts health outcomes.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">The Science Behind Timing</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Chronobiology reveals that timing isn't just important—it's everything. Your body operates on precise biological rhythms that influence when you're most alert, when your metabolism peaks, and when your body repairs itself.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              We combine peer-reviewed chronobiology research with astrological timing principles to optimize when you receive wellness recommendations. For example, cortisol naturally peaks in the morning, making it an ideal time for energizing activities that align with your zodiac sign's elemental nature.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              This integration allows us to suggest not just what wellness practices suit your astrological profile, but precisely when to implement them for maximum biological benefit.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">Evidence-Based</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">Personalized Timing</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-purple-700">Holistic Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our interdisciplinary experts blend astrology, health science, and wellness practices
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <Users className="h-24 w-24 text-muted-foreground/30" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">Dr. Maya Stellaris</h3>
              <p className="text-sm text-muted-foreground mb-4">Founder & Lead Chronobiology Researcher</p>
              <p className="text-sm">
                With over 20 years of experience in chronobiology and astrological research, plus a PhD in Comparative Health Systems, Maya specializes in biological timing and circadian health optimization.
              </p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <Users className="h-24 w-24 text-muted-foreground/30" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">Dr. Leo Chen</h3>
              <p className="text-sm text-muted-foreground mb-4">Wellness Science Director</p>
              <p className="text-sm">
                A pioneer in integrative medicine with specializations in chronobiology and nutritional science, Leo develops our evidence-based wellness protocols.
              </p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <Users className="h-24 w-24 text-muted-foreground/30" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">Aria Moonbeam</h3>
              <p className="text-sm text-muted-foreground mb-4">Lead Content Astrologer</p>
              <p className="text-sm">
                Combining astrological expertise with health coaching certification, Aria crafts our daily horoscopes with practical wellness recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Members Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from people who have transformed their wellness journey with astrological guidance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-primary/5 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-full p-3 flex-shrink-0">
                <Smile className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="mb-4 italic">
                  "As a Taurus, I've always struggled with creating consistent exercise routines. The recommendations from HoroscopeHealth helped me design a regimen that works with my earth sign tendencies instead of against them. I'm finally enjoying movement!"
                </p>
                <p className="font-medium">Jessica T.</p>
                <p className="text-sm text-muted-foreground">Taurus ♉</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-primary/5 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-full p-3 flex-shrink-0">
                <Smile className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="mb-4 italic">
                  "The weekly premium reports have been transformative for my wellness journey. As a Scorpio, I need intense but sustainable practices, and the personalized recommendations honor that depth while keeping me balanced."
                </p>
                <p className="font-medium">Michael R.</p>
                <p className="text-sm text-muted-foreground">Scorpio ♏</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-6">
          Ready to Discover Your Horoscope Health Profile?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of members who receive daily personalized health horoscopes tailored to their zodiac sign's unique constitution.
        </p>
        <Link href="/">
          <Button size="lg">
            Get Started Today
          </Button>
        </Link>
      </div>
    </div>
  );
}