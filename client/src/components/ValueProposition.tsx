import React from 'react';
import { valuePropositions } from '@/utils/constants';

export const ValueProposition: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
            Personalized Health Guidance, Every Morning.
          </h2>
          <p className="text-xl max-w-2xl mx-auto">
            We combine the wisdom of astrology with modern wellness science to help you build better habits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valuePropositions.map((prop, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <div className="text-indigo-900 mb-4 text-3xl">
                <i className={`fas fa-${prop.icon}`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{prop.title}</h3>
              <p className="text-gray-600">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
