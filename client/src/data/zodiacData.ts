export const zodiacSignNames = [
  { value: 'aries', label: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire' },
  { value: 'taurus', label: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth' },
  { value: 'gemini', label: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air' },
  { value: 'cancer', label: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water' },
  { value: 'leo', label: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire' },
  { value: 'virgo', label: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth' },
  { value: 'libra', label: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air' },
  { value: 'scorpio', label: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water' },
  { value: 'sagittarius', label: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire' },
  { value: 'capricorn', label: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth' },
  { value: 'aquarius', label: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air' },
  { value: 'pisces', label: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water' },
];

export const zodiacElementColors = {
  Fire: 'text-red-500',
  Earth: 'text-green-600',
  Air: 'text-purple-500',
  Water: 'text-blue-500',
};

export const zodiacDescriptions = {
  aries: {
    title: 'Dynamic & Energetic',
    description: 'As the first sign of the zodiac, Aries individuals are enthusiastic pioneers, known for their courage, determination, and leadership qualities. Their energetic constitution requires regular physical activity to maintain balance.',
    healthStrengths: ['Quick recovery', 'High energy levels', 'Strong vitality', 'Natural athleticism'],
    healthChallenges: ['Headaches', 'Inflammation', 'Impulsive health decisions', 'Stress-related issues'],
    wellnessRecommendations: [
      'High-intensity interval training',
      'Anti-inflammatory foods',
      'Stress management techniques',
      'Mindfulness practices to balance impulsivity'
    ],
    bodyAssociations: ['Head', 'Face', 'Brain', 'Adrenal glands'],
    idealFoods: ['Spinach', 'Peppers', 'Garlic', 'Onions', 'Walnuts'],
    idealActivities: ['Competitive sports', 'Martial arts', 'Sprint training', 'Mountain climbing']
  },
  taurus: {
    title: 'Grounded & Steadfast',
    description: 'Taurus individuals embody strength and stability, with a natural connection to the physical world. They value comfort and sensory experiences, making holistic wellness approaches particularly effective for their health.',
    healthStrengths: ['Strong constitution', 'Endurance', 'Consistency in routines', 'Resilience'],
    healthChallenges: ['Throat issues', 'Thyroid concerns', 'Stiff neck', 'Resistance to change'],
    wellnessRecommendations: [
      'Regular, consistent exercise routines',
      'Natural, high-quality nutrition',
      'Massage and touch therapies',
      'Connection with nature and grounding practices'
    ],
    bodyAssociations: ['Throat', 'Neck', 'Thyroid', 'Voice'],
    idealFoods: ['Root vegetables', 'Dark leafy greens', 'Pears', 'Avocados', 'Quality proteins'],
    idealActivities: ['Yoga', 'Walking in nature', 'Gardening', 'Strength training']
  },
  gemini: {
    title: 'Adaptable & Intellectual',
    description: 'The twins of the zodiac, Gemini individuals are intellectually curious and socially adaptable. Their busy minds and versatile nature require varied approaches to health that engage both mental and physical aspects.',
    healthStrengths: ['Adaptability', 'Quick thinking', 'Nervous system resilience', 'Social wellness'],
    healthChallenges: ['Respiratory sensitivity', 'Nervous tension', 'Scattered energy', 'Inconsistent habits'],
    wellnessRecommendations: [
      'Activities that combine mental and physical stimulation',
      'Breathing exercises and respiratory care',
      'Varied fitness routines to prevent boredom',
      'Mind-body practices for nervous system regulation'
    ],
    bodyAssociations: ['Lungs', 'Arms', 'Shoulders', 'Nervous system'],
    idealFoods: ['Brain-boosting foods', 'Berries', 'Nuts', 'Seeds', 'Oxygenating foods'],
    idealActivities: ['Group fitness classes', 'Dance', 'Tennis', 'Learning-based movement']
  },
  cancer: {
    title: 'Nurturing & Intuitive',
    description: 'Cancer individuals possess strong emotional intuition and a nurturing nature. Their health is closely connected to their emotional wellbeing, making emotional balance a cornerstone of their physical health.',
    healthStrengths: ['Intuitive eating', 'Self-care awareness', 'Emotional intelligence', 'Nurturing abilities'],
    healthChallenges: ['Digestive sensitivity', 'Emotional eating', 'Water retention', 'Mood fluctuations'],
    wellnessRecommendations: [
      'Digestive health support through probiotics and gut-friendly foods',
      'Emotional processing practices',
      'Water-based activities',
      'Creating nurturing environments for health practices'
    ],
    bodyAssociations: ['Stomach', 'Digestive system', 'Breasts', 'Lymphatic system'],
    idealFoods: ['Fermented foods', 'Sea vegetables', 'Soothing herbs', 'Moon-enriched water'],
    idealActivities: ['Swimming', 'Water aerobics', 'Gentle yoga', 'Walking near water']
  },
  leo: {
    title: 'Charismatic & Vital',
    description: 'Leo individuals radiate confidence and natural vitality. Their strong life force and warm-hearted nature contribute to robust health, particularly when they engage in expressions of joy and creativity.',
    healthStrengths: ['Strong heart', 'Vitality', 'Recovery capability', 'Immune resilience'],
    healthChallenges: ['Heart health concerns', 'Back issues', 'Circulation', 'Heat sensitivity'],
    wellnessRecommendations: [
      'Heart-healthy nutrition and cardiovascular exercise',
      'Spine-supporting movement',
      'Creative expression as therapy',
      'Balancing sun exposure for vitamin D without overheating'
    ],
    bodyAssociations: ['Heart', 'Spine', 'Upper back', 'Circulatory system'],
    idealFoods: ['Heart-healthy omega-3s', 'Magnesium-rich foods', 'Antioxidants', 'Berries'],
    idealActivities: ['Dance', 'Theater-based movement', 'Heart-pumping cardio', 'Yoga for back strength']
  },
  virgo: {
    title: 'Analytical & Precise',
    description: 'Virgo individuals bring analytical precision to health and wellness, with a natural affinity for nutrition, purification, and detailed health protocols. Their methodical approach helps them maintain wellbeing through attention to detail.',
    healthStrengths: ['Detailed health awareness', 'Digestive intelligence', 'Analytical approach to wellness', 'Precision in health practices'],
    healthChallenges: ['Digestive sensitivity', 'Perfectionism causing stress', 'Worry affecting health', 'Absorption issues'],
    wellnessRecommendations: [
      'Digestive enzymes and gut-supporting foods',
      'Mindfulness to reduce analytical overthinking',
      'Methodical but flexible fitness routines',
      'Detoxification practices'
    ],
    bodyAssociations: ['Intestines', 'Digestive system', 'Spleen', 'Nervous system'],
    idealFoods: ['Fermented foods', 'Fiber-rich vegetables', 'Clean proteins', 'Digestive herbs'],
    idealActivities: ['Pilates', 'Precise movement practices', 'Hiking', 'Functional fitness']
  },
  libra: {
    title: 'Harmonious & Balanced',
    description: 'Libra individuals seek balance in all aspects of life, including health. Their sense of harmony and appreciation for beauty influences their wellness approaches, which often combine aesthetics with functionality.',
    healthStrengths: ['Balance awareness', 'Kidney function', 'Social wellness', 'Aesthetic motivation'],
    healthChallenges: ['Kidney and lower back issues', 'Indecision about health routines', 'Hormonal balance', 'Skin concerns'],
    wellnessRecommendations: [
      'Balanced fitness routines combining strength and flexibility',
      'Kidney-supporting hydration',
      'Partner or social fitness activities',
      'Beautiful environments for wellness practices'
    ],
    bodyAssociations: ['Kidneys', 'Lower back', 'Skin', 'Endocrine system'],
    idealFoods: ['Alkalizing foods', 'Beauty-enhancing nutrients', 'Kidney-supporting herbs', 'Balanced meals'],
    idealActivities: ['Partner yoga', 'Dance', 'Social sports', 'Aesthetically pleasing movement practices']
  },
  scorpio: {
    title: 'Intense & Transformative',
    description: 'Scorpio individuals possess tremendous regenerative capabilities and transformative potential. Their deep connection to life\'s mysteries gives them unique insight into healing processes and extreme health transformations.',
    healthStrengths: ['Regenerative capacity', 'Transformation ability', 'Endurance', 'Willpower'],
    healthChallenges: ['Reproductive health', 'Elimination systems', 'Hormone fluctuations', 'Intensity leading to burnout'],
    wellnessRecommendations: [
      'Detoxification practices',
      'Reproductive system support',
      'Transformative fitness challenges',
      'Deep healing modalities'
    ],
    bodyAssociations: ['Reproductive organs', 'Excretory system', 'Pelvis', 'Colon'],
    idealFoods: ['Deeply colored foods', 'Purifying herbs', 'Fermented foods', 'Regenerative superfoods'],
    idealActivities: ['Intense interval training', 'Regenerative yoga', 'Water therapy', 'Martial arts']
  },
  sagittarius: {
    title: 'Adventurous & Philosophical',
    description: 'Sagittarius individuals bring enthusiasm and a love of freedom to their health practices. Their expansive nature thrives with varied experiences, outdoor activities, and wellness approaches that integrate philosophy with physicality.',
    healthStrengths: ['Natural optimism', 'Liver resilience', 'Hip flexibility', 'Adventure motivation'],
    healthChallenges: ['Hip and thigh issues', 'Liver concerns', 'Risk of overexertion', 'Inconsistency'],
    wellnessRecommendations: [
      'Outdoor fitness activities',
      'Liver-supporting nutrition',
      'Hip-opening stretches and mobility work',
      'Adventure-based movement challenges'
    ],
    bodyAssociations: ['Hips', 'Thighs', 'Liver', 'Sciatic nerve'],
    idealFoods: ['Liver-cleansing herbs', 'International cuisine variety', 'Phytonutrient diversity', 'Adaptogenic herbs'],
    idealActivities: ['Hiking', 'Long-distance running', 'Archery', 'Outdoor sports']
  },
  capricorn: {
    title: 'Disciplined & Enduring',
    description: 'Capricorn individuals bring discipline and long-term vision to health practices. Their natural endurance and respect for tradition make them excellent candidates for established wellness protocols with proven results.',
    healthStrengths: ['Skeletal strength', 'Discipline', 'Longevity focus', 'Structural integrity'],
    healthChallenges: ['Joint issues', 'Bone density', 'Skin concerns', 'Work-related stress'],
    wellnessRecommendations: [
      'Bone-strengthening nutrition and exercise',
      'Structural alignment practices',
      'Long-term wellness planning',
      'Time-tested traditional health approaches'
    ],
    bodyAssociations: ['Bones', 'Joints', 'Knees', 'Skin'],
    idealFoods: ['Calcium-rich foods', 'Mineral-dense vegetables', 'Bone broths', 'Traditional superfoods'],
    idealActivities: ['Weight-bearing exercise', 'Climbing', 'Traditional training methods', 'Structural yoga']
  },
  aquarius: {
    title: 'Innovative & Independent',
    description: 'Aquarius individuals bring innovation and uniqueness to health approaches. Their forward-thinking nature makes them early adopters of cutting-edge wellness technologies and unconventional healing modalities.',
    healthStrengths: ['Circulation', 'Electrical energy balance', 'Community health awareness', 'Innovative healing'],
    healthChallenges: ['Ankle weakness', 'Circulatory issues', 'Electrical imbalances', 'Detachment from body signals'],
    wellnessRecommendations: [
      'Circulation-enhancing activities',
      'Electrical balancing practices like grounding',
      'Community-based fitness',
      'Revolutionary health technologies'
    ],
    bodyAssociations: ['Ankles', 'Circulation', 'Bioelectrical systems', 'Lower legs'],
    idealFoods: ['Circulation-enhancing spices', 'Electrically charged foods', 'Novel superfoods', 'Community-grown produce'],
    idealActivities: ['Group fitness', 'Novel movement practices', 'Electro-muscle stimulation', 'Technology-enhanced training']
  },
  pisces: {
    title: 'Intuitive & Compassionate',
    description: 'Pisces individuals possess extraordinary sensitivity and intuitive healing abilities. Their connection to the collective unconscious gives them unique insight into subtle body processes and energy healing modalities.',
    healthStrengths: ['Immune intuition', 'Lymphatic awareness', 'Healing energy', 'Adaptability'],
    healthChallenges: ['Foot issues', 'Lymphatic stagnation', 'Immune fluctuations', 'Boundary maintenance'],
    wellnessRecommendations: [
      'Lymphatic support through movement and dry brushing',
      'Foot health practices',
      'Immune-enhancing nutrition',
      'Energy medicine and subtle body practices'
    ],
    bodyAssociations: ['Feet', 'Lymphatic system', 'Immune system', 'Pineal gland'],
    idealFoods: ['Immune-supporting herbs', 'Sea vegetables', 'Omega-rich foods', 'Hydrating fruits'],
    idealActivities: ['Swimming', 'Dance', 'Tai chi', 'Energy medicine movement']
  },
};

export const zodiacCompatibility = {
  aries: ['leo', 'sagittarius', 'gemini', 'aquarius'],
  taurus: ['virgo', 'capricorn', 'cancer', 'pisces'],
  gemini: ['libra', 'aquarius', 'aries', 'leo'],
  cancer: ['scorpio', 'pisces', 'taurus', 'virgo'],
  leo: ['aries', 'sagittarius', 'gemini', 'libra'],
  virgo: ['taurus', 'capricorn', 'cancer', 'scorpio'],
  libra: ['gemini', 'aquarius', 'leo', 'sagittarius'],
  scorpio: ['cancer', 'pisces', 'virgo', 'capricorn'],
  sagittarius: ['aries', 'leo', 'libra', 'aquarius'],
  capricorn: ['taurus', 'virgo', 'scorpio', 'pisces'],
  aquarius: ['gemini', 'libra', 'aries', 'sagittarius'],
  pisces: ['cancer', 'scorpio', 'taurus', 'capricorn'],
};