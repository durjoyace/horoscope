import OpenAI from "openai";
import { ZodiacSign } from "@shared/types";
import { HoroscopeContent } from "@shared/types";

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. Horoscope generation will use mock data.");
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a health-focused horoscope for a specific zodiac sign
 */
export async function generateHealthHoroscope(
  sign: ZodiacSign,
  date: string = new Date().toISOString().split('T')[0]
): Promise<HoroscopeContent> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return generateMockHoroscope(sign);
    }

    const { element, characteristics } = getZodiacTraits(sign);

    const prompt = `Generate a personalized health horoscope for ${sign} (${element} element) for ${date}.
    
    The horoscope should include:
    
    1. A general overview of health and wellness aspects for the day (100-150 words)
    2. A list of 2-3 wellness categories the ${sign} should focus on today (choose from: nutrition, sleep, stress, fitness, mindfulness)
    3. One specific health tip tailored to ${sign}'s ${characteristics}
    4. A nutrition focus for the day that aligns with their ${element} element
    5. An element alignment suggestion for balancing their energy
    
    Format the response as a JSON object with these keys:
    overview, wellnessCategories, healthTip, nutritionFocus, elementAlignment
    
    Make the content encouraging, practical, and health-focused while incorporating astrological concepts.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a health-focused astrologer creating personalized daily horoscopes." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const content = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      overview: content.overview || "",
      wellnessCategories: (content.wellnessCategories || ["nutrition", "sleep"]) as any,
      healthTip: content.healthTip || "",
      nutritionFocus: content.nutritionFocus || "",
      elementAlignment: content.elementAlignment || ""
    };
  } catch (error) {
    console.error(`Error generating horoscope for ${sign}:`, error);
    
    // Fallback to mock data if OpenAI generation fails
    return generateMockHoroscope(sign);
  }
}

function getZodiacTraits(sign: ZodiacSign): { element: string; characteristics: string } {
  const traits = {
    aries: { 
      element: "Fire", 
      characteristics: "energetic and impulsive nature" 
    },
    taurus: { 
      element: "Earth", 
      characteristics: "grounded and patient disposition" 
    },
    gemini: { 
      element: "Air", 
      characteristics: "curious and adaptable mindset" 
    },
    cancer: { 
      element: "Water", 
      characteristics: "emotional and nurturing tendencies" 
    },
    leo: { 
      element: "Fire", 
      characteristics: "confident and passionate spirit" 
    },
    virgo: { 
      element: "Earth", 
      characteristics: "analytical and detail-oriented approach" 
    },
    libra: { 
      element: "Air", 
      characteristics: "harmonious and balanced perspective" 
    },
    scorpio: { 
      element: "Water", 
      characteristics: "intense and transformative energy" 
    },
    sagittarius: { 
      element: "Fire", 
      characteristics: "adventurous and optimistic outlook" 
    },
    capricorn: { 
      element: "Earth", 
      characteristics: "disciplined and ambitious nature" 
    },
    aquarius: { 
      element: "Air", 
      characteristics: "innovative and humanitarian vision" 
    },
    pisces: { 
      element: "Water", 
      characteristics: "intuitive and compassionate spirit" 
    }
  };

  return traits[sign];
}

/**
 * Generate mock horoscope data for development and fallback purposes
 */
function generateMockHoroscope(sign: ZodiacSign): HoroscopeContent {
  const { element, characteristics } = getZodiacTraits(sign);
  
  const mockHoroscopes = {
    aries: {
      overview: "Today, your natural Aries energy is heightened, which is great for physical activities but may lead to restlessness. Focus on channeling this energy productively through structured exercise. Your metabolism is particularly efficient today, so it's an ideal time to adjust your diet if you've been planning to. Remember to balance your fire element with cooling activities throughout the day.",
      wellnessCategories: ["fitness", "nutrition", "stress"] as WellnessCategory[],
      healthTip: "Incorporate short, intense bursts of activity throughout your day to release excess energy and prevent the buildup of tension in your shoulders and neck.",
      nutritionFocus: "Include cooling foods like cucumber and leafy greens to balance your natural fire element, while ensuring adequate protein for your active lifestyle.",
      elementAlignment: "Balance your fire element by spending time near water today - a shower, bath, or even sitting by a fountain can help regulate your energy."
    },
    taurus: {
      overview: "Your Taurus constitution brings stability to your health today, making it an excellent time for establishing new wellness routines. Your throat and neck area may need extra attention, so gentle stretches and staying hydrated are essential. Your connection to Earth energy supports grounding practices that can improve your overall sense of physical security and comfort.",
      wellnessCategories: ["nutrition", "sleep"] as WellnessCategory[],
      healthTip: "Focus on neck stretches and throat care today, perhaps with warm herbal teas containing honey to soothe and nourish this sensitive area for Taurus.",
      nutritionFocus: "Root vegetables and hearty grains will satisfy your Earth element's need for substantial nourishment while supporting sustainable energy levels.",
      elementAlignment: "Connect with your Earth element by walking barefoot outside, gardening, or enjoying time in natural settings today."
    },
    gemini: {
      overview: "Your Gemini energy creates a quick-moving metabolism today, which may leave you feeling scattered if not properly fueled. Pay special attention to your respiratory system and nervous system health. Short, varied activities will serve you better than long, monotonous ones. Your natural curiosity can be channeled into trying new healthy foods or exercise routines.",
      wellnessCategories: ["mindfulness", "fitness"],
      healthTip: "Practice focused breathing exercises to strengthen your lungs and calm your active Gemini mind when it becomes overstimulated.",
      nutritionFocus: "Opt for a variety of colorful foods in smaller portions throughout the day to satisfy your Air element's need for diversity and prevent energy crashes.",
      elementAlignment: "Balance your Air element by incorporating grounding practices today, such as standing barefoot on the earth or working with clay."
    },
    cancer: {
      overview: `As a Cancer, your emotional and physical wellness are closely linked today. Your digestive system may be particularly sensitive, so gentle, nurturing foods are recommended. The lunar influence enhances your intuitive abilities regarding what your body needs. Practice emotional self-care as this directly impacts your physical health. Hydration is especially important for balancing your Water element.`,
      wellnessCategories: ["sleep", "stress", "nutrition"],
      healthTip: "Place your hands on your stomach area for a few minutes of conscious breathing to improve digestion and emotional processing.",
      nutritionFocus: "Incorporate easily digestible foods like soups, broths, and steamed vegetables to nurture your sensitive Water element constitution.",
      elementAlignment: "Honor your Water element by ensuring adequate hydration and perhaps taking a nurturing bath with Epsom salts to support emotional and physical cleansing."
    },
    leo: {
      overview: "Your Leo vitality shines today, supporting heart health and circulation. Channel your natural confidence into physical activities that bring you joy. Your spine and back area may need some attention, so maintaining good posture is important. The sun's energy enhances your natural radiance, making this an excellent day for outdoor activities that strengthen your cardiovascular system.",
      wellnessCategories: ["fitness", "mindfulness"],
      healthTip: "Focus on heart-opening exercises like gentle backbends or chest stretches to enhance circulation and support your natural Leo radiance.",
      nutritionFocus: "Foods rich in antioxidants and heart-healthy nutrients like berries, fatty fish, and olive oil will nourish your Fire element's energy system.",
      elementAlignment: "Harmonize your Fire element by spending time in the sunshine (with proper protection) to absorb vital solar energy that resonates with your Leo nature."
    },
    virgo: {
      overview: "Your Virgo attention to detail serves your health well today, particularly regarding digestive wellness. This is an excellent time for fine-tuning your diet and health routines. Your analytical nature helps you identify subtle body signals that others might miss. Focus on gut health and the mind-body connection for optimal wellness today. Small, consistent habits will yield the best results for your Earth constitution.",
      wellnessCategories: ["nutrition", "stress", "fitness"],
      healthTip: "Practice mindful eating by thoroughly chewing each bite and eliminating distractions during meals to support your sensitive Virgo digestive system.",
      nutritionFocus: "Incorporate fiber-rich foods like whole grains, legumes, and leafy greens to support intestinal health, which is particularly important for your Earth constitution.",
      elementAlignment: "Ground your Earth energy through organization and creating order in your physical space, which will translate to internal physiological harmony."
    },
    libra: {
      overview: "Your Libra constitution seeks balance in all aspects of health today. Your kidneys and lower back may require special attention through proper hydration and gentle movement. Aesthetic elements significantly impact your well-being, so beautiful surroundings and pleasant sensory experiences contribute to your physical health. Social wellness is also key today, as harmonious interactions boost your immune function.",
      wellnessCategories: ["mindfulness", "sleep"],
      healthTip: "Practice gentle, symmetrical yoga poses that balance both sides of your body to support your Libra need for physical equilibrium.",
      nutritionFocus: "Create visually balanced meals with equal proportions of various food groups to satisfy your Air element's need for harmony and proportion.",
      elementAlignment: "Support your Air element by bringing beautiful scents into your environment through essential oils or fresh flowers, engaging your refined sensory awareness."
    },
    scorpio: {
      overview: "Your Scorpio intensity brings powerful healing potential today, particularly for regenerative processes. Your reproductive and elimination systems are highlighted, making it important to support detoxification pathways. Emotional release has direct physical benefits for your Water constitution. Deep rather than surface-level health approaches will serve you best today.",
      wellnessCategories: ["sleep", "stress"],
      healthTip: "Practice pelvic floor exercises and lower abdominal breathing to support the reproductive and elimination systems that are key to Scorpio wellness.",
      nutritionFocus: "Include detoxifying foods like beets, dark leafy greens, and lemon water to support your Water element's natural elimination processes.",
      elementAlignment: "Honor your Water element through emotional release practices like journaling or therapeutic conversation that allow emotional fluidity."
    },
    sagittarius: {
      overview: "Your Sagittarius energy craves movement and expansion today, making it essential to incorporate physical activity that allows for freedom. Your hips, thighs, and liver are areas to nurture with stretching and proper nutrition. Your philosophical outlook supports holistic health approaches that connect mind, body, and spirit. Optimism boosts your immune function, so maintaining a positive perspective directly impacts your physical wellness.",
      wellnessCategories: ["fitness", "mindfulness"],
      healthTip: "Incorporate hip-opening stretches and movements that allow for full extension of your body to satisfy your Sagittarius need for expansion.",
      nutritionFocus: "Choose foods that support liver health like turmeric, leafy greens, and plenty of water to complement your active Fire element metabolism.",
      elementAlignment: "Feed your Fire element through adventure and exploration, even if just taking a new route on your daily walk or trying an unfamiliar healthy recipe."
    },
    capricorn: {
      overview: "Your Capricorn constitution emphasizes skeletal strength today, making it important to support bone health through nutrition and weight-bearing exercise. Your knees and joints may need extra attention. Disciplined health routines yield particularly effective results now. Your Earth element thrives on structure, so establishing clear patterns for meals and activities will optimize your physiological functions.",
      wellnessCategories: ["nutrition", "fitness"],
      healthTip: "Focus on weight-bearing exercise and proper alignment to support your Capricorn skeletal system and joint health.",
      nutritionFocus: "Incorporate calcium and magnesium-rich foods like dark leafy greens, nuts, and seeds to nourish your Earth element's structural needs.",
      elementAlignment: "Honor your Earth element by creating structure in your day with clearly defined times for meals, exercise, work, and rest."
    },
    aquarius: {
      overview: "Your Aquarius energy highlights circulation and nervous system health today. Your ankles and calves may benefit from movement and stretching. Innovative health approaches resonate with your Air constitution, making this an excellent time to explore new wellness technologies or methodologies. Intellectual stimulation contributes directly to your physical vitality, so learning about health can itself be a wellness practice for you.",
      wellnessCategories: ["fitness", "mindfulness"],
      healthTip: "Practice ankle rotations and calf stretches throughout the day to support circulation in these Aquarius-ruled areas of the body.",
      nutritionFocus: "Incorporate foods rich in omega-3 fatty acids and antioxidants to support nervous system health, which is essential for your mentally-active Air element.",
      elementAlignment: "Balance your Air element by engaging in group fitness or wellness communities that combine social connection with health practices."
    },
    pisces: {
      overview: "Your Pisces intuition guides your health wisdom today, particularly regarding subtle energy systems. Your feet and immune system benefit from extra care. Boundaries between yourself and your environment are more permeable, making it important to protect your energy and be selective about surroundings. Water element hydration is essential, as is emotional fluidity for maintaining physical wellness.",
      wellnessCategories: ["sleep", "mindfulness"],
      healthTip: "Give attention to foot health through gentle massage, proper footwear, and perhaps a warm foot bath with epsom salts to ground your Pisces energy.",
      nutritionFocus: "Choose immune-supporting foods rich in vitamin C and zinc, while ensuring adequate hydration to support your Water element constitution.",
      elementAlignment: "Honor your Water element by spending time near natural water sources like oceans, lakes, or even a small fountain to restore your energetic balance."
    }
  };
  
  return mockHoroscopes[sign];
}