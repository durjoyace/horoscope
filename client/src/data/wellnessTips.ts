// We define our own ZodiacSign type to avoid import issues

export type ZodiacSign = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export interface WellnessTip {
  id: number;
  title: string;
  content: string;
  category: "nutrition" | "exercise" | "mindfulness" | "sleep" | "hydration";
  element?: "fire" | "earth" | "air" | "water";
  zodiacSigns?: ZodiacSign[];
  emoji: string;
}

const universalTips: WellnessTip[] = [
  {
    id: 1,
    title: "Daily Hydration",
    content: "Water carries vital nutrients to your cells and helps maintain your body's temperature. Aim for 8 glasses of water daily.",
    category: "hydration",
    emoji: "💧"
  },
  {
    id: 2,
    title: "Mindful Breathing",
    content: "Take 5 deep breaths through your nose, filling your belly first then chest. Exhale slowly through the mouth to reduce stress.",
    category: "mindfulness",
    emoji: "🧘"
  },
  {
    id: 3,
    title: "Walking Meditation",
    content: "Turn a simple walk into meditation by focusing on each step, your breath, and the sensations around you.",
    category: "exercise",
    emoji: "🚶"
  },
  {
    id: 4,
    title: "Digital Sunset",
    content: "Power down electronic devices 1 hour before bedtime to improve sleep quality and reduce blue light exposure.",
    category: "sleep",
    emoji: "🌙"
  },
  {
    id: 5,
    title: "Colorful Plate Rule",
    content: "Aim to include at least 3 different colors of fruits and vegetables on your plate for a wider range of nutrients.",
    category: "nutrition",
    emoji: "🥗"
  },
  {
    id: 6,
    title: "Posture Check",
    content: "Take a moment to check your posture right now. Align your spine, relax your shoulders, and keep your neck straight.",
    category: "mindfulness",
    emoji: "⬆️"
  },
  {
    id: 7,
    title: "Gratitude Practice",
    content: "Name three things you're grateful for today to shift your focus to positivity and increase well-being.",
    category: "mindfulness",
    emoji: "🙏"
  },
  {
    id: 8,
    title: "Eye Rest",
    content: "Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.",
    category: "mindfulness",
    emoji: "👁️"
  }
];

const elementSpecificTips: Record<string, WellnessTip[]> = {
  fire: [
    {
      id: 101,
      title: "Cool Down Ritual",
      content: "Fire signs benefit from cooling foods like cucumber, watermelon, and mint tea to balance their natural heat.",
      category: "nutrition",
      element: "fire",
      emoji: "🔥"
    },
    {
      id: 102,
      title: "Energy Channel",
      content: "Channel your abundant energy with high-intensity interval training for efficient and satisfying workouts.",
      category: "exercise",
      element: "fire",
      emoji: "⚡"
    }
  ],
  earth: [
    {
      id: 201,
      title: "Grounding Practice",
      content: "Earth signs benefit from direct contact with nature. Try barefoot walking on grass or soil for 10 minutes.",
      category: "mindfulness",
      element: "earth",
      emoji: "🌱"
    },
    {
      id: 202,
      title: "Routine Power",
      content: "Strengthen your natural affinity for routine by establishing a consistent sleep schedule, even on weekends.",
      category: "sleep",
      element: "earth",
      emoji: "⏰"
    }
  ],
  air: [
    {
      id: 301,
      title: "Mental Clarity",
      content: "Air signs benefit from foods rich in omega-3 fatty acids like walnuts, flaxseeds, and fatty fish for mental clarity.",
      category: "nutrition",
      element: "air",
      emoji: "🌬️"
    },
    {
      id: 302,
      title: "Breath Connection",
      content: "Connect with your ruling element through pranayama (breath control) exercises for 5 minutes daily.",
      category: "mindfulness",
      element: "air",
      emoji: "🍃"
    }
  ],
  water: [
    {
      id: 401,
      title: "Emotional Hydration",
      content: "Water signs should ensure proper hydration to support their emotional regulation and intuitive abilities.",
      category: "hydration",
      element: "water",
      emoji: "🌊"
    },
    {
      id: 402,
      title: "Fluid Movement",
      content: "Enhance your natural grace with flowing exercises like swimming, tai chi, or dance to connect with your element.",
      category: "exercise",
      element: "water",
      emoji: "🏊"
    }
  ]
};

const zodiacSpecificTips: Record<ZodiacSign, WellnessTip[]> = {
  aries: [
    {
      id: 1001,
      title: "Energy Balance",
      content: "As an Aries, your abundant energy benefits from balancing high-intensity workouts with restorative yoga.",
      category: "exercise",
      zodiacSigns: ["aries"],
      emoji: "♈"
    }
  ],
  taurus: [
    {
      id: 1002,
      title: "Sensory Nourishment",
      content: "Engage your Taurean senses with aromatic herbs like rosemary and basil in your meals for both pleasure and health.",
      category: "nutrition",
      zodiacSigns: ["taurus"],
      emoji: "♉"
    }
  ],
  gemini: [
    {
      id: 1003,
      title: "Dual Nature Balance",
      content: "Balance your Gemini duality with alternating nostril breathing to synchronize both hemispheres of your brain.",
      category: "mindfulness",
      zodiacSigns: ["gemini"],
      emoji: "♊"
    }
  ],
  cancer: [
    {
      id: 1004,
      title: "Emotional Nourishment",
      content: "Support your Cancer sensitivity with magnesium-rich foods like leafy greens, nuts, and dark chocolate.",
      category: "nutrition",
      zodiacSigns: ["cancer"],
      emoji: "♋"
    }
  ],
  leo: [
    {
      id: 1005,
      title: "Heart Strength",
      content: "Support your Leo-ruled heart with cardiovascular exercises like dancing, hiking, or cycling.",
      category: "exercise",
      zodiacSigns: ["leo"],
      emoji: "♌"
    }
  ],
  virgo: [
    {
      id: 1006,
      title: "Digestive Wisdom",
      content: "Honor your Virgo-ruled digestive system with fermented foods like yogurt, kefir, and sauerkraut for gut health.",
      category: "nutrition",
      zodiacSigns: ["virgo"],
      emoji: "♍"
    }
  ],
  libra: [
    {
      id: 1007,
      title: "Balance Restoration",
      content: "Restore your Libran balance with a symmetrical yoga pose like tree pose, focusing on equal weight distribution.",
      category: "exercise",
      zodiacSigns: ["libra"],
      emoji: "♎"
    }
  ],
  scorpio: [
    {
      id: 1008,
      title: "Transformative Hydration",
      content: "Support your Scorpio intensity with detoxifying waters infused with lemon, cucumber, or ginger.",
      category: "hydration",
      zodiacSigns: ["scorpio"],
      emoji: "♏"
    }
  ],
  sagittarius: [
    {
      id: 1009,
      title: "Expansive Movement",
      content: "Satisfy your Sagittarian love of freedom with expansive movements like wide-legged stretches or outdoor running.",
      category: "exercise",
      zodiacSigns: ["sagittarius"],
      emoji: "♐"
    }
  ],
  capricorn: [
    {
      id: 1010,
      title: "Structural Support",
      content: "Strengthen your Capricorn-ruled skeletal system with weight-bearing exercises and calcium-rich foods.",
      category: "exercise",
      zodiacSigns: ["capricorn"],
      emoji: "♑"
    }
  ],
  aquarius: [
    {
      id: 1011,
      title: "Circulation Boost",
      content: "Enhance your Aquarian circulation with ankle rotations and stretches to support lower leg health.",
      category: "exercise",
      zodiacSigns: ["aquarius"],
      emoji: "♒"
    }
  ],
  pisces: [
    {
      id: 1012,
      title: "Dream Support",
      content: "Enhance your Piscean dream state with a lavender sachet under your pillow or a calming bedtime tea ritual.",
      category: "sleep",
      zodiacSigns: ["pisces"],
      emoji: "♓"
    }
  ]
};

export const getAllTips = (): WellnessTip[] => {
  return universalTips;
};

export const getTipsByElement = (element: string): WellnessTip[] => {
  return elementSpecificTips[element] || [];
};

export const getTipsByZodiacSign = (sign: ZodiacSign): WellnessTip[] => {
  return zodiacSpecificTips[sign] || [];
};

export const getRandomTip = (sign?: ZodiacSign, element?: string): WellnessTip => {
  let tips: WellnessTip[] = [...universalTips];
  
  if (sign) {
    tips = [...tips, ...getTipsByZodiacSign(sign)];
  }
  
  if (element) {
    tips = [...tips, ...getTipsByElement(element)];
  }
  
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
};