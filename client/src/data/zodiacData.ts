import { ZodiacSign } from "@shared/types";

export const zodiacSignNames = [
  { value: "aries", label: "Aries" },
  { value: "taurus", label: "Taurus" },
  { value: "gemini", label: "Gemini" },
  { value: "cancer", label: "Cancer" },
  { value: "leo", label: "Leo" },
  { value: "virgo", label: "Virgo" },
  { value: "libra", label: "Libra" },
  { value: "scorpio", label: "Scorpio" },
  { value: "sagittarius", label: "Sagittarius" },
  { value: "capricorn", label: "Capricorn" },
  { value: "aquarius", label: "Aquarius" },
  { value: "pisces", label: "Pisces" },
];

export const zodiacSignDates = {
  aries: { start: "March 21", end: "April 19" },
  taurus: { start: "April 20", end: "May 20" },
  gemini: { start: "May 21", end: "June 20" },
  cancer: { start: "June 21", end: "July 22" },
  leo: { start: "July 23", end: "August 22" },
  virgo: { start: "August 23", end: "September 22" },
  libra: { start: "September 23", end: "October 22" },
  scorpio: { start: "October 23", end: "November 21" },
  sagittarius: { start: "November 22", end: "December 21" },
  capricorn: { start: "December 22", end: "January 19" },
  aquarius: { start: "January 20", end: "February 18" },
  pisces: { start: "February 19", end: "March 20" },
};

export const zodiacElements = {
  aries: "Fire",
  leo: "Fire",
  sagittarius: "Fire",
  taurus: "Earth",
  virgo: "Earth",
  capricorn: "Earth",
  gemini: "Air",
  libra: "Air",
  aquarius: "Air",
  cancer: "Water",
  scorpio: "Water",
  pisces: "Water",
};

export const zodiacTraits = {
  aries: ["Energetic", "Courageous", "Passionate", "Competitive", "Impulsive"],
  taurus: ["Patient", "Reliable", "Persistent", "Practical", "Sensual"],
  gemini: ["Curious", "Adaptable", "Communicative", "Playful", "Inconsistent"],
  cancer: ["Nurturing", "Intuitive", "Emotional", "Protective", "Loyal"],
  leo: ["Confident", "Generous", "Creative", "Enthusiastic", "Proud"],
  virgo: ["Analytical", "Practical", "Methodical", "Reliable", "Perfectionist"],
  libra: ["Diplomatic", "Fair", "Social", "Cooperative", "Idealistic"],
  scorpio: ["Passionate", "Resourceful", "Brave", "Determined", "Secretive"],
  sagittarius: ["Optimistic", "Freedom-loving", "Honest", "Philosophical", "Adventurous"],
  capricorn: ["Ambitious", "Disciplined", "Patient", "Responsible", "Practical"],
  aquarius: ["Progressive", "Original", "Independent", "Humanitarian", "Detached"],
  pisces: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Dreamy"],
};

export const zodiacWellnessAreas = {
  aries: {
    strength: "Physical activity and high-intensity workouts",
    challenge: "Headaches, stress, and inflammation",
    recommendation: "Balance high-energy activities with meditation and cooling foods"
  },
  taurus: {
    strength: "Strong constitution and endurance",
    challenge: "Throat issues and thyroid health",
    recommendation: "Regular massage and voice exercises"
  },
  gemini: {
    strength: "Adaptability and respiratory capacity",
    challenge: "Nervous system and respiratory health",
    recommendation: "Breathing exercises and aerobic activities"
  },
  cancer: {
    strength: "Strong immune system and digestive health",
    challenge: "Emotional sensitivity affecting digestion",
    recommendation: "Gut-friendly foods and emotional self-care"
  },
  leo: {
    strength: "Strong heart and circulation",
    challenge: "Cardiovascular health and back issues",
    recommendation: "Heart-healthy diet and proper posture"
  },
  virgo: {
    strength: "Digestive efficiency and analytical approach to health",
    challenge: "Digestive sensitivity and overthinking",
    recommendation: "Fiber-rich diet and mind-body practices"
  },
  libra: {
    strength: "Natural balance and kidney function",
    challenge: "Lower back pain and skin conditions",
    recommendation: "Balanced nutrition and hydration"
  },
  scorpio: {
    strength: "Strong regenerative abilities",
    challenge: "Reproductive health and detoxification",
    recommendation: "Regular detox practices and emotional release"
  },
  sagittarius: {
    strength: "Natural optimism and liver function",
    challenge: "Hip and thigh issues, liver health",
    recommendation: "Long-distance activities and liver-supporting foods"
  },
  capricorn: {
    strength: "Endurance and skeletal strength",
    challenge: "Joint health and skin concerns",
    recommendation: "Weight-bearing exercise and calcium-rich foods"
  },
  aquarius: {
    strength: "Circulation and electrical impulses",
    challenge: "Ankle issues and circulatory health",
    recommendation: "Innovative fitness approaches and circulation-boosting foods"
  },
  pisces: {
    strength: "Immune system and lymphatic function",
    challenge: "Foot health and lymphatic issues",
    recommendation: "Hydrotherapy and immune-supporting practices"
  }
};

// Export zodiacWellnessRecommendations as an alias of zodiacWellnessAreas for backward compatibility
export const zodiacWellnessRecommendations = zodiacWellnessAreas;