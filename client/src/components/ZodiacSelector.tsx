import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { zodiacSigns } from '@/utils/zodiac';
import { ZodiacSign } from '@shared/types';
import { SuccessModal } from './SuccessModal';

export const ZodiacSelector: React.FC = () => {
  const { user, signUp } = useUser();
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(
    (user?.zodiacSign as ZodiacSign) || null
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignSelect = async (sign: ZodiacSign) => {
    setSelectedSign(sign);
    
    // If user is already logged in, update their zodiac sign
    if (user?.email) {
      try {
        const result = await signUp({
          ...user,
          zodiacSign: sign
        });
        
        if (result.success) {
          setSuccessMessage(
            `${sign.charAt(0).toUpperCase() + sign.slice(1)} selected! Your horoscope preferences have been updated.`
          );
          setIsSuccessModalOpen(true);
        }
      } catch (error) {
        console.error('Error updating zodiac sign:', error);
      }
    } else {
      // Just show success message without saving
      setSuccessMessage(
        `${sign.charAt(0).toUpperCase() + sign.slice(1)} selected! Sign up to receive your personalized horoscope.`
      );
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">Find Your Sign</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Your zodiac sign reveals unique patterns about your health and wellness needs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {zodiacSigns.map((sign) => (
            <button
              key={sign.sign}
              onClick={() => handleSignSelect(sign.sign)}
              className={`flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition duration-200 ${
                selectedSign === sign.sign ? 'bg-gray-50 ring-2 ring-indigo-200' : ''
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <i className={`fas fa-${sign.icon} text-indigo-900 text-xl`}></i>
              </div>
              <span className="font-medium">{sign.name}</span>
              <span className="text-xs text-gray-500">{sign.dateRange}</span>
            </button>
          ))}
        </div>
      </div>
      
      <SuccessModal
        isOpen={isSuccessModalOpen}
        message={successMessage}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </section>
  );
};
