import { ZodiacSign } from "@shared/types";

// Zodiac sign information
export interface ZodiacInfo {
  sign: ZodiacSign;
  name: string;
  symbol: string;
  dateRange: string;
  element: string;
  icon: string;
}

// Zodiac sign data
export const zodiacSigns: ZodiacInfo[] = [
  {
    sign: "aries",
    name: "Aries",
    symbol: "Ram",
    dateRange: "Mar 21 - Apr 19",
    element: "Fire",
    icon: "fire"
  },
  {
    sign: "taurus",
    name: "Taurus",
    symbol: "Bull",
    dateRange: "Apr 20 - May 20",
    element: "Earth",
    icon: "bullseye"
  },
  {
    sign: "gemini",
    name: "Gemini",
    symbol: "Twins",
    dateRange: "May 21 - Jun 20",
    element: "Air",
    icon: "user-friends"
  },
  {
    sign: "cancer",
    name: "Cancer",
    symbol: "Crab",
    dateRange: "Jun 21 - Jul 22",
    element: "Water",
    icon: "moon"
  },
  {
    sign: "leo",
    name: "Leo",
    symbol: "Lion",
    dateRange: "Jul 23 - Aug 22",
    element: "Fire",
    icon: "sun"
  },
  {
    sign: "virgo",
    name: "Virgo",
    symbol: "Virgin",
    dateRange: "Aug 23 - Sep 22",
    element: "Earth",
    icon: "seedling"
  },
  {
    sign: "libra",
    name: "Libra",
    symbol: "Scales",
    dateRange: "Sep 23 - Oct 22",
    element: "Air",
    icon: "balance-scale"
  },
  {
    sign: "scorpio",
    name: "Scorpio",
    symbol: "Scorpion",
    dateRange: "Oct 23 - Nov 21",
    element: "Water",
    icon: "wind"
  },
  {
    sign: "sagittarius",
    name: "Sagittarius",
    symbol: "Archer",
    dateRange: "Nov 22 - Dec 21",
    element: "Fire",
    icon: "binoculars"
  },
  {
    sign: "capricorn",
    name: "Capricorn",
    symbol: "Goat",
    dateRange: "Dec 22 - Jan 19",
    element: "Earth",
    icon: "mountain"
  },
  {
    sign: "aquarius",
    name: "Aquarius",
    symbol: "Water Bearer",
    dateRange: "Jan 20 - Feb 18",
    element: "Air",
    icon: "tint"
  },
  {
    sign: "pisces",
    name: "Pisces",
    symbol: "Fish",
    dateRange: "Feb 19 - Mar 20",
    element: "Water",
    icon: "water"
  }
];

// Get zodiac sign by name
export function getZodiacBySign(sign: ZodiacSign): ZodiacInfo {
  return zodiacSigns.find(z => z.sign === sign) || zodiacSigns[0];
}

// Determine zodiac sign from birthdate
export function getZodiacFromDate(dateString: string): ZodiacSign {
  // Parse the date
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // January is 0
  const day = date.getDate();
  
  // Determine the zodiac sign based on month and day
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "aries";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "taurus";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return "gemini";
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return "cancer";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "leo";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "virgo";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return "libra";
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return "scorpio";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return "sagittarius";
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return "capricorn";
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "aquarius";
  } else {
    return "pisces";
  }
}
