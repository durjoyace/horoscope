import { ZodiacSign } from "@shared/types";

export const zodiacSignNames = [
  { value: "aries", label: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire", modality: "Cardinal", planet: "Mars", rulingPlanet: "Mars", traits: "Energetic, Courageous, Passionate", healthFocus: "Head, brain, and adrenal glands" },
  { value: "taurus", label: "Taurus", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth", modality: "Fixed", planet: "Venus", rulingPlanet: "Venus", traits: "Patient, Reliable, Persistent", healthFocus: "Neck, throat, and thyroid" },
  { value: "gemini", label: "Gemini", symbol: "♊", dates: "May 21 - Jun 20", element: "Air", modality: "Mutable", planet: "Mercury", rulingPlanet: "Mercury", traits: "Curious, Adaptable, Communicative", healthFocus: "Lungs, shoulders, arms, and nervous system" },
  { value: "cancer", label: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water", modality: "Cardinal", planet: "Moon", rulingPlanet: "Moon", traits: "Nurturing, Intuitive, Emotional", healthFocus: "Stomach, breasts, and digestive system" },
  { value: "leo", label: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire", modality: "Fixed", planet: "Sun", rulingPlanet: "Sun", traits: "Confident, Generous, Creative", healthFocus: "Heart, spine, and upper back" },
  { value: "virgo", label: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth", modality: "Mutable", planet: "Mercury", rulingPlanet: "Mercury", traits: "Analytical, Practical, Methodical", healthFocus: "Intestines and digestive system" },
  { value: "libra", label: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air", modality: "Cardinal", planet: "Venus", rulingPlanet: "Venus", traits: "Diplomatic, Fair, Social", healthFocus: "Kidneys, lower back, and skin" },
  { value: "scorpio", label: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water", modality: "Fixed", planet: "Pluto", rulingPlanet: "Pluto", traits: "Passionate, Resourceful, Brave", healthFocus: "Reproductive system and elimination" },
  { value: "sagittarius", label: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire", modality: "Mutable", planet: "Jupiter", rulingPlanet: "Jupiter", traits: "Optimistic, Freedom-loving, Honest", healthFocus: "Hips, thighs, and liver" },
  { value: "capricorn", label: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth", modality: "Cardinal", planet: "Saturn", rulingPlanet: "Saturn", traits: "Ambitious, Disciplined, Patient", healthFocus: "Bones, joints, and skin" },
  { value: "aquarius", label: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air", modality: "Fixed", planet: "Uranus", rulingPlanet: "Uranus", traits: "Progressive, Original, Independent", healthFocus: "Circulation, ankles, and calves" },
  { value: "pisces", label: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water", modality: "Mutable", planet: "Neptune", rulingPlanet: "Neptune", traits: "Compassionate, Artistic, Intuitive", healthFocus: "Feet, immune system, and lymphatics" },
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