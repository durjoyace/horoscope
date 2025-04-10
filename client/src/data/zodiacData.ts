import { ZodiacSign } from '@shared/types';

export interface ZodiacSignData {
  value: ZodiacSign;
  label: string;
  symbol: string;
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  rulingPlanet: string;
  traits: string;
  healthFocus: string;
  image?: string;
}

export const zodiacSignNames: ZodiacSignData[] = [
  {
    value: 'aries',
    label: 'Aries',
    symbol: '♈',
    dates: 'March 21 - April 19',
    element: 'Fire',
    modality: 'Cardinal',
    rulingPlanet: 'Mars',
    traits: 'Energetic, courageous, independent, impulsive',
    healthFocus: 'Head, brain, eyes, face, adrenal glands'
  },
  {
    value: 'taurus',
    label: 'Taurus',
    symbol: '♉',
    dates: 'April 20 - May 20',
    element: 'Earth',
    modality: 'Fixed',
    rulingPlanet: 'Venus',
    traits: 'Patient, reliable, stubborn, possessive',
    healthFocus: 'Neck, throat, thyroid gland, vocal tract'
  },
  {
    value: 'gemini',
    label: 'Gemini',
    symbol: '♊',
    dates: 'May 21 - June 20',
    element: 'Air',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    traits: 'Adaptable, versatile, curious, inconsistent',
    healthFocus: 'Arms, shoulders, hands, lungs, nervous system'
  },
  {
    value: 'cancer',
    label: 'Cancer',
    symbol: '♋',
    dates: 'June 21 - July 22',
    element: 'Water',
    modality: 'Cardinal',
    rulingPlanet: 'Moon',
    traits: 'Intuitive, emotional, protective, moody',
    healthFocus: 'Chest, breasts, stomach, digestive system'
  },
  {
    value: 'leo',
    label: 'Leo',
    symbol: '♌',
    dates: 'July 23 - August 22',
    element: 'Fire',
    modality: 'Fixed',
    rulingPlanet: 'Sun',
    traits: 'Generous, loyal, theatrical, proud',
    healthFocus: 'Heart, upper back, spine, circulation'
  },
  {
    value: 'virgo',
    label: 'Virgo',
    symbol: '♍',
    dates: 'August 23 - September 22',
    element: 'Earth',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    traits: 'Analytical, practical, diligent, critical',
    healthFocus: 'Digestive system, intestines, spleen, nervous system'
  },
  {
    value: 'libra',
    label: 'Libra',
    symbol: '♎',
    dates: 'September 23 - October 22',
    element: 'Air',
    modality: 'Cardinal',
    rulingPlanet: 'Venus',
    traits: 'Diplomatic, fair, social, indecisive',
    healthFocus: 'Kidneys, lumbar region, skin, lower back'
  },
  {
    value: 'scorpio',
    label: 'Scorpio',
    symbol: '♏',
    dates: 'October 23 - November 21',
    element: 'Water',
    modality: 'Fixed',
    rulingPlanet: 'Pluto/Mars',
    traits: 'Passionate, resourceful, determined, secretive',
    healthFocus: 'Reproductive system, sexual organs, colon, bladder'
  },
  {
    value: 'sagittarius',
    label: 'Sagittarius',
    symbol: '♐',
    dates: 'November 22 - December 21',
    element: 'Fire',
    modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    traits: 'Optimistic, freedom-loving, philosophical, tactless',
    healthFocus: 'Hips, thighs, liver, sciatic nerve'
  },
  {
    value: 'capricorn',
    label: 'Capricorn',
    symbol: '♑',
    dates: 'December 22 - January 19',
    element: 'Earth',
    modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    traits: 'Disciplined, responsible, practical, pessimistic',
    healthFocus: 'Bones, joints, knees, skeletal system'
  },
  {
    value: 'aquarius',
    label: 'Aquarius',
    symbol: '♒',
    dates: 'January 20 - February 18',
    element: 'Air',
    modality: 'Fixed',
    rulingPlanet: 'Uranus/Saturn',
    traits: 'Progressive, original, independent, aloof',
    healthFocus: 'Circulatory system, ankles, calves, electrical forces in body'
  },
  {
    value: 'pisces',
    label: 'Pisces',
    symbol: '♓',
    dates: 'February 19 - March 20',
    element: 'Water',
    modality: 'Mutable',
    rulingPlanet: 'Neptune/Jupiter',
    traits: 'Compassionate, intuitive, artistic, oversensitive',
    healthFocus: 'Feet, lymphatic system, immune system, hormones'
  }
];

export const zodiacElementColors: Record<string, string> = {
  'Fire': 'text-red-500',
  'Earth': 'text-green-600',
  'Air': 'text-blue-500',
  'Water': 'text-indigo-500'
};

export const getZodiacSignByDate = (month: number, day: number): ZodiacSign => {
  // Note: month is 0-indexed (0 = January, 11 = December)
  const dates = [
    { month: 0, day: 20, sign: 'aquarius' }, // Jan 20
    { month: 1, day: 19, sign: 'pisces' },   // Feb 19
    { month: 2, day: 21, sign: 'aries' },    // Mar 21
    { month: 3, day: 20, sign: 'taurus' },   // Apr 20
    { month: 4, day: 21, sign: 'gemini' },   // May 21
    { month: 5, day: 21, sign: 'cancer' },   // Jun 21
    { month: 6, day: 23, sign: 'leo' },      // Jul 23
    { month: 7, day: 23, sign: 'virgo' },    // Aug 23
    { month: 8, day: 23, sign: 'libra' },    // Sep 23
    { month: 9, day: 23, sign: 'scorpio' },  // Oct 23
    { month: 10, day: 22, sign: 'sagittarius' }, // Nov 22
    { month: 11, day: 22, sign: 'capricorn' }    // Dec 22
  ];

  let sign: ZodiacSign = 'capricorn';  // Default to Capricorn (Dec 22 - Jan 19)
  
  for (const entry of dates) {
    if (month === entry.month && day >= entry.day || month > entry.month) {
      sign = entry.sign as ZodiacSign;
    }
  }
  
  return sign;
};

// Zodiac sign natural compatibilities
export const getCompatibilityScore = (sign1: ZodiacSign, sign2: ZodiacSign): number => {
  // Same sign
  if (sign1 === sign2) return 70;

  const sign1Data = zodiacSignNames.find(s => s.value === sign1);
  const sign2Data = zodiacSignNames.find(s => s.value === sign2);

  if (!sign1Data || !sign2Data) return 50;

  // Element compatibility
  let elementScore = 50;
  
  // Same element = high compatibility
  if (sign1Data.element === sign2Data.element) {
    elementScore = 80;
  } else {
    // Complementary elements
    const complementary: Record<string, string[]> = {
      'Fire': ['Air'],
      'Air': ['Fire'],
      'Earth': ['Water'],
      'Water': ['Earth']
    };
    
    if (complementary[sign1Data.element]?.includes(sign2Data.element)) {
      elementScore = 75;
    } else {
      // Challenging elements
      const challenging: Record<string, string[]> = {
        'Fire': ['Water'],
        'Water': ['Fire'],
        'Earth': ['Air'],
        'Air': ['Earth']
      };
      
      if (challenging[sign1Data.element]?.includes(sign2Data.element)) {
        elementScore = 40;
      }
    }
  }

  // Modality compatibility
  let modalityScore = 60;
  
  // Same modality can be competitive
  if (sign1Data.modality === sign2Data.modality) {
    modalityScore = 60;
  } else {
    // Complementary modalities
    const complementary: Record<string, string[]> = {
      'Cardinal': ['Fixed'],
      'Fixed': ['Mutable'],
      'Mutable': ['Cardinal']
    };
    
    if (complementary[sign1Data.modality]?.includes(sign2Data.modality)) {
      modalityScore = 70;
    }
  }

  // Final score, weighted more toward element compatibility
  return Math.round((elementScore * 0.6) + (modalityScore * 0.4));
};

export const zodiacWellnessRecommendations: Record<ZodiacSign, {
  nutritionTips: string[];
  exerciseTypes: string[];
  relaxationMethods: string[];
  dailyWellnessHabits: string[];
}> = {
  'aries': {
    nutritionTips: [
      'High-protein foods to support energy levels',
      'Iron-rich foods for blood circulation',
      'Spicy foods in moderation to balance fire energy',
      'Stay hydrated to prevent headaches'
    ],
    exerciseTypes: [
      'High-intensity interval training',
      'Competitive sports',
      'Martial arts',
      'Sprint training'
    ],
    relaxationMethods: [
      'Active meditation',
      'Nature walks',
      'Progressive muscle relaxation',
      'Short, frequent breaks throughout the day'
    ],
    dailyWellnessHabits: [
      'Morning exercise to channel energy',
      'Cool compresses for headaches',
      'Eye exercises to reduce strain',
      'Regular blood pressure monitoring'
    ]
  },
  'taurus': {
    nutritionTips: [
      'Root vegetables for grounding',
      'Calcium-rich foods for bone health',
      'Whole grains for sustained energy',
      'Limited sugar to protect throat health'
    ],
    exerciseTypes: [
      'Resistance training with slow, controlled movements',
      'Yoga with longer-held poses',
      'Walking in nature',
      'Gardening as physical activity'
    ],
    relaxationMethods: [
      'Aromatherapy with earthy scents',
      'Massage therapy',
      'Sound healing',
      'Pottery or tactile crafts'
    ],
    dailyWellnessHabits: [
      'Neck stretches throughout the day',
      'Warm beverages for throat comfort',
      'Singing or humming for vocal health',
      'Regular thyroid check-ups'
    ]
  },
  'gemini': {
    nutritionTips: [
      'Oxygen-rich foods like leafy greens',
      'Brain-supporting foods with omega-3s',
      'Small, frequent meals for nervous energy',
      'Herbal teas for nervous system support'
    ],
    exerciseTypes: [
      'Varied workout routines',
      'Social sports and activities',
      'Dance classes with diverse movements',
      'Coordination exercises for dexterity'
    ],
    relaxationMethods: [
      'Breathing exercises',
      'Journaling to quiet the mind',
      'Audiobooks or guided meditations',
      'Social downtime with meaningful conversation'
    ],
    dailyWellnessHabits: [
      'Regular hand and finger stretches',
      'Respiratory exercises for lung health',
      'Digital detoxes to rest the mind',
      'Learning new skills for mental stimulation'
    ]
  },
  'cancer': {
    nutritionTips: [
      'Easily digestible foods',
      'Calcium-rich foods for emotional balance',
      'Hydrating foods with high water content',
      'Soothing herbs for digestive comfort'
    ],
    exerciseTypes: [
      'Water-based activities like swimming',
      'Gentle flowing movements like tai chi',
      'Home-based workout routines',
      'Group classes with a community feel'
    ],
    relaxationMethods: [
      'Moon bathing and lunar rituals',
      'Hot baths with calming salts',
      'Emotional release practices',
      'Nurturing creativity through art'
    ],
    dailyWellnessHabits: [
      'Chest-opening stretches',
      'Digestive support through probiotics',
      'Emotional check-ins and journaling',
      'Creating nurturing home environments'
    ]
  },
  'leo': {
    nutritionTips: [
      'Heart-healthy foods rich in antioxidants',
      'Magnesium-rich foods for circulation',
      'Sunny, vibrant fruits and vegetables',
      'Proper hydration for cellular health'
    ],
    exerciseTypes: [
      'Performance-based fitness classes',
      'Strength training for core and back',
      'Outdoor activities in sunshine',
      'Leadership roles in group sports'
    ],
    relaxationMethods: [
      'Creative expression through art or drama',
      'Sunlight therapy',
      'Heart-centered meditation',
      'Social relaxation with meaningful recognition'
    ],
    dailyWellnessHabits: [
      'Spine and back stretches',
      'Heart rate monitoring',
      'Posture awareness exercises',
      'Self-expression through fashion or style'
    ]
  },
  'virgo': {
    nutritionTips: [
      'Clean, whole foods with minimal processing',
      'Fiber-rich foods for digestive health',
      'Fermented foods for gut microbiome',
      'Methodical meal planning for balanced nutrition'
    ],
    exerciseTypes: [
      'Precise, technique-focused workouts',
      'Pilates for core strength',
      'Tracking-based fitness routines',
      'Functional training for practical strength'
    ],
    relaxationMethods: [
      'Organizational activities as meditation',
      'Nature therapy in clean environments',
      'Detailed crafts requiring focus',
      'Analysis-free relaxation periods'
    ],
    dailyWellnessHabits: [
      'Digestive massage techniques',
      'Food combining for optimal digestion',
      'Regular health monitoring and tracking',
      'Scheduled relaxation periods'
    ]
  },
  'libra': {
    nutritionTips: [
      'Balanced meals with equal proportions',
      'Kidney-supporting foods',
      'Alkaline-forming foods for pH balance',
      'Visually appealing meals for enjoyment'
    ],
    exerciseTypes: [
      'Partner-based workouts',
      'Dance for grace and coordination',
      'Balanced routines working all muscle groups',
      'Aesthetically pleasing environments for exercise'
    ],
    relaxationMethods: [
      'Beauty rituals and spa treatments',
      'Balanced social and alone time',
      'Harmonious music therapy',
      'Aesthetic surroundings for relaxation'
    ],
    dailyWellnessHabits: [
      'Lower back stretches',
      'Kidney-supporting hydration',
      'Skin care routines',
      'Creating balance between work and leisure'
    ]
  },
  'scorpio': {
    nutritionTips: [
      'Detoxifying foods for elimination systems',
      'Foods rich in zinc and magnesium',
      'Deeply nourishing bone broths and stews',
      'Fermented foods for gut health'
    ],
    exerciseTypes: [
      'Intense, transformative workouts',
      'Regenerative exercise like rebounding',
      'Water sports and swimming',
      'Deep core and pelvic floor training'
    ],
    relaxationMethods: [
      'Deep tissue massage',
      'Transformational breathwork',
      'Shadow work and emotional release',
      'Immersive sensory experiences'
    ],
    dailyWellnessHabits: [
      'Pelvic floor exercises',
      'Detoxification practices',
      'Emotional energy clearing',
      'Regular colon and bladder health monitoring'
    ]
  },
  'sagittarius': {
    nutritionTips: [
      'Foods that support liver health',
      'International cuisine variety',
      'High-quality proteins for muscle support',
      'Anti-inflammatory foods for joint health'
    ],
    exerciseTypes: [
      'Long-distance activities like hiking or cycling',
      'Outdoor adventure sports',
      'Travel-based physical activities',
      'Expansive movements like archery'
    ],
    relaxationMethods: [
      'Travel and exploration as relaxation',
      'Philosophical reading and discussion',
      'Vision quests and spiritual retreats',
      'Laughter therapy and comedic entertainment'
    ],
    dailyWellnessHabits: [
      'Hip and thigh stretches',
      'Liver support through hydration',
      'Learning something new daily',
      'Regular movement throughout the day'
    ]
  },
  'capricorn': {
    nutritionTips: [
      'Bone-building minerals like calcium and magnesium',
      'Foods rich in Vitamin D',
      'Grounding root vegetables',
      'High-quality proteins for structural support'
    ],
    exerciseTypes: [
      'Progressive weight-bearing exercises',
      'Mountain climbing or stair training',
      'Structured fitness programs with measurable goals',
      'Traditional strength training'
    ],
    relaxationMethods: [
      'Achievement-based relaxation',
      'Time in mountains or with stones',
      'Structured meditation with goals',
      'Historical or traditional relaxation methods'
    ],
    dailyWellnessHabits: [
      'Knee and joint care routines',
      'Posture improvement exercises',
      'Bone density-supporting activities',
      'Regular skin maintenance for aging prevention'
    ]
  },
  'aquarius': {
    nutritionTips: [
      'Circulation-boosting foods',
      'Electrolyte-balanced hydration',
      'Innovative superfoods and nutritional technology',
      'Community-supported agriculture participation'
    ],
    exerciseTypes: [
      'Innovative fitness technology and trends',
      'Group fitness classes with social aspects',
      'Electrical muscle stimulation training',
      'Unconventional movement patterns'
    ],
    relaxationMethods: [
      'Floatation therapy',
      'Technological relaxation aids',
      'Community-based relaxation events',
      'Intellectual stimulation as relaxation'
    ],
    dailyWellnessHabits: [
      'Ankle and calf stretches',
      'Circulation-boosting practices',
      'Electrical balance through grounding',
      'Innovation in daily health routines'
    ]
  },
  'pisces': {
    nutritionTips: [
      'Omega-3 rich foods for brain health',
      'Hydrating foods with high water content',
      'Immune-supporting nutrients',
      'Gentle, easily digestible proteins'
    ],
    exerciseTypes: [
      'Water-based exercises like swimming or water aerobics',
      'Flowing movements like dance or tai chi',
      'Yoga with emphasis on surrender and release',
      'Barefoot training for foot strength'
    ],
    relaxationMethods: [
      'Sensory deprivation experiences',
      'Spiritual practices and meditation',
      'Music therapy with ambient sounds',
      'Dream work and visualization'
    ],
    dailyWellnessHabits: [
      'Foot care and reflexology',
      'Lymphatic system support',
      'Immune system boosting practices',
      'Regular sleep hygiene for dream health'
    ]
  }
};