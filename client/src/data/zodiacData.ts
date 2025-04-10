import { ZodiacSign } from '@shared/types';

// Zodiac signs data with additional health and wellness information
export const zodiacSignNames = [
  {
    value: 'aries' as ZodiacSign,
    label: 'Aries',
    symbol: '♈',
    element: 'Fire',
    dates: 'Mar 21 - Apr 19',
    wellnessFocus: 'Active physical activity and stress management',
    healthTraits: [
      'High energy and physical vitality',
      'Fast recovery from illness',
      'Strong immune response',
      'Excellent circulation',
      'Quick metabolism'
    ],
    wellnessRecommendations: [
      'High-intensity interval training',
      'Competition-based fitness activities',
      'Mindfulness practice for stress management',
      'Cooling foods to balance inner heat',
      'Regular physical outlets for energy'
    ],
    compatibility: ['leo', 'sagittarius', 'gemini', 'aquarius']
  },
  {
    value: 'taurus' as ZodiacSign,
    label: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    dates: 'Apr 20 - May 20',
    wellnessFocus: 'Nutrition, comfort, and sensory balance',
    healthTraits: [
      'Strong constitution',
      'Physical endurance',
      'Good digestion',
      'Natural affinity for nutrition',
      'Steady energy levels'
    ],
    wellnessRecommendations: [
      'Strength training and resistance exercises',
      'Mindful eating practices',
      'Nature-based activities and earthing',
      'Massage and touch therapies',
      'Consistent sleep routines'
    ],
    compatibility: ['virgo', 'capricorn', 'cancer', 'pisces']
  },
  {
    value: 'gemini' as ZodiacSign,
    label: 'Gemini',
    symbol: '♊',
    element: 'Air',
    dates: 'May 21 - Jun 20',
    wellnessFocus: 'Mental stimulation, flexibility, and respiratory health',
    healthTraits: [
      'Quick neural responses',
      'Mental adaptability',
      'Coordination and dexterity',
      'Fast metabolism',
      'Natural flexibility'
    ],
    wellnessRecommendations: [
      'Varied exercise routines',
      'Brain-boosting activities',
      'Breathing exercises and respiratory care',
      'Social fitness classes',
      'Coordination-based activities'
    ],
    compatibility: ['libra', 'aquarius', 'aries', 'leo']
  },
  {
    value: 'cancer' as ZodiacSign,
    label: 'Cancer',
    symbol: '♋',
    element: 'Water',
    dates: 'Jun 21 - Jul 22',
    wellnessFocus: 'Emotional wellness, gut health, and self-nurturing',
    healthTraits: [
      'Strong intuition about health needs',
      'Emotional resilience',
      'Nurturing self-care abilities',
      'Good water retention capacity',
      'Natural caretaking instincts'
    ],
    wellnessRecommendations: [
      'Water-based therapies and swimming',
      'Gut-supporting nutrition',
      'Emotional processing practices',
      'Moon-cycle wellness routines',
      'Family-based wellness activities'
    ],
    compatibility: ['scorpio', 'pisces', 'taurus', 'virgo']
  },
  {
    value: 'leo' as ZodiacSign,
    label: 'Leo',
    symbol: '♌',
    element: 'Fire',
    dates: 'Jul 23 - Aug 22',
    wellnessFocus: 'Heart health, vitality, and creative expression',
    healthTraits: [
      'Strong heart and circulation',
      'Natural leadership in health',
      'Radiant energy and vitality',
      'Quick recovery ability',
      'Powerful immune system'
    ],
    wellnessRecommendations: [
      'Heart-strengthening cardio',
      'Performance-based fitness',
      'Sunny outdoor activities',
      'Creative movement practices',
      'Social exercise programs'
    ],
    compatibility: ['aries', 'sagittarius', 'gemini', 'libra']
  },
  {
    value: 'virgo' as ZodiacSign,
    label: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    dates: 'Aug 23 - Sep 22',
    wellnessFocus: 'Digestive health, nutrition, and precise self-care',
    healthTraits: [
      'Excellent body awareness',
      'Strong analytical health approach',
      'Natural healing abilities',
      'Dietary intuition',
      'Precise health management'
    ],
    wellnessRecommendations: [
      'Detailed nutrition planning',
      'Precision-focused exercise',
      'Digestive health protocols',
      'Systematic detoxification',
      'Functional fitness routines'
    ],
    compatibility: ['taurus', 'capricorn', 'cancer', 'scorpio']
  },
  {
    value: 'libra' as ZodiacSign,
    label: 'Libra',
    symbol: '♎',
    element: 'Air',
    dates: 'Sep 23 - Oct 22',
    wellnessFocus: 'Balance, harmony, and kidney/adrenal health',
    healthTraits: [
      'Natural sense of balance',
      'Aesthetic wellness approach',
      'Strong kidney function',
      'Harmonious energy flow',
      'Social health awareness'
    ],
    wellnessRecommendations: [
      'Balance-focused exercises',
      'Partner fitness activities',
      'Aesthetically pleasing workouts',
      'Kidney-supporting nutrition',
      'Harmonious environment creation'
    ],
    compatibility: ['gemini', 'aquarius', 'leo', 'sagittarius']
  },
  {
    value: 'scorpio' as ZodiacSign,
    label: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    dates: 'Oct 23 - Nov 21',
    wellnessFocus: 'Transformation, reproductive health, and emotional depth',
    healthTraits: [
      'Strong regenerative abilities',
      'Deep healing capacity',
      'Powerful endurance',
      'Intense focus on health',
      'Transformative wellness approach'
    ],
    wellnessRecommendations: [
      'Intense, transformative workouts',
      'Reproductive health support',
      'Depth psychology practices',
      'Detoxification protocols',
      'Water-based purification'
    ],
    compatibility: ['cancer', 'pisces', 'virgo', 'capricorn']
  },
  {
    value: 'sagittarius' as ZodiacSign,
    label: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    dates: 'Nov 22 - Dec 21',
    wellnessFocus: 'Exploration, hip/thigh health, and philosophical wellness',
    healthTraits: [
      'Natural optimism about health',
      'Strong lower body',
      'Physical enthusiasm',
      'Quick recovery',
      'Adventure-seeking wellness drive'
    ],
    wellnessRecommendations: [
      'Outdoor adventure fitness',
      'Long-distance activities',
      'Hip and thigh strengthening',
      'Global wellness traditions',
      'Philosophical wellness study'
    ],
    compatibility: ['aries', 'leo', 'libra', 'aquarius']
  },
  {
    value: 'capricorn' as ZodiacSign,
    label: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    dates: 'Dec 22 - Jan 19',
    wellnessFocus: 'Structural strength, bone health, and disciplined practices',
    healthTraits: [
      'Exceptional discipline',
      'Strong skeletal structure',
      'Long-term health vision',
      'Steady endurance',
      'Pragmatic wellness approach'
    ],
    wellnessRecommendations: [
      'Bone-strengthening routines',
      'Structured fitness programs',
      'Time-tested wellness traditions',
      'Longevity-focused practices',
      'Achievement-based health goals'
    ],
    compatibility: ['taurus', 'virgo', 'scorpio', 'pisces']
  },
  {
    value: 'aquarius' as ZodiacSign,
    label: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    dates: 'Jan 20 - Feb 18',
    wellnessFocus: 'Circulatory health, innovation, and community wellness',
    healthTraits: [
      'Forward-thinking health approach',
      'Strong electrical system',
      'Community wellness focus',
      'Intuitive healing abilities',
      'Experimental wellness mindset'
    ],
    wellnessRecommendations: [
      'Innovative fitness technology',
      'Group exercise programs',
      'Circulation-boosting activities',
      'Alternative health modalities',
      'Socially conscious nutrition'
    ],
    compatibility: ['gemini', 'libra', 'sagittarius', 'aries']
  },
  {
    value: 'pisces' as ZodiacSign,
    label: 'Pisces',
    symbol: '♓',
    element: 'Water',
    dates: 'Feb 19 - Mar 20',
    wellnessFocus: 'Lymphatic health, foot care, and spiritual wellness',
    healthTraits: [
      'Strong intuitive healing',
      'Empathetic health awareness',
      'Adaptive immune responses',
      'Spiritual wellness connection',
      'Artistic healing expression'
    ],
    wellnessRecommendations: [
      'Fluid movement practices',
      'Foot health attention',
      'Water-based therapies',
      'Lymphatic drainage support',
      'Meditation and spiritual practices'
    ],
    compatibility: ['cancer', 'scorpio', 'capricorn', 'taurus']
  }
];

// Element-based characteristics
export const zodiacElementColors = {
  Fire: '#FF5533',
  Earth: '#4CAF50',
  Air: '#7F42DE',
  Water: '#3389FF'
};

export const elementCharacteristics = {
  Fire: {
    personality: 'Passionate, dynamic, and spontaneous energy that drives action and creativity',
    strengths: 'Enthusiastic health motivation, quick metabolism, strong circulation, fast recovery, and natural warmth',
    challenges: 'Tendency toward inflammation, burnout, high stress reactivity, impulsive health decisions, and overexertion',
    nutrition: 'Benefits from cooling foods like leafy greens, cucumber, and melons to balance internal heat. Should limit overly spicy, fried foods, and stimulants that can aggravate the system.',
    movement: 'Thrives with high-intensity interval training, competitive sports, outdoor activities in natural sunlight, and exercises that release excess energy.',
    mindfulness: 'Needs grounding practices like breath focus, body scanning, and meditative movement to balance their energetic nature.'
  },
  Earth: {
    personality: 'Grounded, reliable, and practical energy that provides stability and material focus',
    strengths: 'Strong physical constitution, excellent endurance, stable energy levels, good digestion, and natural body awareness',
    challenges: 'Tendency toward stagnation, resistance to change, sluggish metabolism, joint stiffness, and overindulgence',
    nutrition: 'Benefits from fresh, whole foods with plenty of fiber. Emphasize seasonal, locally grown produce, quality proteins, and complex carbohydrates while minimizing processed foods.',
    movement: 'Thrives with consistent routines including strength training, hiking in nature, gardening, and slow, deliberate movement practices like tai chi or yoga.',
    mindfulness: 'Responds well to sensory-based practices like walking meditation, earthing, and mindful eating to enhance natural connection to the physical world.'
  },
  Air: {
    personality: 'Intellectual, communicative, and social energy that values ideas and connections',
    strengths: 'Quick thinking, adaptability, strong respiratory system, good circulation, and natural flexibility',
    challenges: 'Tendency toward nervous tension, scattered energy, irregular habits, anxiety, and overthinking health decisions',
    nutrition: 'Benefits from regular, lighter meals throughout the day rather than heavy ones. Focus on omega-rich foods, colorful fruits and vegetables, and hydration to support neural function.',
    movement: 'Thrives with varied routines that engage the mind and body simultaneously: dance, coordination-based activities, social fitness classes, and activities that improve agility.',
    mindfulness: 'Needs focused breathing practices, thought observation techniques, and structured meditation to calm the active mind.'
  },
  Water: {
    personality: 'Emotional, intuitive, and receptive energy that flows with feeling and imagination',
    strengths: 'Strong intuitive health awareness, emotional resilience, adaptable immune system, good water retention, and empathetic healing abilities',
    challenges: 'Tendency toward emotional eating, retention issues, fluctuating energy levels, absorption of environmental toxins, and boundary challenges',
    nutrition: 'Benefits from proper hydration, purified water, and natural detoxifying foods. Focus on clean sources of omega-3s, sea vegetables, and foods that support lymphatic cleansing.',
    movement: 'Thrives with fluid movement practices like swimming, water aerobics, flowing yoga sequences, dancing, and rhythmic activities that honor emotional expression.',
    mindfulness: 'Responds to visualization, dream work, emotional release techniques, and water-based meditations that help process feelings.'
  }
};

// Mapping zodiac signs to elements
export const zodiacElements: Record<ZodiacSign, string> = {
  aries: 'Fire',
  leo: 'Fire',
  sagittarius: 'Fire',
  taurus: 'Earth',
  virgo: 'Earth',
  capricorn: 'Earth',
  gemini: 'Air',
  libra: 'Air',
  aquarius: 'Air',
  cancer: 'Water',
  scorpio: 'Water',
  pisces: 'Water'
};