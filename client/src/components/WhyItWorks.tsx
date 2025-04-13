import React from 'react';
import { zodiacTraits } from '@/utils/constants';
import { HoroscopePreview } from './HoroscopePreview';

export const WhyItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Astrology makes wellness feel personal.<br />
              <span className="text-teal-400">Science makes it stick.</span>
            </h2>
            <p className="text-lg mb-8">
              Your zodiac sign reveals patterns about how you handle stress, rest, and self-care. 
              We translate that into daily, evidence-informed advice — so you're not just reading 
              horoscopes… you're building a healthier life.
            </p>
            <div className="space-y-4">
              {zodiacTraits.map((trait, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mr-4">
                    <i className={`fas fa-${trait.icon} text-indigo-950`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{trait.title}</h3>
                    <p className="text-gray-200">{trait.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-lg relative z-0">
              <HoroscopePreview />
            </div>
            
            <div className="absolute -bottom-6 -right-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg z-20">
              <p className="text-white font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Evidence-based recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
