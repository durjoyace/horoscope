import React from 'react';
import { wellnessCategories } from '@/utils/constants';

export const WellnessCategories: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
            Holistic Wellness Categories
          </h2>
          <p className="text-xl max-w-2xl mx-auto">
            Your daily horoscope covers these essential areas of health and wellbeing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wellnessCategories.slice(0, 3).map((category, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="h-40 bg-teal-600 relative">
                <img
                  src={category.image}
                  alt={`${category.name} category`}
                  className="w-full h-full object-cover"
                  width="600"
                  height="400"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.pills.map((pill, pillIndex) => (
                    <span
                      key={pillIndex}
                      className={`rounded-full px-3 py-1 text-xs font-semibold bg-${category.color}-100 text-${category.color}-600`}
                      style={{
                        backgroundColor: 
                          category.color === 'teal' ? 'rgba(209, 250, 229, 1)' :
                          category.color === 'indigo' ? 'rgba(224, 231, 255, 1)' :
                          'rgba(254, 243, 199, 1)',
                        color:
                          category.color === 'teal' ? 'rgba(13, 148, 136, 1)' :
                          category.color === 'indigo' ? 'rgba(79, 70, 229, 1)' :
                          'rgba(217, 119, 6, 1)'
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
