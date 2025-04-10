import React from 'react';
import { Check } from 'lucide-react';
import { zodiacSignNames } from '@/data/zodiacData';
import { ZodiacSign } from '@shared/types';

interface ElementSignsContentProps {
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
}

export default function ElementSignsContent({ element }: ElementSignsContentProps) {
  // Filter signs by element
  const filteredSigns = zodiacSignNames.filter(sign => sign.element === element);
  
  // Custom styling based on element
  const getElementStyles = () => {
    switch (element) {
      case 'Fire':
        return {
          bgClass: 'bg-gradient-to-br from-red-950 to-red-900',
          textClass: 'text-red-300',
          accentClass: 'text-red-500',
          iconBgClass: 'bg-red-800',
          listMarkerClass: 'text-red-400',
          borderClass: 'border-red-700'
        };
      case 'Earth':
        return {
          bgClass: 'bg-gradient-to-br from-green-950 to-green-900',
          textClass: 'text-green-300',
          accentClass: 'text-green-500',
          iconBgClass: 'bg-green-800',
          listMarkerClass: 'text-green-400',
          borderClass: 'border-green-700'
        };
      case 'Air':
        return {
          bgClass: 'bg-gradient-to-br from-purple-950 to-purple-900',
          textClass: 'text-purple-300',
          accentClass: 'text-purple-500',
          iconBgClass: 'bg-purple-800',
          listMarkerClass: 'text-purple-400',
          borderClass: 'border-purple-700'
        };
      case 'Water':
        return {
          bgClass: 'bg-gradient-to-br from-blue-950 to-blue-900',
          textClass: 'text-blue-300',
          accentClass: 'text-blue-500',
          iconBgClass: 'bg-blue-800',
          listMarkerClass: 'text-blue-400',
          borderClass: 'border-blue-700'
        };
    }
  };
  
  const styles = getElementStyles();
  
  // Health tendencies by element
  const getHealthTendencies = () => {
    switch (element) {
      case 'Fire':
        return [
          "High metabolic rate and natural vitality",
          "Quick recovery from illness",
          "Tendency toward inflammation",
          "Risk of burnout when overextended"
        ];
      case 'Earth':
        return [
          "Strong physical endurance",
          "Reliable immune system",
          "Tendency toward sluggish metabolism",
          "May retain toxins longer"
        ];
      case 'Air':
        return [
          "Quick, responsive nervous system",
          "Good circulation and oxygenation",
          "Susceptible to anxiety and stress",
          "May experience respiratory sensitivity"
        ];
      case 'Water':
        return [
          "Strong emotional resilience",
          "Effective lymphatic system",
          "Sensitive digestive system",
          "May experience fluid retention"
        ];
    }
  };
  
  // Wellness recommendations by element
  const getWellnessRecommendations = () => {
    switch (element) {
      case 'Fire':
        return "Fire signs benefit from activities that channel their abundant energy while preventing burnout and inflammation.";
      case 'Earth':
        return "Earth signs thrive with consistent routines, grounding practices, and nutrition that supports metabolism and detoxification.";
      case 'Air':
        return "Air signs benefit from breath-focused practices, mental clarity exercises, and activities that balance their active minds.";
      case 'Water':
        return "Water signs thrive with emotional regulation practices, hydration, and activities that promote circulation and lymphatic flow.";
    }
  };

  return (
    <div className={`${styles.bgClass} p-6 md:p-8 rounded-xl text-white`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className={`${styles.iconBgClass} rounded-full p-4 h-16 w-16 flex items-center justify-center flex-shrink-0 ${styles.borderClass} border-2`}>
          <span className="text-3xl">
            {element === 'Fire' && '🔥'}
            {element === 'Earth' && '🌿'}
            {element === 'Air' && '💨'}
            {element === 'Water' && '💧'}
          </span>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{element} Signs:</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {filteredSigns.map(sign => (
              <span key={sign.value} className={`${styles.textClass} font-medium`}>
                {sign.label}{filteredSigns.indexOf(sign) < filteredSigns.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className={`text-xl font-medium mb-3 ${styles.accentClass}`}>
          Health Tendencies
        </h3>
        <ul className="space-y-2">
          {getHealthTendencies().map((tendency, index) => (
            <li key={index} className="flex items-start">
              <Check className={`h-5 w-5 mr-2 ${styles.listMarkerClass} flex-shrink-0`} />
              <span className={styles.textClass}>{tendency}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className={`text-xl font-medium mb-3 ${styles.accentClass}`}>
          Wellness Recommendations
        </h3>
        <p className={styles.textClass}>
          {getWellnessRecommendations()}
        </p>
      </div>
    </div>
  );
}