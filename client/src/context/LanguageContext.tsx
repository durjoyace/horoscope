import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// English translations
const enTranslations: Record<string, string> = {
  // Navigation
  'nav.home': 'Home',
  'nav.dashboard': 'Dashboard',
  'nav.zodiac': 'Zodiac Library',
  'nav.elements': 'Elements',
  'nav.marketplace': 'Wellness Marketplace',
  'nav.about': 'About',
  'nav.science': 'Our Science',
  'nav.contact': 'Contact',
  'nav.premium': 'Premium',
  'nav.login': 'Login',
  'nav.signup': 'Sign Up',
  'nav.logout': 'Logout',
  'nav.account': 'My Account',
  'nav.language': 'Language',
  
  // Hero Section
  'hero.tagline': 'Where Ancient Wisdom Meets Modern Science',
  'hero.brand': 'HOROSCOPE HEALTH',
  'hero.brand.abbr': 'HH',
  'hero.title1': 'Your Personalized',
  'hero.title2': 'Cosmic Wellness Guide',
  'hero.description': 'Discover how your zodiac sign influences your health tendencies and receive daily personalized wellness recommendations based on your astrological profile.',
  
  // Signup Form
  'signup.header': 'Begin Your Cosmic Health Journey',
  'signup.title': 'Begin Your Personalized Health Journey',
  'signup.subtitle': 'Unlock Your Cosmic Wellness Potential',
  'signup.join': 'Join thousands discovering their astrological path to better health',
  'signup.email.placeholder': 'Enter your email address',
  'signup.benefit1': 'Daily personalized health insights',
  'signup.benefit2': 'Element-aligned wellness tips',
  'signup.benefit3': 'Astrological health forecasts',
  'signup.benefit4': 'Zodiac-specific self-care rituals',
  'signup.benefits.insights': 'Daily personalized health insights',
  'signup.benefits.wellness': 'Element-aligned wellness tips',
  'signup.benefits.forecasts': 'Astrological health forecasts',
  'signup.benefits.rituals': 'Zodiac-specific self-care rituals',
  'signup.button.loading': 'Creating Your Profile...',
  'signup.button': 'Reveal My Cosmic Health Path',
  'signup.microcopy': 'No credit card required • 100% free • Instant access',
  'signup.testimonial': '"I\'ve gained incredible insights about my body\'s needs based on my sign" — Sarah K.',
  'signup.profile': 'Your Horoscope Health Profile',
  'signup.select': 'Select your zodiac sign to begin',
  'signup.get': 'Get My Horoscope',
  'signup.dashboard': 'Go to Dashboard',
  
  // Zodiac Profile
  'zodiac.profile.title': 'Your Horoscope Health Profile',
  'zodiac.profile.subtitle': 'Select your zodiac sign to begin',
  'zodiac.profile.button': 'Get My Horoscope',
  
  // Toast Notifications
  'toast.email.required.title': 'Email Required',
  'toast.email.required.description': 'Please enter your email address to continue',
  
  // Wellness Quote Widget
  'quote.title': 'DAILY INSPIRATION',
  'quote.heading': 'Your Wellness Quote of the Day',
  'quote.subheading': 'Wisdom to guide your wellness journey',
  'quote.select': 'Select your zodiac sign above to receive a personalized wellness quote.',
  'quote.personalized': 'Your Personal Wellness Quote',
  'quote.general': 'Wellness Quote of the Day',
  'quote.refresh': 'Refresh quote',
  
  // How It Works Section
  'how.title': 'SCIENCE MEETS ASTROLOGY',
  'how.heading': 'How Horoscope Health Works',
  'how.description': 'Our unique methodology bridges ancient astrological wisdom with modern health science',
  'how.card1.title': 'Astrological Analysis',
  'how.card1.description': 'We analyze your zodiac sign\'s elemental constitution, planetary rulers, and traditional health associations to understand your innate tendencies.',
  'how.card2.title': 'Scientific Integration',
  'how.card2.description': 'Our team combines astrological insights with evidence-based wellness research to create recommendations that honor both systems.',
  'how.card3.title': 'Personalized Guidance',
  'how.card3.description': 'You receive daily horoscopes with specific health and wellness recommendations tailored to your sign\'s unique constitution and current celestial influences.',
  
  // Premium Section
  'premium.badge': 'Premium Membership',
  'premium.title': 'Elevate Your Wellness Journey',
  'premium.description': 'Unlock deeper astrological health insights with our premium membership, designed for those seeking comprehensive wellness guidance.',
  'premium.benefit1': 'Weekly in-depth wellness reports based on your specific astrological profile',
  'premium.benefit2': 'Personalized exercise and nutrition recommendations',
  'premium.benefit3': 'Exclusive access to premium content and monthly special reports',
  'premium.button': 'Upgrade to Premium',
  'premium.pricing.title': 'Monthly Plan',
  'premium.pricing.price': '$9.99',
  'premium.pricing.period': '/month',
  'premium.pricing.feature1': 'Full access to all features',
  'premium.pricing.feature2': 'Weekly premium reports',
  'premium.pricing.feature3': 'Cancel anytime',
  'premium.pricing.button': 'Subscribe Now',
  'premium.methodology': 'Learn About Our Methodology',
  'premium.label': 'Premium',
  'premium.features': 'Premium Features',
  'premium.upgrade': 'Upgrade to Premium',
  
  // Elements Section
  'elements.title': 'ELEMENTAL ANALYSIS',
  'elements.heading': 'Elemental Health Insights',
  'elements.description': 'Each zodiac sign belongs to one of four elements, influencing your health tendencies and wellness needs',
  'elements.explore': 'Explore all elements',
  'elements.fire': 'Fire',
  'elements.earth': 'Earth',
  'elements.air': 'Air',
  'elements.water': 'Water',
  'elements.signs.fire': 'Fire Signs: Aries, Leo, Sagittarius',
  'elements.signs.earth': 'Earth Signs: Taurus, Virgo, Capricorn',
  'elements.signs.air': 'Air Signs: Gemini, Libra, Aquarius',
  'elements.signs.water': 'Water Signs: Cancer, Scorpio, Pisces',
  'elements.traits.fire': 'Dynamic, energetic, and passionate',
  'elements.traits.earth': 'Grounded, practical, and enduring',
  'elements.traits.air': 'Intellectual, communicative, and adaptable',
  'elements.traits.water': 'Emotional, intuitive, and nurturing',
  'elements.section.tendencies': 'Health Tendencies',
  'elements.section.recommendations': 'Wellness Recommendations',
  
  // User Settings
  'user.dashboard': 'Dashboard',
  'user.profile': 'Profile',
  'user.settings': 'Settings',
  
  // Theme
  'theme.dark': 'Dark Mode',
  'theme.light': 'Light Mode',
  
  // Achievement Badges
  'badge.new': 'NEW',
  'badge.earned': 'Earned',
  'badge.dialog.description': 'Continue your cosmic journey to unlock more achievements and discover deeper connections between your zodiac sign and wellness.',
  'badge.gallery.title': 'Achievement Gallery',
  'badge.section.new': 'New Achievements',
  'badge.category.all': 'All Badges',
  'badge.category.streak': 'Consistency Streaks',
  'badge.category.zodiac': 'Zodiac Mastery',
  'badge.category.wellness': 'Wellness Journey',
  'badge.category.element': 'Elemental Balance',
  'badge.category.cosmic': 'Cosmic Wisdom',
  
  'badge.streak.1.name': '7 Day Streak',
  'badge.streak.1.description': 'Completed 7 consecutive days of checking your horoscope.',
  'badge.streak.2.name': '30 Day Streak',
  'badge.streak.2.description': 'Completed 30 consecutive days of checking your horoscope.',
  'badge.streak.3.name': '90 Day Streak',
  'badge.streak.3.description': 'Completed 90 consecutive days of checking your horoscope. You\'re truly committed to your cosmic wellness journey!',
  
  'badge.zodiac.1.name': 'Sign Explorer',
  'badge.zodiac.1.description': 'Read the health insights for your zodiac sign and began your journey to astrological wellness.',
  'badge.zodiac.2.name': 'Zodiac Enthusiast',
  'badge.zodiac.2.description': 'Explored compatibility and health insights for three different zodiac signs.',
  
  'badge.wellness.1.name': 'Wellness Beginner',
  'badge.wellness.1.description': 'Started tracking your first wellness metric aligned with your zodiac sign.',
  
  'badge.element.1.name': 'Element Aligned',
  'badge.element.1.description': 'Discovered your elemental affinity and its impact on your health tendencies.',
  
  'badge.cosmic.1.name': 'Cosmic Novice',
  'badge.cosmic.1.description': 'Took your first steps into the world of astrological wellness with HoroscopeHealth.',
  
  // Dashboard
  'dashboard.title': 'Your Cosmic Wellness Dashboard',
  'dashboard.for': 'Personalized for',
  'dashboard.weather': 'Cosmic Weather',
  'dashboard.tab.today': 'Today',
  'dashboard.tab.week': 'This Week',
  'dashboard.tab.month': 'Monthly Forecast',
  'dashboard.horoscope.title': 'Your Daily Horoscope',
  'dashboard.horoscope.description': 'Cosmic insights tailored to your zodiac sign',
  'dashboard.widget.calendar': 'Cosmic Calendar',
  'dashboard.widget.metrics': 'Wellness Metrics',
  'dashboard.widget.element': 'Element Focus',
  'dashboard.widget.weekly': 'Weekly Overview',
  'dashboard.premium.locked': 'locked',
  'dashboard.premium.available': 'available',
  'dashboard.premium.view': 'View Full Report',
  'dashboard.premium.unlock': 'Unlock with Premium',
  'dashboard.premium.weekly.title': 'Unlock Weekly Forecasts',
  'dashboard.premium.weekly.description': 'Upgrade to Premium to access detailed weekly wellness forecasts tailored to your zodiac sign.',
  'dashboard.premium.monthly.title': 'Unlock Monthly Forecasts',
  'dashboard.premium.monthly.description': 'Upgrade to Premium for comprehensive monthly wellness forecasts and planning tools.',
  
  // Footer
  'footer.copyright': '© 2025 Horoscope Health. All rights reserved.',
  'footer.disclaimer': 'Disclaimer: The astrological insights provided on this website are for informational and entertainment purposes only and should not replace professional medical advice.',
  'footer.category.zodiac': 'Zodiac Signs',
  'footer.category.elements': 'Elements',
  'footer.category.resources': 'Resources',
  'footer.category.company': 'Company',
};

// Spanish translations
const esTranslations: Record<string, string> = {
  // Navigation
  'nav.home': 'Inicio',
  'nav.dashboard': 'Panel',
  'nav.zodiac': 'Biblioteca Zodiacal',
  'nav.elements': 'Elementos',
  'nav.marketplace': 'Mercado de Bienestar',
  'nav.about': 'Acerca de',
  'nav.science': 'Nuestra Ciencia',
  'nav.contact': 'Contacto',
  'nav.premium': 'Premium',
  'nav.login': 'Iniciar Sesión',
  'nav.signup': 'Registrarse',
  'nav.logout': 'Cerrar Sesión',
  'nav.account': 'Mi Cuenta',
  'nav.language': 'Idioma',
  
  // Hero Section
  'hero.tagline': 'Donde la Sabiduría Antigua se Une a la Ciencia Moderna',
  'hero.brand': 'HORÓSCOPO SALUD',
  'hero.brand.abbr': 'HS',
  'hero.title1': 'Tu Guía de Bienestar',
  'hero.title2': 'Cósmico Personalizado',
  'hero.description': 'Descubre cómo tu signo zodiacal influye en tus tendencias de salud y recibe recomendaciones de bienestar personalizadas basadas en tu perfil astrológico.',
  
  // Signup Form
  'signup.header': 'Comienza Tu Viaje Cósmico de Salud',
  'signup.title': 'Comienza Tu Viaje de Salud Personalizado',
  'signup.subtitle': 'Desbloquea Tu Potencial de Bienestar Cósmico',
  'signup.join': 'Únete a miles de personas que descubren su camino astrológico hacia una mejor salud',
  'signup.email.placeholder': 'Ingresa tu correo electrónico',
  'signup.benefit1': 'Consejos de salud personalizados diarios',
  'signup.benefit2': 'Consejos de bienestar alineados con tu elemento',
  'signup.benefit3': 'Pronósticos de salud astrológicos',
  'signup.benefit4': 'Rituales de autocuidado específicos de tu signo',
  'signup.benefits.insights': 'Consejos de salud personalizados diarios',
  'signup.benefits.wellness': 'Consejos de bienestar alineados con tu elemento',
  'signup.benefits.forecasts': 'Pronósticos de salud astrológicos',
  'signup.benefits.rituals': 'Rituales de autocuidado específicos de tu signo',
  'signup.button.loading': 'Creando Tu Perfil...',
  'signup.button': 'Revelar Mi Camino de Salud Cósmico',
  'signup.microcopy': 'No se requiere tarjeta de crédito • 100% gratis • Acceso instantáneo',
  'signup.testimonial': '"He obtenido conocimientos increíbles sobre las necesidades de mi cuerpo según mi signo" — Sara K.',
  'signup.profile': 'Tu Perfil de Salud Horoscópico',
  'signup.select': 'Selecciona tu signo zodiacal para comenzar',
  'signup.get': 'Obtener Mi Horóscopo',
  'signup.dashboard': 'Ir al Panel',
  
  // Zodiac Profile
  'zodiac.profile.title': 'Tu Perfil de Salud Horoscópico',
  'zodiac.profile.subtitle': 'Selecciona tu signo zodiacal para comenzar',
  'zodiac.profile.button': 'Obtener Mi Horóscopo',
  
  // Toast Notifications
  'toast.email.required.title': 'Correo Electrónico Requerido',
  'toast.email.required.description': 'Por favor ingresa tu correo electrónico para continuar',
  
  // Wellness Quote Widget
  'quote.title': 'INSPIRACIÓN DIARIA',
  'quote.heading': 'Tu Frase de Bienestar del Día',
  'quote.subheading': 'Sabiduría para guiar tu viaje de bienestar',
  'quote.select': 'Selecciona tu signo zodiacal arriba para recibir una frase de bienestar personalizada.',
  'quote.personalized': 'Tu Frase de Bienestar Personal',
  'quote.general': 'Frase de Bienestar del Día',
  'quote.refresh': 'Actualizar frase',
  
  // How It Works Section
  'how.title': 'CIENCIA SE UNE A LA ASTROLOGÍA',
  'how.heading': 'Cómo Funciona Horóscopo Salud',
  'how.description': 'Nuestra metodología única une la antigua sabiduría astrológica con la ciencia moderna de la salud',
  'how.card1.title': 'Análisis Astrológico',
  'how.card1.description': 'Analizamos la constitución elemental de tu signo zodiacal, los regentes planetarios y las asociaciones tradicionales de salud para comprender tus tendencias innatas.',
  'how.card2.title': 'Integración Científica',
  'how.card2.description': 'Nuestro equipo combina conocimientos astrológicos con investigación de bienestar basada en evidencia para crear recomendaciones que honran ambos sistemas.',
  'how.card3.title': 'Orientación Personalizada',
  'how.card3.description': 'Recibes horóscopos diarios con recomendaciones específicas de salud y bienestar adaptadas a la constitución única de tu signo y las influencias celestiales actuales.',
  
  // User Settings
  'user.dashboard': 'Panel',
  'user.profile': 'Perfil',
  'user.settings': 'Configuración',
  
  // Theme
  'theme.dark': 'Modo Oscuro',
  'theme.light': 'Modo Claro',
  
  // Achievement Badges
  'badge.new': 'NUEVO',
  'badge.earned': 'Obtenido',
  'badge.dialog.description': 'Continúa tu viaje cósmico para desbloquear más logros y descubrir conexiones más profundas entre tu signo zodiacal y el bienestar.',
  'badge.gallery.title': 'Galería de Logros',
  'badge.section.new': 'Nuevos Logros',
  'badge.category.all': 'Todas las Insignias',
  'badge.category.streak': 'Rachas de Consistencia',
  'badge.category.zodiac': 'Maestría Zodiacal',
  'badge.category.wellness': 'Viaje de Bienestar',
  'badge.category.element': 'Equilibrio Elemental',
  'badge.category.cosmic': 'Sabiduría Cósmica',
  
  'badge.streak.1.name': 'Racha de 7 Días',
  'badge.streak.1.description': 'Completaste 7 días consecutivos verificando tu horóscopo.',
  'badge.streak.2.name': 'Racha de 30 Días',
  'badge.streak.2.description': 'Completaste 30 días consecutivos verificando tu horóscopo.',
  'badge.streak.3.name': 'Racha de 90 Días',
  'badge.streak.3.description': 'Completaste 90 días consecutivos verificando tu horóscopo. ¡Estás verdaderamente comprometido con tu viaje de bienestar cósmico!',
  
  'badge.zodiac.1.name': 'Explorador de Signos',
  'badge.zodiac.1.description': 'Leíste los conocimientos de salud para tu signo zodiacal y comenzaste tu viaje hacia el bienestar astrológico.',
  'badge.zodiac.2.name': 'Entusiasta Zodiacal',
  'badge.zodiac.2.description': 'Exploraste compatibilidad y conocimientos de salud para tres signos zodiacales diferentes.',
  
  'badge.wellness.1.name': 'Principiante de Bienestar',
  'badge.wellness.1.description': 'Comenzaste a seguir tu primera métrica de bienestar alineada con tu signo zodiacal.',
  
  'badge.element.1.name': 'Alineado con Elementos',
  'badge.element.1.description': 'Descubriste tu afinidad elemental y su impacto en tus tendencias de salud.',
  
  'badge.cosmic.1.name': 'Novato Cósmico',
  'badge.cosmic.1.description': 'Diste tus primeros pasos en el mundo del bienestar astrológico con HoroscopeHealth.',
  
  // Premium Section
  'premium.badge': 'Membresía Premium',
  'premium.title': 'Eleva Tu Viaje de Bienestar',
  'premium.description': 'Desbloquea conocimientos de salud astrológicos más profundos con nuestra membresía premium, diseñada para aquellos que buscan una guía integral de bienestar.',
  'premium.benefit1': 'Informes semanales detallados de bienestar basados en tu perfil astrológico específico',
  'premium.benefit2': 'Recomendaciones personalizadas de ejercicio y nutrición',
  'premium.benefit3': 'Acceso exclusivo a contenido premium e informes mensuales especiales',
  'premium.button': 'Actualizar a Premium',
  'premium.pricing.title': 'Plan Mensual',
  'premium.pricing.price': '$9.99',
  'premium.pricing.period': '/mes',
  'premium.pricing.feature1': 'Acceso completo a todas las funciones',
  'premium.pricing.feature2': 'Informes premium semanales',
  'premium.pricing.feature3': 'Cancela cuando quieras',
  'premium.pricing.button': 'Suscríbete Ahora',
  'premium.methodology': 'Conoce Nuestra Metodología',
  'premium.label': 'Premium',
  'premium.features': 'Funciones Premium',
  'premium.upgrade': 'Actualizar a Premium',
  
  // Elements Section
  'elements.title': 'ANÁLISIS ELEMENTAL',
  'elements.heading': 'Conocimientos de Salud Elemental',
  'elements.description': 'Cada signo zodiacal pertenece a uno de los cuatro elementos, influyendo en tus tendencias de salud y necesidades de bienestar',
  'elements.explore': 'Explorar todos los elementos',
  'elements.fire': 'Fuego',
  'elements.earth': 'Tierra',
  'elements.air': 'Aire',
  'elements.water': 'Agua',
  'elements.signs.fire': 'Signos de Fuego: Aries, Leo, Sagitario',
  'elements.signs.earth': 'Signos de Tierra: Tauro, Virgo, Capricornio',
  'elements.signs.air': 'Signos de Aire: Géminis, Libra, Acuario',
  'elements.signs.water': 'Signos de Agua: Cáncer, Escorpio, Piscis',
  'elements.traits.fire': 'Dinámicos, enérgicos y apasionados',
  'elements.traits.earth': 'Arraigados, prácticos y perdurables',
  'elements.traits.air': 'Intelectuales, comunicativos y adaptables',
  'elements.traits.water': 'Emocionales, intuitivos y nutricios',
  'elements.section.tendencies': 'Tendencias de Salud',
  'elements.section.recommendations': 'Recomendaciones de Bienestar',
  
  // Dashboard
  'dashboard.title': 'Tu Panel de Bienestar Cósmico',
  'dashboard.for': 'Personalizado para',
  'dashboard.weather': 'Clima Cósmico',
  'dashboard.tab.today': 'Hoy',
  'dashboard.tab.week': 'Esta Semana',
  'dashboard.tab.month': 'Pronóstico Mensual',
  'dashboard.horoscope.title': 'Tu Horóscopo Diario',
  'dashboard.horoscope.description': 'Conocimientos cósmicos adaptados a tu signo zodiacal',
  'dashboard.widget.calendar': 'Calendario Cósmico',
  'dashboard.widget.metrics': 'Métricas de Bienestar',
  'dashboard.widget.element': 'Enfoque Elemental',
  'dashboard.widget.weekly': 'Resumen Semanal',
  'dashboard.premium.locked': 'bloqueado',
  'dashboard.premium.available': 'disponible',
  'dashboard.premium.view': 'Ver Informe Completo',
  'dashboard.premium.unlock': 'Desbloquear con Premium',
  'dashboard.premium.weekly.title': 'Desbloquea Pronósticos Semanales',
  'dashboard.premium.weekly.description': 'Actualiza a Premium para acceder a pronósticos de bienestar semanales detallados adaptados a tu signo zodiacal.',
  'dashboard.premium.monthly.title': 'Desbloquea Pronósticos Mensuales',
  'dashboard.premium.monthly.description': 'Actualiza a Premium para obtener pronósticos de bienestar mensuales completos y herramientas de planificación.',
  
  // Footer
  'footer.copyright': '© 2025 Horóscopo Salud. Todos los derechos reservados.',
  'footer.disclaimer': 'Aviso legal: Los conocimientos astrológicos proporcionados en este sitio web son solo para fines informativos y de entretenimiento y no deben reemplazar el consejo médico profesional.',
  'footer.category.zodiac': 'Signos Zodiacales',
  'footer.category.elements': 'Elementos',
  'footer.category.resources': 'Recursos',
  'footer.category.company': 'Empresa',
};

// Combined translations
const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  es: esTranslations,
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};