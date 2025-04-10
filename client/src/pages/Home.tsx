import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ValueProposition } from '@/components/ValueProposition';
import { WhyItWorks } from '@/components/WhyItWorks';
import { ZodiacSelector } from '@/components/ZodiacSelector';
import { WellnessCategories } from '@/components/WellnessCategories';
import { CallToAction } from '@/components/CallToAction';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ValueProposition />
      <WhyItWorks />
      <ZodiacSelector />
      <WellnessCategories />
      <CallToAction />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
