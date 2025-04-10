import { ZodiacSign } from "@shared/types";

export type WellnessRecommendation = {
  nutritionTips: string[];
  exerciseTypes: string[];
  relaxationMethods: string[];
  dailyWellnessHabits: string[];
};

export const zodiacSignNames = [
  { 
    value: 'aries' as ZodiacSign, 
    label: 'Aries', 
    dates: 'March 21 - April 19', 
    symbol: '♈', 
    element: 'Fire', 
    planet: 'Mars',
    modality: 'Cardinal',
    rulingPlanet: 'Mars',
    traits: 'Energetic, Courageous, Passionate, Impulsive',
    healthFocus: 'Head, face, and cerebral well-being'
  },
  { 
    value: 'taurus' as ZodiacSign, 
    label: 'Taurus', 
    dates: 'April 20 - May 20', 
    symbol: '♉', 
    element: 'Earth', 
    planet: 'Venus'
  },
  { 
    value: 'gemini' as ZodiacSign, 
    label: 'Gemini', 
    dates: 'May 21 - June 20', 
    symbol: '♊', 
    element: 'Air', 
    planet: 'Mercury'
  },
  { 
    value: 'cancer' as ZodiacSign, 
    label: 'Cancer', 
    dates: 'June 21 - July 22', 
    symbol: '♋', 
    element: 'Water', 
    planet: 'Moon'
  },
  { 
    value: 'leo' as ZodiacSign, 
    label: 'Leo', 
    dates: 'July 23 - August 22', 
    symbol: '♌', 
    element: 'Fire', 
    planet: 'Sun'
  },
  { 
    value: 'virgo' as ZodiacSign, 
    label: 'Virgo', 
    dates: 'August 23 - September 22', 
    symbol: '♍', 
    element: 'Earth', 
    planet: 'Mercury'
  },
  { 
    value: 'libra' as ZodiacSign, 
    label: 'Libra', 
    dates: 'September 23 - October 22', 
    symbol: '♎', 
    element: 'Air', 
    planet: 'Venus'
  },
  { 
    value: 'scorpio' as ZodiacSign, 
    label: 'Scorpio', 
    dates: 'October 23 - November 21', 
    symbol: '♏', 
    element: 'Water', 
    planet: 'Pluto'
  },
  { 
    value: 'sagittarius' as ZodiacSign, 
    label: 'Sagittarius', 
    dates: 'November 22 - December 21', 
    symbol: '♐', 
    element: 'Fire', 
    planet: 'Jupiter'
  },
  { 
    value: 'capricorn' as ZodiacSign, 
    label: 'Capricorn', 
    dates: 'December 22 - January 19', 
    symbol: '♑', 
    element: 'Earth', 
    planet: 'Saturn'
  },
  { 
    value: 'aquarius' as ZodiacSign, 
    label: 'Aquarius', 
    dates: 'January 20 - February 18', 
    symbol: '♒', 
    element: 'Air', 
    planet: 'Uranus'
  },
  { 
    value: 'pisces' as ZodiacSign, 
    label: 'Pisces', 
    dates: 'February 19 - March 20', 
    symbol: '♓', 
    element: 'Water', 
    planet: 'Neptune'
  }
];

// Personality traits for each zodiac sign
export const zodiacTraits = {
  aries: ['Energetic', 'Courageous', 'Passionate', 'Impulsive', 'Adventurous'],
  taurus: ['Reliable', 'Patient', 'Practical', 'Persistent', 'Sensual'],
  gemini: ['Adaptable', 'Curious', 'Versatile', 'Communicative', 'Witty'],
  cancer: ['Intuitive', 'Emotional', 'Nurturing', 'Protective', 'Sympathetic'],
  leo: ['Confident', 'Generous', 'Loyal', 'Dramatic', 'Creative'],
  virgo: ['Analytical', 'Practical', 'Diligent', 'Careful', 'Organized'],
  libra: ['Diplomatic', 'Fair', 'Social', 'Cooperative', 'Gracious'],
  scorpio: ['Determined', 'Passionate', 'Perceptive', 'Emotional', 'Intense'],
  sagittarius: ['Optimistic', 'Adventurous', 'Independent', 'Straightforward', 'Philosophical'],
  capricorn: ['Ambitious', 'Disciplined', 'Patient', 'Practical', 'Responsible'],
  aquarius: ['Progressive', 'Independent', 'Humanitarian', 'Innovative', 'Intellectual'],
  pisces: ['Compassionate', 'Intuitive', 'Imaginative', 'Sensitive', 'Artistic']
};

// Health tendencies for each zodiac sign
export const zodiacHealth = {
  aries: {
    strengths: ['High energy levels', 'Quick recovery', 'Athletic ability'],
    weaknesses: ['Headaches and migraines', 'Stress-related issues', 'Prone to accidents'],
    focus: 'Physical activity and stress management'
  },
  taurus: {
    strengths: ['Strong constitution', 'Endurance', 'Good metabolism'],
    weaknesses: ['Throat and neck issues', 'Weight management', 'Circulatory problems'],
    focus: 'Regular exercise and balanced diet'
  },
  gemini: {
    strengths: ['Nervous system adaptability', 'Respiratory capacity', 'Dexterity'],
    weaknesses: ['Respiratory issues', 'Nervous tension', 'Scattered energy'],
    focus: 'Deep breathing and mental focus'
  },
  cancer: {
    strengths: ['Strong digestive system', 'Emotional resilience', 'Nurturing self-care'],
    weaknesses: ['Digestive sensitivity', 'Emotional eating', 'Water retention'],
    focus: 'Emotional balance and gut health'
  },
  leo: {
    strengths: ['Strong heart and circulation', 'Vitality', 'Immune resilience'],
    weaknesses: ['Heart and back issues', 'Blood pressure concerns', 'Ego-related stress'],
    focus: 'Heart-healthy lifestyle and stress reduction'
  },
  virgo: {
    strengths: ['Digestive efficiency', 'Attention to health details', 'Intestinal health'],
    weaknesses: ['Digestive sensitivity', 'Nervous tension', 'Over-analysis'],
    focus: 'Gut health and mindfulness practices'
  },
  libra: {
    strengths: ['Kidney function', 'Balance and coordination', 'Aesthetic wellness'],
    weaknesses: ['Kidney and lower back issues', 'Indecision-related stress', 'Skin concerns'],
    focus: 'Balance in all activities and kidney health'
  },
  scorpio: {
    strengths: ['Reproductive health', 'Regenerative ability', 'Detoxification'],
    weaknesses: ['Reproductive issues', 'Elimination system', 'Emotional intensity'],
    focus: 'Detoxification and emotional processing'
  },
  sagittarius: {
    strengths: ['Liver function', 'Thigh and hip mobility', 'Metabolism'],
    weaknesses: ['Hip and thigh issues', 'Liver concerns', 'Risk-taking injuries'],
    focus: 'Liver health and flexibility'
  },
  capricorn: {
    strengths: ['Joint durability', 'Skeletal strength', 'Skin resilience'],
    weaknesses: ['Joint and bone issues', 'Skin dryness', 'Work-related stress'],
    focus: 'Bone health and work-life balance'
  },
  aquarius: {
    strengths: ['Circulatory system', 'Ankle flexibility', 'Electrical nervous system'],
    weaknesses: ['Circulatory issues', 'Ankle and calf problems', 'Nervous system sensitivity'],
    focus: 'Circulation and electrical balance'
  },
  pisces: {
    strengths: ['Lymphatic system', 'Foot flexibility', 'Immune intuition'],
    weaknesses: ['Foot problems', 'Immune deficiencies', 'Fluid retention'],
    focus: 'Lymphatic health and boundaries'
  }
};

// Compatibility between zodiac signs
export const zodiacCompatibility: Record<ZodiacSign, { high: ZodiacSign[], medium: ZodiacSign[], low: ZodiacSign[] }> = {
  aries: {
    high: ['leo', 'sagittarius', 'gemini', 'aquarius'],
    medium: ['libra', 'virgo', 'scorpio', 'pisces'],
    low: ['taurus', 'cancer', 'capricorn']
  },
  taurus: {
    high: ['virgo', 'capricorn', 'cancer', 'pisces'],
    medium: ['scorpio', 'libra', 'leo', 'aquarius'],
    low: ['aries', 'gemini', 'sagittarius']
  },
  gemini: {
    high: ['libra', 'aquarius', 'aries', 'leo'],
    medium: ['sagittarius', 'virgo', 'pisces', 'cancer'],
    low: ['taurus', 'scorpio', 'capricorn']
  },
  cancer: {
    high: ['scorpio', 'pisces', 'taurus', 'virgo'],
    medium: ['capricorn', 'libra', 'gemini', 'leo'],
    low: ['aries', 'sagittarius', 'aquarius']
  },
  leo: {
    high: ['aries', 'sagittarius', 'gemini', 'libra'],
    medium: ['aquarius', 'virgo', 'scorpio', 'pisces'],
    low: ['taurus', 'cancer', 'capricorn']
  },
  virgo: {
    high: ['taurus', 'capricorn', 'cancer', 'scorpio'],
    medium: ['pisces', 'leo', 'gemini', 'aries'],
    low: ['libra', 'sagittarius', 'aquarius']
  },
  libra: {
    high: ['gemini', 'aquarius', 'leo', 'sagittarius'],
    medium: ['aries', 'scorpio', 'virgo', 'taurus'],
    low: ['cancer', 'capricorn', 'pisces']
  },
  scorpio: {
    high: ['cancer', 'pisces', 'virgo', 'capricorn'],
    medium: ['taurus', 'libra', 'leo', 'aquarius'],
    low: ['aries', 'gemini', 'sagittarius']
  },
  sagittarius: {
    high: ['aries', 'leo', 'libra', 'aquarius'],
    medium: ['gemini', 'virgo', 'scorpio', 'pisces'],
    low: ['taurus', 'cancer', 'capricorn']
  },
  capricorn: {
    high: ['taurus', 'virgo', 'scorpio', 'pisces'],
    medium: ['cancer', 'libra', 'leo', 'aries'],
    low: ['gemini', 'sagittarius', 'aquarius']
  },
  aquarius: {
    high: ['gemini', 'libra', 'aries', 'sagittarius'],
    medium: ['leo', 'virgo', 'scorpio', 'pisces'],
    low: ['taurus', 'cancer', 'capricorn']
  },
  pisces: {
    high: ['cancer', 'scorpio', 'taurus', 'capricorn'],
    medium: ['virgo', 'libra', 'leo', 'aquarius'],
    low: ['aries', 'gemini', 'sagittarius']
  }
};

// Wellness recommendations for each zodiac sign
export const zodiacElementColors = {
  'Fire': 'bg-red-600 text-white',
  'Earth': 'bg-green-600 text-white',
  'Air': 'bg-blue-600 text-white',
  'Water': 'bg-indigo-600 text-white',
};

export const zodiacWellnessRecommendations: Record<ZodiacSign, WellnessRecommendation> = {
  aries: {
    nutritionTips: [
      'Incorporate cooling foods like cucumber and leafy greens to balance your fire element',
      'Iron-rich foods to support energy levels: spinach, lentils, and lean red meat',
      'Spicy foods in moderation as they can increase internal heat and aggression',
      'Stay hydrated with plenty of water to cool your naturally high metabolism',
      'Foods that support head health: walnuts, blueberries, and omega-3 fatty acids'
    ],
    exerciseTypes: [
      'High-intensity interval training (HIIT) to satisfy your need for intensity',
      'Competitive sports like tennis, basketball, or martial arts',
      'Sprint training and track workouts that challenge your speed',
      'Adventure activities like rock climbing or obstacle courses',
      'Boxing or kickboxing to channel aggressive energy'
    ],
    relaxationMethods: [
      'Meditation focused on breath awareness to cool internal heat',
      'Cold plunges or cool showers to regulate your fire element',
      'Yin yoga to balance your yang energy',
      'Forest bathing and nature walks to ground excess energy',
      'Progressive muscle relaxation to release physical tension'
    ],
    dailyWellnessHabits: [
      'Start your day with movement rather than immediate screen time',
      'Schedule short breaks throughout the day to prevent burnout',
      'Practice patience through deliberate slow-paced activities',
      'Use red light in the evening to support quality sleep',
      'Keep a physical activity journal to track progress and goals'
    ]
  },
  taurus: {
    nutritionTips: [
      'Root vegetables to support your earth element and grounding energy',
      'High-quality proteins like grass-fed beef and organic dairy',
      'Fiber-rich foods to support healthy digestion and metabolism',
      'Throat-soothing foods like honey, ginger tea, and warm broths',
      'Limited refined sugars to prevent sluggishness and weight gain'
    ],
    exerciseTypes: [
      'Strength training with an emphasis on slow, controlled movements',
      'Hiking and outdoor walking in natural settings',
      'Yoga focused on stability and alignment',
      'Pilates for core strength and body awareness',
      'Gardening as both exercise and earth connection'
    ],
    relaxationMethods: [
      'Massage therapy to address neck and shoulder tension',
      'Aromatherapy with earthy scents like patchouli and sandalwood',
      'Warm baths with Epsom salts for muscle relaxation',
      'Sound therapy with low-frequency tones',
      'Slow, mindful breathing practices'
    ],
    dailyWellnessHabits: [
      'Morning throat exercises and vocal toning',
      'Regular neck and shoulder stretches throughout the day',
      'Creating a consistent, predictable daily routine',
      'Taking time to appreciate beauty in your surroundings',
      'Setting healthy boundaries around work and rest'
    ]
  },
  gemini: {
    nutritionTips: [
      'Foods rich in omega-3 fatty acids for brain health and mental clarity',
      "Light, varied meals that don't weigh you down or create sluggishness",
      'Respiratory-supporting foods like garlic, onions, and ginger',
      'Antioxidant-rich berries to protect against oxidative stress',
      'Hydrating foods to support your air element: cucumbers, watermelon, celery'
    ],
    exerciseTypes: [
      'Dance classes that incorporate variety and social interaction',
      'Circuit training that keeps you moving between different exercises',
      'Group fitness classes with changing routines and music',
      'Racquet sports like tennis or badminton',
      'Cycling or spin classes for lung capacity and endurance'
    ],
    relaxationMethods: [
      'Guided visualization that engages your imagination',
      'Breathing exercises focused on lung expansion',
      'Mind puzzles and creative activities that engage without overstimulating',
      'Alternating nostril breathing for nervous system balance',
      'Writing therapy to organize thoughts and reduce mental chatter'
    ],
    dailyWellnessHabits: [
      'Digital detoxes to prevent information overload',
      'Lung-strengthening breathing exercises each morning',
      'Time blocking for focused work without multitasking',
      'Vocal rest periods if you speak or talk frequently',
      'Hand and finger stretches to prevent repetitive strain'
    ]
  },
  cancer: {
    nutritionTips: [
      'Foods rich in calcium for emotional stability: dairy, almonds, fortified plant milks',
      'Easily digestible foods that nurture your sensitive digestive system',
      'Cooling foods like cucumber and melon to balance emotional intensity',
      'Foods that support the stomach: ginger, peppermint, bone broth',
      'Mood-supporting foods rich in vitamin D and B vitamins'
    ],
    exerciseTypes: [
      'Water-based activities: swimming, aqua aerobics, or paddleboarding',
      'Moon-cycle aligned workouts that vary with lunar phases',
      'Gentle, flowing movement like Tai Chi or Qigong',
      'Beach walks or exercises near water sources',
      'Restorative yoga with an emphasis on the heart and chest'
    ],
    relaxationMethods: [
      'Warm compresses on the chest and abdomen',
      'Journaling for emotional processing and release',
      'Moonlight meditation or bathing',
      'Nurturing self-massage with calming oils',
      'Creating cozy, secure environments for deep rest'
    ],
    dailyWellnessHabits: [
      'Emotional check-ins throughout the day',
      'Creating and maintaining nurturing home environments',
      'Conscious breathing into the chest and diaphragm',
      'Setting healthy emotional boundaries in relationships',
      'Hydration with warm, soothing liquids rather than cold beverages'
    ]
  },
  leo: {
    nutritionTips: [
      'Heart-healthy foods rich in CoQ10: fatty fish, whole grains, and organ meats',
      'Foods high in potassium for cardiac health: bananas, avocados, and potatoes',
      'Sunshine-inspired yellow and orange foods: turmeric, saffron, citrus',
      'Magnesium-rich foods for heart and muscle function: dark chocolate, nuts, seeds',
      'Anti-inflammatory herbs and spices: turmeric, ginger, and cayenne in moderation'
    ],
    exerciseTypes: [
      'Activities that put you center stage: dance, group fitness instruction',
      'Strength training with an emphasis on the upper body and back',
      'Performance-based activities like martial arts demonstrations or gymnastics',
      'Outdoor training in sunshine (with proper sun protection)',
      'Activities that build confidence and presence: powerlifting, strongman training'
    ],
    relaxationMethods: [
      'Heart-opening yoga poses and stretches',
      'Sun salutations and solar meditation',
      'Warm compresses on the chest and upper back',
      'Creative visualization focused on personal growth',
      'Expressive arts therapy: drawing, singing, acting'
    ],
    dailyWellnessHabits: [
      'Morning sun exposure (15 minutes with appropriate protection)',
      'Heart-rate variability training for stress resilience',
      'Back and spine stretches throughout the day',
      'Practicing genuine compliments and appreciation to others',
      'Evening gratitude practice to cultivate generosity'
    ]
  },
  virgo: {
    nutritionTips: [
      'Digestive-supporting fermented foods: kefir, kimchi, and sauerkraut',
      'High-fiber foods for intestinal health: whole grains, legumes, vegetables',
      'Clean, minimally processed foods with limited artificial ingredients',
      'Digestive herbs like peppermint, fennel, and chamomile',
      'Small, regular meals to prevent digestive stress'
    ],
    exerciseTypes: [
      'Precise, form-focused training like Pilates or barre',
      'Detailed practices like yoga with alignment emphasis',
      'Functional fitness focusing on practical movement patterns',
      'Walking meditation combining mental clarity with physical activity',
      'Structured exercise routines with clear progressions and goals'
    ],
    relaxationMethods: [
      'Guided meditation focusing on body scanning and release',
      'Organizational activities that create order and calm',
      'Hands-on crafts requiring focus and precision',
      'Systematic progressive muscle relaxation',
      'Aromatherapy with clarifying scents like peppermint and rosemary'
    ],
    dailyWellnessHabits: [
      'Regular digestive massage following the large intestine pathway',
      'Mindful eating practices without digital distractions',
      'Creating spaces of order and cleanliness',
      'Scheduled worry time to contain anxious thoughts',
      'Self-compassion practices to balance perfectionism'
    ]
  },
  libra: {
    nutritionTips: [
      'Kidney-supporting foods: watermelon, cranberries, and celery',
      'Foods rich in vitamin E for skin health: avocados, nuts, and seeds',
      'Anti-inflammatory foods to support the lower back and kidneys',
      'Balanced meals with equal proportions of protein, healthy fats, and complex carbs',
      'Aesthetically appealing, colorful meals that please the visual sense'
    ],
    exerciseTypes: [
      'Partner activities like tennis, dance, or acro-yoga',
      'Balanced workout routines that address all muscle groups equally',
      'Activities focusing on coordination and balance: slacklining, ballet',
      'Social fitness classes that combine exercise with community',
      'Activities with aesthetic components: dance, synchronized swimming'
    ],
    relaxationMethods: [
      'Symmetrical yoga poses that create physical balance',
      'Artistic activities that induce flow state: painting, music',
      'Beautiful environments that support aesthetic appreciation',
      'Kidney-supporting warm compresses on the lower back',
      'Partner massage or touch therapy'
    ],
    dailyWellnessHabits: [
      'Lower back stretches throughout the day',
      'Decision-making exercises to strengthen choice confidence',
      'Creating beauty in everyday environments',
      'Balancing solitude and social time consciously',
      'Maintaining equilibrium between work and pleasure'
    ]
  },
  scorpio: {
    nutritionTips: [
      'Detoxifying foods that support the elimination system: leafy greens, beets, cilantro',
      'Healthy fats that support reproductive health: avocados, olive oil, nuts',
      'Antioxidant-rich foods for cellular regeneration: berries, dark chocolate, green tea',
      'Foods supporting transformation: fermented products, sprouts, and germinated seeds',
      'Hydrating foods that support elimination: cucumber, watermelon, coconut water'
    ],
    exerciseTypes: [
      'Transformative practices like power yoga or intensive training',
      'Deep tissue work like foam rolling and myofascial release',
      'Physically demanding activities that create catharsis: boxing, HIIT',
      'Rebounding and mini-trampoline work for lymphatic health',
      'Water-based exercise for emotional processing: swimming, water aerobics'
    ],
    relaxationMethods: [
      'Deep emotional release practices like primal screaming or breathwork',
      'Sensory deprivation through floating tanks or darkness meditation',
      'Transformational breathwork for emotional processing',
      'Hot and cold contrast therapy for circulation',
      'Shadow work journaling and emotional investigation'
    ],
    dailyWellnessHabits: [
      'Conscious elimination practices: proper hydration, fiber intake',
      'Pelvic floor exercises for reproductive and elimination health',
      'Creating sacred, private spaces for processing intense emotions',
      'Energy clearing rituals for home and personal space',
      'Releasing grudges and practicing forgiveness work'
    ]
  },
  sagittarius: {
    nutritionTips: [
      'Liver-supporting herbs and foods: dandelion, milk thistle, leafy greens',
      'Anti-inflammatory turmeric and ginger to support joints and mobility',
      'Healthy fats for joint lubrication: avocados, olive oil, nuts',
      'Adventure-inspiring global cuisine with varied spices and ingredients',
      'Metabolism-supporting foods: chili peppers, green tea, lean proteins'
    ],
    exerciseTypes: [
      'Long-distance activities: trail running, hiking, cycling',
      'Adventure sports that incorporate exploration: orienteering, rock climbing',
      'Global movement practices: capoeira, bhangra dance, tai chi',
      'Hip-opening yoga sequences for mobility',
      'Activities with philosophical components: martial arts with meditative elements'
    ],
    relaxationMethods: [
      'Travel and exploration, even if just to new local environments',
      'Philosophical reading and discussion groups',
      'Distance gazing and horizon meditation',
      'Nature immersion in wide, open spaces',
      'Visualization journeys to different times and places'
    ],
    dailyWellnessHabits: [
      'Hip and thigh stretches throughout the day',
      'Liver-supporting morning routines: lemon water, gentle stretching',
      'Creating physical and mental space for freedom and movement',
      'Learning something new each day to satisfy intellectual curiosity',
      'Planning adventure time, even if small daily micro-adventures'
    ]
  },
  capricorn: {
    nutritionTips: [
      'Bone-supporting foods rich in calcium, vitamin D, and vitamin K',
      'Collagen-building foods for skin, joints, and connective tissue',
      'Structured meal timing that supports consistent energy levels',
      'Grounding root vegetables that connect to your earth element',
      'Limited alcohol and caffeine which can deplete mineral reserves'
    ],
    exerciseTypes: [
      'Progressive resistance training with measurable goals',
      'Weight-bearing exercise for bone density: walking, stair climbing',
      'Structured programs with clear advancement paths',
      'Low-impact activities that protect joints: elliptical, swimming',
      'Mountain activities: hiking, climbing, skiing (mindful of joints)'
    ],
    relaxationMethods: [
      'Structured relaxation with clear beginning and end times',
      'Deep tissue massage focusing on chronically tight areas',
      'Achievement-free time where productivity is not measured',
      'Stone and crystal therapies connecting to earth element',
      'Time in nature, especially mountains and rocky landscapes'
    ],
    dailyWellnessHabits: [
      'Joint-supporting movement breaks during long work periods',
      'Skin care routines with emphasis on moisture and protection',
      'Teeth and bone health practices: proper brushing, flossing',
      'Creating clear boundaries between work and rest',
      'Practicing the art of appropriate delegation and rest'
    ]
  },
  aquarius: {
    nutritionTips: [
      'Circulation-supporting foods rich in nitric oxide: beets, dark chocolate, leafy greens',
      'Foods that support electrical system: bananas, coconut water (electrolytes)',
      'Anti-inflammatory foods for ankle and circulatory health',
      'Novel, unusual food combinations that satisfy intellectual curiosity',
      'Hydrating foods that support overall circulation: cucumber, watermelon, citrus'
    ],
    exerciseTypes: [
      'Innovative, unique fitness modalities and classes',
      'Technology-enhanced workouts: VR fitness, app-guided training',
      'Group activities that maintain individual expression',
      'Ankle-strengthening exercises: balance training, calf raises',
      'Circulation-boosting activities: rebounding, inversion, cycling'
    ],
    relaxationMethods: [
      'Flotation tanks and sensory deprivation for mental spaciousness',
      'Science-based relaxation: biofeedback, neurofeedback',
      "Visualization of energy flow through the body's electrical system",
      'Intellectual stimulation through documentaries or educational content',
      'Community-based relaxation: group meditation, sound baths'
    ],
    dailyWellnessHabits: [
      'Ankle and lower leg stretches and strengthening',
      'Circulation-supporting practices: elevation, movement breaks',
      'Creating environments of innovation and mental stimulation',
      'Balancing digital connectivity with unplugged time',
      'Contributing to community wellbeing alongside personal health'
    ]
  },
  pisces: {
    nutritionTips: [
      'Omega-3 rich foods for brain health: fatty fish, walnuts, flax seeds',
      'Foods that support lymphatic flow: leafy greens, berries, citrus',
      'Grounding foods to balance dreaminess: root vegetables, proteins',
      'Hydrating foods that reflect your water element: cucumber, melon',
      'Limited alcohol and recreational substances which can enhance escape tendencies'
    ],
    exerciseTypes: [
      'Water-based activities: swimming, aqua aerobics, surfing',
      'Flowing movement practices: dance, tai chi, fluid yoga',
      'Activities that incorporate music and rhythm',
      'Foot-strengthening exercises: barefoot training, toe articulation',
      'Lymphatic-supporting movements: rebounding, inversion, gentle bouncing'
    ],
    relaxationMethods: [
      'Water immersion: baths, floating, hydrotherapy',
      'Dreamwork and sleep hygiene practices',
      'Artistic expression without judgment or goals',
      'Sound healing and music therapy',
      'Gentle boundaries to create safe emotional space'
    ],
    dailyWellnessHabits: [
      'Foot massage and reflexology for grounding',
      'Lymphatic dry brushing to support detoxification',
      'Creating clear energetic boundaries in relationships',
      'Scheduled reality checks during working hours',
      'Balancing imagination time with practical action'
    ]
  }
};