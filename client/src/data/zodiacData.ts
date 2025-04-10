import { ZodiacSign } from '@shared/types';

export const zodiacSignNames = [
  {
    value: 'aries' as ZodiacSign,
    label: 'Aries',
    symbol: '♈',
    dates: 'Mar 21 - Apr 19',
    element: 'Fire',
    healthTraits: [
      'High energy levels',
      'Quick metabolism',
      'Tendency for headaches',
      'Prone to inflammation'
    ],
    wellnessRecommendations: [
      'Balance intense activities with rest periods',
      'Anti-inflammatory diet',
      'Stress-management techniques',
      'Head and eye protection during sports'
    ],
    compatibility: ['leo', 'sagittarius', 'libra', 'aquarius'],
    wellnessFocus: 'Stress management and anti-inflammatory nutrition'
  },
  {
    value: 'taurus' as ZodiacSign,
    label: 'Taurus',
    symbol: '♉',
    dates: 'Apr 20 - May 20',
    element: 'Earth',
    healthTraits: [
      'Strong constitution',
      'Good endurance',
      'Throat sensitivity',
      'May overindulge in comfort foods'
    ],
    wellnessRecommendations: [
      'Regular, consistent exercise routines',
      'Mindful eating practices',
      'Voice care and neck stretches',
      'Connection with nature'
    ],
    compatibility: ['virgo', 'capricorn', 'cancer', 'pisces'],
    wellnessFocus: 'Stable routines and grounding practices'
  },
  {
    value: 'gemini' as ZodiacSign,
    label: 'Gemini',
    symbol: '♊',
    dates: 'May 21 - Jun 20',
    element: 'Air',
    healthTraits: [
      'Quick nervous system',
      'Respiratory sensitivity',
      'Adaptable metabolism',
      'May experience scattered energy'
    ],
    wellnessRecommendations: [
      'Varied workout routines',
      'Breathing exercises and lung support',
      'Nervous system support',
      'Meditation for mental focus'
    ],
    compatibility: ['libra', 'aquarius', 'aries', 'leo'],
    wellnessFocus: 'Respiratory health and nervous system balance'
  },
  {
    value: 'cancer' as ZodiacSign,
    label: 'Cancer',
    symbol: '♋',
    dates: 'Jun 21 - Jul 22',
    element: 'Water',
    healthTraits: [
      'Strong digestive intuition',
      'Emotional sensitivity affecting health',
      'Fluid retention tendencies',
      'Nurturing self-care abilities'
    ],
    wellnessRecommendations: [
      'Digestive support herbs and foods',
      'Emotional processing practices',
      'Water-based activities',
      'Creating nurturing environments'
    ],
    compatibility: ['scorpio', 'pisces', 'taurus', 'virgo'],
    wellnessFocus: 'Emotional wellness and digestive health'
  },
  {
    value: 'leo' as ZodiacSign,
    label: 'Leo',
    symbol: '♌',
    dates: 'Jul 23 - Aug 22',
    element: 'Fire',
    healthTraits: [
      'Strong vitality and immunity',
      'Heart and circulation strength',
      'Potential for back tension',
      'May ignore minor health signals'
    ],
    wellnessRecommendations: [
      'Heart-supporting nutrition',
      'Back-strengthening exercises',
      'Regular health check-ups',
      'Performance-based exercise for motivation'
    ],
    compatibility: ['aries', 'sagittarius', 'gemini', 'libra'],
    wellnessFocus: 'Cardiovascular health and spine support'
  },
  {
    value: 'virgo' as ZodiacSign,
    label: 'Virgo',
    symbol: '♍',
    dates: 'Aug 23 - Sep 22',
    element: 'Earth',
    healthTraits: [
      'Digestive sensitivity',
      'Attention to health details',
      'Tendency to worry affecting health',
      'Natural healing abilities'
    ],
    wellnessRecommendations: [
      'Gut health optimization',
      'Mindfulness for worry reduction',
      'Detailed but flexible health routines',
      'Plant-based nutrition knowledge'
    ],
    compatibility: ['taurus', 'capricorn', 'cancer', 'scorpio'],
    wellnessFocus: 'Digestive health and worry management'
  },
  {
    value: 'libra' as ZodiacSign,
    label: 'Libra',
    symbol: '♎',
    dates: 'Sep 23 - Oct 22',
    element: 'Air',
    healthTraits: [
      'Kidney and adrenal sensitivity',
      'Need for balance in all health aspects',
      'Skin health reflective of internal state',
      'Benefits from beauty in health routines'
    ],
    wellnessRecommendations: [
      'Kidney-supporting hydration',
      'Balanced approach to diet and exercise',
      'Skin-nourishing practices',
      'Aesthetically pleasing workout environments'
    ],
    compatibility: ['gemini', 'aquarius', 'leo', 'sagittarius'],
    wellnessFocus: 'Balanced wellness and kidney health'
  },
  {
    value: 'scorpio' as ZodiacSign,
    label: 'Scorpio',
    symbol: '♏',
    dates: 'Oct 23 - Nov 21',
    element: 'Water',
    healthTraits: [
      'Strong regenerative abilities',
      'Reproductive system sensitivity',
      'Deep emotional patterns affecting health',
      'Endurance and persistence in health challenges'
    ],
    wellnessRecommendations: [
      'Detoxification practices',
      'Reproductive health support',
      'Trauma-informed health approaches',
      'Transformative exercise routines'
    ],
    compatibility: ['cancer', 'pisces', 'virgo', 'capricorn'],
    wellnessFocus: 'Detoxification and reproductive health'
  },
  {
    value: 'sagittarius' as ZodiacSign,
    label: 'Sagittarius',
    symbol: '♐',
    dates: 'Nov 22 - Dec 21',
    element: 'Fire',
    healthTraits: [
      'Naturally athletic constitution',
      'Hip, thigh, and liver sensitivity',
      'Benefits from movement and adventure',
      'May overdo physical activities'
    ],
    wellnessRecommendations: [
      'Liver-supporting nutrition',
      'Hip mobility and flexibility work',
      'Adventure-based fitness',
      'Moderation in physical exertion'
    ],
    compatibility: ['aries', 'leo', 'libra', 'aquarius'],
    wellnessFocus: 'Liver health and hip mobility'
  },
  {
    value: 'capricorn' as ZodiacSign,
    label: 'Capricorn',
    symbol: '♑',
    dates: 'Dec 22 - Jan 19',
    element: 'Earth',
    healthTraits: [
      'Strong skeletal structure',
      'Joint sensitivity, especially knees',
      'Skin and aging concerns',
      'Resilience through health challenges'
    ],
    wellnessRecommendations: [
      'Bone-supporting nutrition',
      'Joint-protective exercise',
      'Skin health practices',
      'Structured fitness routines'
    ],
    compatibility: ['taurus', 'virgo', 'scorpio', 'pisces'],
    wellnessFocus: 'Bone health and structural support'
  },
  {
    value: 'aquarius' as ZodiacSign,
    label: 'Aquarius',
    symbol: '♒',
    dates: 'Jan 20 - Feb 18',
    element: 'Air',
    healthTraits: [
      'Circulation and nervous system sensitivity',
      'Ankle and calf vulnerability',
      'Benefits from innovative health approaches',
      'Electromagnetic sensitivity'
    ],
    wellnessRecommendations: [
      'Circulation-supporting activities',
      'Ankle strengthening exercises',
      'Digital detox practices',
      'Novel health technologies and approaches'
    ],
    compatibility: ['gemini', 'libra', 'aries', 'sagittarius'],
    wellnessFocus: 'Circulation and nervous system health'
  },
  {
    value: 'pisces' as ZodiacSign,
    label: 'Pisces',
    symbol: '♓',
    dates: 'Feb 19 - Mar 20',
    element: 'Water',
    healthTraits: [
      'Immune system fluctuations',
      'Feet and lymphatic sensitivity',
      'Strong mind-body connection',
      'Absorbs environmental influences easily'
    ],
    wellnessRecommendations: [
      'Immune-supporting practices',
      'Foot care and reflexology',
      'Water-based healing therapies',
      'Energetic boundaries and protection'
    ],
    compatibility: ['cancer', 'scorpio', 'taurus', 'capricorn'],
    wellnessFocus: 'Immune support and lymphatic health'
  }
];

// Map zodiac signs to their elements
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

// Color schemes for zodiac elements (for UI styling)
export const zodiacElementColors = {
  'Fire': 'text-red-600 bg-red-100',
  'Earth': 'text-green-600 bg-green-100',
  'Air': 'text-purple-600 bg-purple-100',
  'Water': 'text-blue-600 bg-blue-100',
  'All': 'text-primary bg-primary/10'
};

// Element characteristics for health insights
export const elementCharacteristics = {
  'Fire': {
    personality: 'Dynamic, passionate, and energetic',
    strengths: 'Natural vitality, quick recovery, enthusiasm for physical activity',
    challenges: 'Inflammation, burnout, impatience with healing processes',
    nutrition: 'Cooling foods, anti-inflammatory herbs, steady protein intake',
    movement: 'High-intensity interval training balanced with recovery periods',
    mindfulness: 'Grounding practices to balance excessive fire energy'
  },
  'Earth': {
    personality: 'Practical, reliable, and grounded',
    strengths: 'Strong constitution, endurance, consistent health habits',
    challenges: 'Stagnation, resistance to change, joint stiffness',
    nutrition: 'Root vegetables, mineral-rich foods, structured meal routines',
    movement: 'Strength training, hiking in nature, consistent exercise schedules',
    mindfulness: 'Nature connection and embodiment practices'
  },
  'Air': {
    personality: 'Intellectual, communicative, and adaptable',
    strengths: 'Mental agility, adaptability to health regimens, breath awareness',
    challenges: 'Nervous system tension, overthinking health issues, inconsistency',
    nutrition: 'Light, varied meals, brain-supporting nutrients, regular snacking',
    movement: 'Varied workout routines, breathwork, coordination exercises',
    mindfulness: 'Meditation for mental focus and breath awareness'
  },
  'Water': {
    personality: 'Intuitive, emotional, and receptive',
    strengths: 'Healing intuition, emotional awareness, adaptability',
    challenges: 'Emotional health impacts, fluid retention, boundary issues',
    nutrition: 'Hydrating foods, digestive support, emotional eating awareness',
    movement: 'Swimming, fluid movements, gentle flows like tai chi',
    mindfulness: 'Emotional processing and energy clearing practices'
  }
};