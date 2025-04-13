import { ZodiacSign } from "@shared/types";

// Define initial forum topics for each zodiac sign
// These topics will be pre-populated when the community is first initialized

export interface InitialTopic {
  title: string;
  content: string;
  category: string;
  isPinned?: boolean;
}

// Create a type for the object mapping zodiac signs to arrays of topics
type ZodiacTopicsMap = {
  [key in ZodiacSign]: InitialTopic[];
};

export const initialForumTopics: ZodiacTopicsMap = {
  aries: [
    {
      title: "Manage your Aries energy for better health",
      content: "As an Aries, I often find myself with an excess of energy that can lead to burnout if not properly channeled. What are some strategies other Aries use to manage their energy levels throughout the day for better overall health and wellness?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "High-intensity workouts for Aries",
      content: "Fellow Aries, what high-intensity workouts have you found most effective for your natural energy levels? I'm looking for recommendations that challenge me but don't lead to the quick burnout I often experience.",
      category: "fitness"
    },
    {
      title: "Managing headaches as an Aries",
      content: "I've noticed I'm particularly prone to headaches, especially when I'm stressed or overworked. Are other Aries experiencing this too? What remedies have worked best for you?",
      category: "health"
    },
    {
      title: "Anti-inflammatory foods for Aries health",
      content: "Our sign is apparently prone to inflammation. What anti-inflammatory foods or diets have other Aries tried with success? Looking for practical dietary changes that match our energetic lifestyle.",
      category: "nutrition"
    }
  ],
  taurus: [
    {
      title: "Sustainable health practices for Taurus",
      content: "As a Taurus who values consistency, I'm looking for sustainable health practices that I can maintain long-term. What routines have other Taurus found effective without feeling like drastic lifestyle changes?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Throat care routines for Taurus",
      content: "Since Taurus rules the throat area, what are your favorite ways to take care of your vocal health? I've been experiencing some throat discomfort lately and would love some Taurus-specific advice.",
      category: "health"
    },
    {
      title: "Strength training that works for Taurus persistence",
      content: "I'm looking for strength training programs that align with our Taurus endurance and persistence. What approaches have worked well for your body type and temperament?",
      category: "fitness"
    },
    {
      title: "Comfort foods made healthy for Taurus",
      content: "We Taurus love our comfort foods! How have you transformed traditional comfort foods into healthier versions without sacrificing the satisfaction that we crave?",
      category: "nutrition"
    }
  ],
  gemini: [
    {
      title: "Balancing mental and physical health as a Gemini",
      content: "As Geminis, we're known for our active minds, but sometimes this comes at the expense of physical health. How do you fellow Geminis maintain a balance between mental and physical wellness?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Best breathing exercises for Gemini respiratory health",
      content: "Since our sign rules the respiratory system, what breathing exercises or practices have you found most beneficial for lung capacity and overall respiratory health?",
      category: "health"
    },
    {
      title: "Variety-packed workout routines for Gemini",
      content: "I get bored easily with repetitive workouts. What varied and interesting fitness routines keep your Gemini attention engaged while still providing a good workout?",
      category: "fitness"
    },
    {
      title: "Brain-boosting foods for Gemini mental agility",
      content: "What foods or nutritional approaches have you found that support our natural Gemini mental agility and help prevent mental fatigue throughout the day?",
      category: "nutrition"
    }
  ],
  cancer: [
    {
      title: "Emotional wellness practices for Cancer",
      content: "As emotionally sensitive Cancers, our health is deeply tied to our emotional state. What practices have helped you maintain emotional balance for better overall health?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Digestive health strategies for Cancer",
      content: "Many Cancers struggle with digestive sensitivity that seems connected to our emotional states. What approaches have you found effective for maintaining good digestive health, especially during stressful times?",
      category: "health"
    },
    {
      title: "Water-based workouts ideal for Cancer",
      content: "As a water sign, I find myself drawn to swimming and water exercises. What water-based fitness activities have other Cancers enjoyed and found beneficial?",
      category: "fitness"
    },
    {
      title: "Nurturing foods for Cancer's emotional wellbeing",
      content: "What foods have you found most nurturing and supportive for our Cancer need for emotional comfort while still being health-conscious?",
      category: "nutrition"
    }
  ],
  leo: [
    {
      title: "Heart-healthy practices for Leo vitality",
      content: "Since Leo rules the heart, I'm interested in learning what heart-healthy practices other Leos incorporate into their daily routines to maintain our natural vitality and energy?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Maintaining Leo back and spine health",
      content: "Many Leos seem prone to back issues. What preventative measures and remedies have worked for keeping your spine and back healthy and pain-free?",
      category: "health"
    },
    {
      title: "Performance-based fitness for Leo's love of the spotlight",
      content: "What fitness activities satisfy our Leo love of performance while providing a good workout? Dance classes? Sports teams? Share what keeps you motivated!",
      category: "fitness"
    },
    {
      title: "Diet strategies for Leo's cardiovascular health",
      content: "What dietary approaches have fellow Leos found beneficial for maintaining good cardiovascular health and supporting our natural energy levels?",
      category: "nutrition"
    }
  ],
  virgo: [
    {
      title: "Practical wellness routines for Virgo precision",
      content: "As detail-oriented Virgos, what precise and practical wellness routines have you developed that actually produce results without being overly complicated?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Digestive system support for Virgo health",
      content: "With Virgo ruling the digestive system, what approaches have you found most effective for maintaining optimal digestive health and preventing sensitivity issues?",
      category: "health"
    },
    {
      title: "Methodical fitness plans that work for Virgo",
      content: "What systematic, detailed fitness plans have worked best with your Virgo tendencies toward precision and improvement? Looking for something that provides measurable progress.",
      category: "fitness"
    },
    {
      title: "Clean eating approaches for Virgo's discerning palate",
      content: "What clean eating approaches satisfy our Virgo analytical nature and desire for purity without becoming obsessive about food choices?",
      category: "nutrition"
    }
  ],
  libra: [
    {
      title: "Balanced wellness approach for Libra harmony",
      content: "As Libras seeking balance in all things, what wellness practices have you found that successfully harmonize different aspects of health - physical, mental, and emotional?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Kidney and lower back care for Libra",
      content: "Since Libra rules the kidneys and lower back, what preventative practices have you incorporated to maintain health in these areas? Any specific exercises or habits?",
      category: "health"
    },
    {
      title: "Partner-focused workouts for social Libras",
      content: "As social Libras, many of us prefer not to work out alone. What partner exercises or group fitness activities have you found most enjoyable and effective?",
      category: "fitness"
    },
    {
      title: "Beautifully balanced meals for Libra's aesthetic sense",
      content: "What approaches to balanced nutrition appeal to our Libra appreciation for beauty and harmony while supporting optimal health?",
      category: "nutrition"
    }
  ],
  scorpio: [
    {
      title: "Transformative wellness practices for Scorpio",
      content: "As Scorpios with a natural affinity for transformation, what wellness practices have you found that harness this regenerative energy for improved health outcomes?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Reproductive and sexual health for Scorpio",
      content: "With Scorpio ruling the reproductive system, what approaches to reproductive and sexual health have you found most beneficial and effective?",
      category: "health"
    },
    {
      title: "Intense workouts that satisfy Scorpio depth",
      content: "What intense, transformative workout regimens appeal to our Scorpio desire for depth and meaningful change rather than surface-level fitness?",
      category: "fitness"
    },
    {
      title: "Detoxifying foods for Scorpio's regenerative nature",
      content: "What detoxifying foods and dietary approaches support our Scorpio regenerative abilities and help maintain our intense energy levels?",
      category: "nutrition"
    }
  ],
  sagittarius: [
    {
      title: "Adventure-seeking wellness for Sagittarius",
      content: "As freedom-loving Sagittarians, what wellness approaches satisfy our need for adventure and exploration while still providing structure for consistent health?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Liver health and natural detox for Sagittarius",
      content: "Since Sagittarius rules the liver, what natural approaches have you found effective for supporting liver health and natural detoxification processes?",
      category: "health"
    },
    {
      title: "Outdoor fitness activities for Sagittarius",
      content: "What outdoor fitness activities satisfy our Sagittarius love of nature, freedom, and exploration while providing a good workout?",
      category: "fitness"
    },
    {
      title: "Nutritional approaches for Sagittarius optimism and energy",
      content: "What foods and eating patterns support our natural Sagittarius optimism and high energy levels without leading to crashes or health issues?",
      category: "nutrition"
    }
  ],
  capricorn: [
    {
      title: "Structured wellness routines for Capricorn discipline",
      content: "As disciplined Capricorns, what structured wellness routines have you successfully maintained long-term that deliver consistent health improvements?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Joint and bone health strategies for Capricorn",
      content: "With Capricorn ruling the skeletal system, what preventative measures and supplements have you found effective for maintaining strong bones and healthy joints?",
      category: "health"
    },
    {
      title: "Endurance-building workouts for Capricorn persistence",
      content: "What endurance-focused fitness approaches complement our Capricorn persistence and discipline for long-term results?",
      category: "fitness"
    },
    {
      title: "Practical nutrition plans for busy Capricorns",
      content: "What practical, no-nonsense nutrition approaches work well with our Capricorn busy schedules and goal-oriented mindsets?",
      category: "nutrition"
    }
  ],
  aquarius: [
    {
      title: "Innovative wellness approaches for Aquarius",
      content: "As forward-thinking Aquarians, what innovative or unconventional wellness practices have you discovered that effectively address health in ways traditional methods don't?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Circulation and nervous system support for Aquarius",
      content: "Since Aquarius rules circulation and the nervous system, what approaches have you found beneficial for maintaining good circulation and calm electrical impulses in the body?",
      category: "health"
    },
    {
      title: "Group fitness with individual flair for Aquarius",
      content: "What group fitness activities allow for our Aquarius need for community while still honoring our individualistic approach to exercise?",
      category: "fitness"
    },
    {
      title: "Progressive nutrition for forward-thinking Aquarius",
      content: "What cutting-edge nutritional approaches appeal to our Aquarius innovative nature while providing solid health benefits?",
      category: "nutrition"
    }
  ],
  pisces: [
    {
      title: "Intuitive wellness practices for Pisces sensitivity",
      content: "As intuitive Pisces, what wellness approaches allow you to honor your natural sensitivity and intuition while still maintaining physical health?",
      category: "wellness",
      isPinned: true
    },
    {
      title: "Immune and lymphatic support for Pisces health",
      content: "With Pisces ruling the immune and lymphatic systems, what practices have you found that effectively support these systems for better overall health?",
      category: "health"
    },
    {
      title: "Water-based and flowing movement for Pisces",
      content: "What gentle, flowing movement practices (water-based or otherwise) complement our Pisces fluid nature and sensitivity?",
      category: "fitness"
    },
    {
      title: "Intuitive eating approach for Pisces health",
      content: "What intuitive eating practices work well with our Pisces natural connection to inner wisdom while still providing structure for healthy choices?",
      category: "nutrition"
    }
  ]
};