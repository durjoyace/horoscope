import { ZodiacSign } from '@shared/types';
import { zodiacSignNames, zodiacElements } from './zodiacData';

export interface CompatibilityScore {
  overall: number;         // Overall compatibility score (1-100)
  friendship: number;      // Friendship compatibility (1-100)
  romance: number;         // Romantic compatibility (1-100)
  communication: number;   // Communication compatibility (1-100)
  trust: number;           // Trust compatibility (1-100)
}

export interface CompatibilityResult {
  score: CompatibilityScore;
  description: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}

export interface ZodiacPairDescription {
  headline: string;
  description: string;
}

// Function to calculate compatibility between two zodiac signs
export function getCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): CompatibilityResult {
  // Look up the compatibility in the matrix
  const key = `${sign1}_${sign2}`;
  const reverseKey = `${sign2}_${sign1}`;
  
  const result = compatibilityMatrix[key] || compatibilityMatrix[reverseKey];
  
  if (!result) {
    // Fallback for any missing combinations
    return {
      score: {
        overall: 50,
        friendship: 50,
        romance: 50,
        communication: 50,
        trust: 50,
      },
      description: `The compatibility between ${sign1} and ${sign2} is balanced with both opportunities and challenges.`,
      strengths: ["Understanding each other's perspectives", "Learning from different approaches"],
      challenges: ["May have different communication styles", "Different priorities and values"],
      advice: "Focus on appreciating your differences and learning from each other's strengths."
    };
  }
  
  return result;
}

// Helper function to get element compatibility
export function getElementCompatibility(element1: string, element2: string): number {
  const elementMatrix: Record<string, Record<string, number>> = {
    'Fire': {
      'Fire': 80,
      'Earth': 60,
      'Air': 90,
      'Water': 40
    },
    'Earth': {
      'Fire': 60,
      'Earth': 85,
      'Air': 50,
      'Water': 90
    },
    'Air': {
      'Fire': 90,
      'Earth': 50,
      'Air': 85,
      'Water': 60
    },
    'Water': {
      'Fire': 40,
      'Earth': 90,
      'Air': 60,
      'Water': 85
    }
  };
  
  return elementMatrix[element1]?.[element2] || 50;
}

// Helper function to get modality compatibility
export function getModalityCompatibility(modality1: string, modality2: string): number {
  const modalityMatrix: Record<string, Record<string, number>> = {
    'Cardinal': {
      'Cardinal': 65,
      'Fixed': 70,
      'Mutable': 80
    },
    'Fixed': {
      'Cardinal': 70,
      'Fixed': 60,
      'Mutable': 75
    },
    'Mutable': {
      'Cardinal': 80,
      'Fixed': 75,
      'Mutable': 85
    }
  };
  
  return modalityMatrix[modality1]?.[modality2] || 50;
}

// Function to get a textual description of two signs together
export function getZodiacPairDescription(sign1: ZodiacSign, sign2: ZodiacSign): ZodiacPairDescription {
  const key = `${sign1}_${sign2}`;
  const reverseKey = `${sign2}_${sign1}`;
  
  const description = zodiacPairDescriptions[key] || zodiacPairDescriptions[reverseKey];
  
  if (!description) {
    return {
      headline: `${sign1} & ${sign2}: Cosmic Connection`,
      description: `The relationship between ${sign1} and ${sign2} creates a unique cosmic blend with its own special dynamics.`
    };
  }
  
  return description;
}

// Compatibility matrix for specific sign combinations
// Only define unique / special combinations here; others will be calculated based on elements and modalities
const compatibilityMatrix: Record<string, CompatibilityResult> = {
  // Aries combinations
  'Aries_Leo': {
    score: {
      overall: 90,
      friendship: 95,
      romance: 90,
      communication: 85,
      trust: 88
    },
    description: "This is a dynamic and passionate fire sign match full of enthusiasm and creativity.",
    strengths: [
      "Mutual respect and admiration",
      "Similar energetic approach to life",
      "Shared sense of adventure and spontaneity",
      "Strong physical connection"
    ],
    challenges: [
      "Both can be stubborn and competitive",
      "May fight for dominance or attention",
      "Can neglect emotional depth in the relationship"
    ],
    advice: "Channel your competitive energy into supporting each other's goals rather than competing. Take turns being in the spotlight."
  },
  'Aries_Libra': {
    score: {
      overall: 85,
      friendship: 80,
      romance: 90,
      communication: 75,
      trust: 85
    },
    description: "This opposite sign match creates a complementary relationship with a strong attraction of opposites.",
    strengths: [
      "Balance each other well - action and consideration",
      "Strong initial attraction and chemistry",
      "Libra brings diplomacy to Aries' directness",
      "Aries brings decisiveness to Libra's indecision"
    ],
    challenges: [
      "Different approaches to conflict - Aries confronts while Libra avoids",
      "Aries may find Libra too hesitant",
      "Libra may find Aries too impulsive"
    ],
    advice: "Appreciate how you complement each other. Aries can learn patience from Libra, while Libra can learn to be more direct and decisive from Aries."
  },
  'Aries_Scorpio': {
    score: {
      overall: 65,
      friendship: 70,
      romance: 85,
      communication: 60,
      trust: 55
    },
    description: "Mars-ruled Aries and Scorpio share an intense, passionate connection that can be transformative but challenging.",
    strengths: [
      "Powerful physical and emotional intensity",
      "Both are courageous and willing to take risks",
      "Can accomplish great things together with shared determination",
      "Deeply loyal once trust is established"
    ],
    challenges: [
      "Power struggles are common",
      "Aries is open while Scorpio is secretive",
      "Both can be extremely stubborn",
      "Jealousy and possessiveness may arise"
    ],
    advice: "Learn to respect each other's different emotional styles. Aries needs to appreciate Scorpio's emotional depth, while Scorpio should value Aries' straightforwardness."
  },
  // Taurus combinations
  'Taurus_Virgo': {
    score: {
      overall: 95,
      friendship: 90,
      romance: 85,
      communication: 95,
      trust: 98
    },
    description: "This earth sign match creates a grounded, practical relationship with strong values alignment.",
    strengths: [
      "Shared practical approach to life",
      "Strong sense of loyalty and reliability",
      "Similar values regarding security and comfort",
      "Complementary work ethics that support each other"
    ],
    challenges: [
      "Both can be stubborn when opinions differ",
      "May become too routine-focused and predictable",
      "Tendency toward materialism",
      "Can be overly critical at times"
    ],
    advice: "Make time for spontaneity and new experiences to keep the relationship fresh. Appreciate your stability while purposefully creating moments of adventure."
  },
  'Taurus_Scorpio': {
    score: {
      overall: 80,
      friendship: 75,
      romance: 95,
      communication: 70,
      trust: 75
    },
    description: "This opposite sign match forms a deeply sensual and loyal bond with transformative potential.",
    strengths: [
      "Powerful physical attraction and chemistry",
      "Shared determination and loyalty",
      "Both value deep emotional connections",
      "Complementary approaches to resources and investments"
    ],
    challenges: [
      "Taurus prefers stability while Scorpio seeks transformation",
      "Power struggles over control and possessiveness",
      "Taurus' stubbornness vs. Scorpio's intensity",
      "Different emotional processing styles"
    ],
    advice: "Learn to embrace change together. Taurus can teach Scorpio stability, while Scorpio can help Taurus explore deeper emotional terrain and personal growth."
  },
  // Select more key combinations...
  'Gemini_Sagittarius': {
    score: {
      overall: 88,
      friendship: 95,
      romance: 85,
      communication: 90,
      trust: 80
    },
    description: "This air and fire combination creates an intellectually stimulating and adventurous partnership.",
    strengths: [
      "Excellent communication and mental connection",
      "Shared love of learning and exploration",
      "Mutual respect for independence",
      "Fun, playful dynamic that stays interesting"
    ],
    challenges: [
      "Both can be inconsistent and restless",
      "May lack emotional depth at times",
      "Difficulty with long-term planning and commitment",
      "Different approaches to truth and philosophy"
    ],
    advice: "Ground your intellectual connection with shared goals and rituals. Embrace your mutual need for freedom while creating meaningful traditions together."
  },
  'Cancer_Pisces': {
    score: {
      overall: 95,
      friendship: 90,
      romance: 98,
      communication: 92,
      trust: 95
    },
    description: "This water sign match creates a deeply intuitive, emotional and nurturing bond.",
    strengths: [
      "Strong emotional understanding and empathy",
      "Natural nurturing dynamic that flows both ways",
      "Shared appreciation for home, security and family",
      "Intuitive connection that feels fated"
    ],
    challenges: [
      "Both can be moody and emotionally reactive",
      "May enable each other's tendency to avoid reality",
      "Potential for emotional codependence",
      "Difficulty with boundaries and self-assertion"
    ],
    advice: "Balance your emotional depth with practical matters. Support each other in developing healthy boundaries and individual strength while maintaining your compassionate connection."
  },
  'Leo_Aquarius': {
    score: {
      overall: 85,
      friendship: 90,
      romance: 80,
      communication: 85,
      trust: 85
    },
    description: "This opposite sign match balances warmth and coolness, personal creativity and collective vision.",
    strengths: [
      "Mutual respect for each other's strengths",
      "Leo brings warmth to Aquarius' intellectualism",
      "Aquarius helps Leo channel passion toward higher causes",
      "Creative and intellectual stimulation"
    ],
    challenges: [
      "Leo desires personal attention while Aquarius focuses on groups",
      "Different approaches to emotion and expression",
      "Leo's pride versus Aquarius' detachment",
      "Potential power struggles over independence"
    ],
    advice: "Appreciate your different social styles and learn from each other. Leo can teach Aquarius about personal passion, while Aquarius can show Leo the power of community and innovation."
  }
};

// Descriptions for specific zodiac sign pairs
const zodiacPairDescriptions: Record<string, ZodiacPairDescription> = {
  'Aries_Leo': {
    headline: "Fire & Fire: The Power Couple",
    description: "When Aries and Leo come together, sparks fly in this energetic and passionate fire sign match. Both signs bring enthusiasm, creativity and a zest for life that keeps their relationship exciting and dynamic."
  },
  'Aries_Libra': {
    headline: "Dynamic Opposition: Action Meets Harmony",
    description: "Aries and Libra create a relationship of complementary opposites - Aries brings action, initiative and courage, while Libra contributes harmony, diplomacy and consideration. This polarity creates a magnetic attraction."
  },
  'Taurus_Scorpio': {
    headline: "Earth & Water: Sensual Depth",
    description: "The Taurus-Scorpio connection combines Taurus' groundedness with Scorpio's emotional intensity, creating a powerfully sensual and loyal bond built on shared values of commitment and determination."
  },
  'Gemini_Sagittarius': {
    headline: "Air & Fire: Intellectual Adventures",
    description: "Gemini and Sagittarius form a mentally stimulating partnership where Gemini's curiosity meets Sagittarius' vision. Together they create a relationship full of exploration, growth and philosophical discovery."
  },
  'Cancer_Pisces': {
    headline: "Water & Water: Emotional Resonance",
    description: "Cancer and Pisces connect on a deeply intuitive level, creating a nurturing and empathetic bond. Their emotional understanding allows for a relationship where both partners feel truly seen and supported."
  },
  'Leo_Aquarius': {
    headline: "Fire & Air: Creative Innovation",
    description: "When Leo and Aquarius come together, personal creativity meets social innovation. Leo's warmth and self-expression balances Aquarius' visionary thinking and humanitarian values."
  },
  'Virgo_Pisces': {
    headline: "Earth & Water: Practical Magic",
    description: "Virgo and Pisces create a balance of practicality and imagination. Virgo brings analysis and attention to detail, while Pisces contributes compassion and spiritual insight, helping each other grow in complementary ways."
  },
  'Libra_Aquarius': {
    headline: "Air & Air: Social Harmony",
    description: "The Libra-Aquarius connection combines Libra's one-on-one diplomacy with Aquarius' group-oriented vision. These air signs share intellectual curiosity and create a partnership based on equality, communication and social awareness."
  },
  'Scorpio_Pisces': {
    headline: "Water & Water: Emotional Alchemy",
    description: "Scorpio and Pisces create a deeply transformative water sign connection. Their emotional and intuitive bond allows for profound understanding, with Scorpio bringing focus and intensity while Pisces offers compassion and adaptability."
  },
  'Sagittarius_Aries': {
    headline: "Fire & Fire: Adventurous Spirit",
    description: "When Sagittarius and Aries unite, their shared fire element creates an adventurous, enthusiastic partnership. Both value freedom and exploration, bringing optimism, honesty and a love of new experiences to their relationship."
  },
  'Capricorn_Taurus': {
    headline: "Earth & Earth: Enduring Foundation",
    description: "Capricorn and Taurus form a practical, stable earth sign match focused on building security and meaningful achievements together. Their shared determination and reliability creates a partnership that stands the test of time."
  },
  'Aquarius_Gemini': {
    headline: "Air & Air: Intellectual Freedom",
    description: "Aquarius and Gemini connect through their shared air element, creating a mentally stimulating relationship that values independence, communication and innovation. Together they explore ideas and possibilities with enthusiasm."
  }
};