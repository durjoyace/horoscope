import React from 'react';

// Sample horoscope preview data
const previewHoroscope = {
  sign: "cancer",
  date: "Today",
  overview: "The moon's position today heightens your emotional sensitivity, Cancer. This is an excellent day to practice self-care through boundary-setting.",
  wellnessCategories: ["mindfulness", "stress"],
  healthTip: "Try a 10-minute guided meditation focused on creating emotional boundaries. This can help prevent energy depletion.",
  nutritionFocus: "Foods rich in B vitamins will help maintain your energy today. Consider adding leafy greens and whole grains to your meals.",
  elementAlignment: "Water signs should stay especially hydrated today"
};

export const HoroscopePreview: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg text-gray-900">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mr-3 text-lg">
          <i className="fas fa-moon"></i>
        </div>
        <div>
          <h3 className="font-bold">Daily Health Horoscope for Cancer</h3>
          <p className="text-sm text-gray-500">June 21 - July 22</p>
        </div>
      </div>
      
      <div className="border-b border-gray-200 pb-4 mb-4">
        <p className="text-lg mb-3">{previewHoroscope.overview}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {previewHoroscope.wellnessCategories.map((category, index) => (
            <span 
              key={index} 
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                category === 'mindfulness' 
                  ? 'bg-teal-100 text-teal-600' 
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-indigo-900">Today's Health Tip</h4>
          <p>{previewHoroscope.healthTip}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-indigo-900">Nutrition Focus</h4>
          <p>{previewHoroscope.nutritionFocus}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-indigo-900">Element Alignment</h4>
          <div className="flex items-center">
            <div className="text-teal-600 mr-2">
              <i className="fas fa-water"></i>
            </div>
            <p>{previewHoroscope.elementAlignment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
