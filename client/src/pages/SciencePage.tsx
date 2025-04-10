import { 
  Brain, 
  Clock, 
  Dna, 
  Star, 
  MoveRight, 
  FlaskConical, 
  Microscope, 
  Orbit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function SciencePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <FlaskConical className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          The Science Behind HoroscopeHealth
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our unique methodology merges astrological insights with scientific wellness principles
        </p>
      </div>

      {/* Our Approach */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-6">Our Integrative Approach</h2>
          <p className="text-lg text-muted-foreground mb-4">
            At HoroscopeHealth, we've developed a methodological framework that respects both the ancient wisdom of astrological health correlations and the rigorous standards of modern health science.
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            Rather than treating astrology and science as opposing forces, we recognize them as complementary systems of knowledge that can enhance each other when thoughtfully integrated. Our approach is neither purely mystical nor rigidly empirical, but a carefully balanced synthesis.
          </p>
          <p className="text-lg text-muted-foreground">
            This integration allows us to provide personalized health insights that honor your unique astrological constitution while remaining grounded in evidence-based wellness practices.
          </p>
        </div>
        <div className="bg-muted rounded-lg p-8">
          <div className="grid gap-6">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Astrological Principles</h3>
                <p className="text-sm text-muted-foreground">
                  Traditional zodiac sign correspondences with body systems, temperaments, and elemental constitutions
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Evidence-Based Research</h3>
                <p className="text-sm text-muted-foreground">
                  Current nutritional science, exercise physiology, and mind-body medicine findings
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <Microscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Pattern Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Systematic observation of health tendencies across zodiac signs and planetary influences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Scientific Concepts */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Key Scientific Concepts</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scientific principles that inform our astrological health insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Concept 1 */}
          <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
            <div className="p-8 flex justify-center bg-muted">
              <Clock className="h-12 w-12 text-primary/80" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Chronobiology</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The study of biological rhythms and natural cycles in living organisms
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <MoveRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Circadian rhythms affect hormone production, metabolism, and immune function</span>
                </li>
                <li className="flex items-start gap-2">
                  <MoveRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Biological cycles align with cosmic patterns in ways science is still discovering</span>
                </li>
                <li className="flex items-start gap-2">
                  <MoveRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Personalized timing of health practices can enhance their effectiveness</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Concept 2 */}
          <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
            <div className="p-8 flex justify-center bg-muted">
              <Dna className="h-12 w-12 text-primary/80" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Bioindividuality</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The recognition that each person has unique nutritional and lifestyle needs
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <MoveRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Genetic variations influence how individuals respond to foods and exercises</span>
                </li>
                <li className="flex items-start gap-2">
                  <MoveRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Astrological profiles offer complementary insights to genetic testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <MoveRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Personalized approaches yield better outcomes than one-size-fits-all</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Concept 3 */}
          <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
            <div className="p-8 flex justify-center bg-muted">
              <Orbit className="h-12 w-12 text-primary/80" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Systems Medicine</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The holistic approach to health that views the body as an integrated system
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <MoveRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Interconnectedness of body systems mirrors cosmic interconnectedness</span>
                </li>
                <li className="flex items-start gap-2">
                  <MoveRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Elemental properties in astrology parallel systemic functions in medicine</span>
                </li>
                <li className="flex items-start gap-2">
                  <MoveRight className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                  <span>Pattern recognition across systems enhances predictive wellness guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Common Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding the integration of astrology and health science
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is astrology scientifically proven?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  Astrology and modern science operate as different knowledge systems with distinct methodologies and standards of evidence. Conventional scientific studies have not demonstrated causal mechanisms for astrological effects in the way that's expected within the scientific framework.
                </p>
                <p>
                  At HoroscopeHealth, we approach astrology as a symbolic system that offers meaningful patterns and archetypal insights that can complement scientific understanding. We use astrological frameworks alongside evidence-based wellness practices to create personalized guidance that honors both traditional wisdom and modern knowledge.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How do you develop your health recommendations?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  Our recommendations are developed through a multi-disciplinary process that includes:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Review of traditional astrological health correspondences from multiple cultural traditions</li>
                  <li>Analysis of current nutritional science, exercise physiology, and mind-body research</li>
                  <li>Consultation with experts in both astrology and various health fields</li>
                  <li>Pattern observation across large user bases to identify trends and correlations</li>
                </ul>
                <p>
                  The result is guidance that respects astrological principles while remaining grounded in practical, evidence-informed wellness approaches.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Should I use your recommendations instead of medical advice?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  <strong>Absolutely not.</strong> HoroscopeHealth provides complementary wellness insights, not medical advice. Our recommendations are designed to support general wellbeing and should never replace advice from qualified healthcare providers.
                </p>
                <p>
                  We encourage our users to work with healthcare professionals for any medical concerns, and to view our astrological health insights as complementary perspectives that may help them better understand their personal tendencies and potential wellness strategies.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Is there any research on astrological health correlations?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-4">
                  While conventional scientific research on astrological health correlations is limited, there are several interesting areas of emerging research that touch on related concepts:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Studies on seasonal birth effects and health outcomes</li>
                  <li>Research on lunar cycles and their potential influences on physiology</li>
                  <li>Investigations into electromagnetic sensitivity and geomagnetic influences</li>
                  <li>Pattern analysis approaches to traditional medical systems like Ayurveda and Traditional Chinese Medicine</li>
                </ul>
                <p>
                  At HoroscopeHealth, we stay informed about relevant research while acknowledging that astrological health correlations remain primarily in the realm of traditional knowledge rather than validated scientific fact.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary/5 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Experience the Synthesis of Astrology and Science
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover how this unique integration can provide personalized insights for your wellness journey
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">
              Get Your Daily Horoscope
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg">
              Learn About Our Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}