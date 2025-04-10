import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ElementSignsContent from '@/components/ElementSignsContent';

export default function ElementsGuide() {
  const [currentElement, setCurrentElement] = useState<'Fire' | 'Earth' | 'Air' | 'Water'>('Fire');
  
  const elements: Array<'Fire' | 'Earth' | 'Air' | 'Water'> = ['Fire', 'Earth', 'Air', 'Water'];
  const currentIndex = elements.indexOf(currentElement);
  
  const goToNextElement = () => {
    const nextIndex = (currentIndex + 1) % elements.length;
    setCurrentElement(elements[nextIndex]);
  };
  
  const goToPrevElement = () => {
    const prevIndex = (currentIndex - 1 + elements.length) % elements.length;
    setCurrentElement(elements[prevIndex]);
  };
  
  const getElementColor = (element: string): string => {
    switch (element) {
      case 'Fire': return 'bg-red-700 text-white hover:bg-red-800';
      case 'Earth': return 'bg-green-700 text-white hover:bg-green-800';
      case 'Air': return 'bg-purple-700 text-white hover:bg-purple-800';
      case 'Water': return 'bg-blue-700 text-white hover:bg-blue-800';
      default: return 'bg-primary';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Element Guide
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Each zodiac sign belongs to one of four elements, influencing your health tendencies and wellness needs
        </p>
      </div>
      
      {/* Element Tab Buttons */}
      <div className="grid grid-cols-4 gap-1 md:gap-3 mb-6 max-w-2xl mx-auto">
        {elements.map((element) => (
          <Button
            key={element}
            variant={currentElement === element ? "default" : "outline"}
            className={`text-xs sm:text-sm ${currentElement === element ? getElementColor(element) : ''}`}
            onClick={() => setCurrentElement(element)}
          >
            {element === 'Fire' && '🔥 '}
            {element === 'Earth' && '🌿 '}
            {element === 'Air' && '💨 '}
            {element === 'Water' && '💧 '}
            <span className="hidden xs:inline">{element} Signs</span>
            <span className="xs:hidden">{element}</span>
          </Button>
        ))}
      </div>
      
      {/* Element Content */}
      <div className="relative">
        <ElementSignsContent element={currentElement} />
        
        {/* Navigation Arrows */}
        <button 
          onClick={goToPrevElement}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 text-foreground rounded-full p-2 shadow-md hover:bg-background"
          aria-label="Previous element"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button 
          onClick={goToNextElement}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 text-foreground rounded-full p-2 shadow-md hover:bg-background"
          aria-label="Next element"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}