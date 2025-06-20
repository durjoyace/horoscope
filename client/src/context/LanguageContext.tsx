import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
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
  'nav.wellnessTips': 'Wellness Tips',
  'nav.login': 'Login',
  'nav.signup': 'Sign Up',
  'nav.logout': 'Logout',
  'nav.account': 'My Account',
  'nav.language': 'Language',
  
  // Hero Section
  'hero.tagline': 'Evidence-Based Wellness with Astrological Insights',
  'hero.brand': 'HOROSCOPE HEALTH',
  'hero.brand.abbr': 'HH',
  'hero.title1': 'Your Personalized',
  'hero.title2': 'Cosmic Wellness Guide',
  'hero.description': 'Discover how your zodiac sign influences your health tendencies and receive personalized wellness recommendations based on your astrological profile.',
  
  // Signup Form
  'signup.header': 'Start Your Cosmic Health Journey',
  'signup.title': 'Start Your Personalized Health Journey',
  'signup.subtitle': 'Unlock Your Cosmic Wellness Potential',
  'signup.join': 'Join thousands discovering their astrological path to better health',
  'signup.email.placeholder': 'Enter your email address',
  'signup.benefit1': 'Daily personalized health insights',
  'signup.benefit2': 'Element-aligned wellness tips',
  'signup.benefit3': 'Astrological health forecasts',
  'signup.benefit4': 'Sign-specific self-care rituals',
  'signup.benefits.insights': 'Daily personalized health insights',
  'signup.benefits.wellness': 'Element-aligned wellness tips',
  'signup.benefits.forecasts': 'Astrological health forecasts',
  'signup.benefits.rituals': 'Sign-specific self-care rituals',
  'signup.button.loading': 'Creating Your Profile...',
  'signup.button': 'Get Started',
  'signup.microcopy': 'No credit card required • Instant access • No spam',
  'signup.testimonial': '"I\'ve gained incredible insights into my body\'s needs based on my sign" — Sarah K.',
  'signup.profile': 'Your Horoscope Health Profile',
  'signup.select': 'Select your zodiac sign to get started',
  'signup.get': 'Get My Horoscope',
  'signup.dashboard': 'Go to Dashboard',
  
  // Community
  'community.title': 'Community',
  'community.forum': 'Forum',
  'community.backToForum': 'Back to Forum',
  'community.createNewTopic': 'Create New Topic',
  'community.shareThoughts': 'Share your thoughts with the {sign} community',
  'community.shareThoughtsPlaceholder': 'Share your thoughts...',
  'community.postTopic': 'Post Topic',
  'community.postReply': 'Post Reply',
  'community.replyToTopic': 'Reply to this topic',
  'community.views': 'views',
  'community.replies': 'replies',
  'community.likes': 'likes',
  'community.noRepliesYet': 'No Replies Yet',
  'community.user': 'User {id}',
  'community.emptyReply': 'Empty Reply',
  'community.enterContent': 'Please enter some content for your reply',
  'community.loadMore': 'Load More',
  'community.selectCategory': 'Select Category',
  'community.allCategories': 'All Categories',
  'community.topics': 'Topics',
  'community.pinned': 'Pinned',
  'community.editTopic': 'Edit Topic',
  'community.deleteTopic': 'Delete Topic',
  'community.editReply': 'Edit Reply',
  'community.deleteReply': 'Delete Reply',
  'community.community': 'Community',
  'community.connect': 'Connect with fellow members to share insights and experiences',
  'community.newTopic': 'New Topic',
  'community.all': 'All',
  'community.description': 'Connect with others who share your zodiac sign. Discuss sign-specific wellness topics, share experiences, and get personalized advice tailored to your astrological profile.',
  'community.your': 'Your',
  'community.personal': 'Your personalized community based on your zodiac sign',
  'community.recommendation': 'Recommended topics and discussions tailored specifically for',
  'community.enter': 'Enter Your Community',
  'community.view': 'View Community',
  'community.members': 'Members',
  
  // Zodiac Sign Brief Descriptions for Community
  'zodiac.aries.brief': 'Dynamic Aries community for wellness and motivation discussions',
  'zodiac.taurus.brief': 'Grounded Taurus community for holistic wellness discussions',
  'zodiac.gemini.brief': 'Versatile Gemini community for mental wellness discussions',
  'zodiac.cancer.brief': 'Nurturing Cancer community for emotional wellness discussions',
  'zodiac.leo.brief': 'Vibrant Leo community for confidence and wellness discussions',
  'zodiac.virgo.brief': 'Analytical Virgo community for health optimization discussions',
  'zodiac.libra.brief': 'Balanced Libra community for harmony and wellness discussions',
  'zodiac.scorpio.brief': 'Intense Scorpio community for transformative wellness discussions',
  'zodiac.sagittarius.brief': 'Adventurous Sagittarius community for holistic wellness discussions',
  'zodiac.capricorn.brief': 'Disciplined Capricorn community for structured wellness discussions',
  'zodiac.aquarius.brief': 'Innovative Aquarius community for progressive wellness discussions',
  'zodiac.pisces.brief': 'Intuitive Pisces community for spiritual wellness discussions',
  
  // Auth messages
  'auth.authRequired': 'Authentication Required',
  'auth.loginToReply': 'Please log in to reply to topics',
  'auth.loginToLike': 'Please log in to like topics',
  'auth.loginToLikeReplies': 'Please log in to like replies',
  'auth.loginToPost': 'Please log in to create topics',
  
  // Features Section
  'features.heading': 'Personalized Wellness Features',
  'features.subheading': 'Our platform combines astrological insights with evidence-based wellness approaches to create a truly personalized experience.',
  'features.personalized.title': 'Personalized Analysis',
  'features.personalized.desc': 'Get wellness recommendations tailored to your zodiac profile and personal needs.',
  'features.mental.title': 'Mental Wellness',
  'features.mental.desc': 'Discover mindfulness and stress-reduction techniques aligned with your zodiac traits.',
  'features.alignment.title': 'Cosmic Alignment',
  'features.alignment.desc': 'Sync your wellness routines with astrological patterns for optimal results.',
  'features.physical.title': 'Physical Wellness',
  'features.physical.desc': 'Exercise and movement recommendations tailored to your zodiac strengths.',
  
  // Premium
  'premium.title': 'Premium Horoscope Health',
  'premium.subtitle': 'Unlock your complete cosmic wellness potential',
  'premium.monthly.title': 'Monthly Plan',
  'premium.monthly.price': '$19.99',
  'premium.monthly.period': 'per month',
  'premium.annual.title': 'Annual Plan',
  'premium.annual.price': '$89.91',
  'premium.annual.period': 'per year',
  'premium.annual.savings': 'Save 25%',
  'premium.features.reports': 'Detailed weekly reports',
  'premium.features.forecasts': 'Monthly forecasts',
  'premium.features.support': 'Priority support',
  'premium.features.exclusive': 'Exclusive content',
  'premium.cta': 'Start Now',
  
  // Marketplace
  'marketplace.title': 'Wellness Marketplace',
  'marketplace.subtitle': 'Cosmically curated wellness products',
  'marketplace.cosmic_curation': 'Our Cosmic Curation',
  'marketplace.no_products': 'No products found',
  'marketplace.adjust_filters': 'Try adjusting your search or filter criteria',
  'marketplace.clear_filters': 'Clear Filters',
  'marketplace.featured_brands': 'Featured Premium Brands',
  'marketplace.showing_results': 'Showing {start}-{end} of {total} products',
  'marketplace.filtered_from': '(filtered from {total} total)',
  
  // Pagination
  'pagination.previous': 'Previous',
  'pagination.next': 'Next',
  'pagination.page': 'Page',
  'pagination.of': 'of',
  
  // Footer
  'footer.company': 'Battle Green Consulting LLC',
  'footer.disclaimer': 'Legal Disclaimer: The astrological insights provided on this website are for informational and entertainment purposes only and should not replace professional medical advice.',
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
  'nav.wellnessTips': 'Consejos de Bienestar',
  'nav.login': 'Iniciar Sesión',
  'nav.signup': 'Registrarse',
  'nav.logout': 'Cerrar Sesión',
  'nav.account': 'Mi Cuenta',
  'nav.language': 'Idioma',
  
  // Hero Section
  'hero.tagline': 'Bienestar Basado en Evidencia con Conocimientos Astrológicos',
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
  'signup.button': 'Comenzar',
  'signup.microcopy': 'No se requiere tarjeta de crédito • Acceso instantáneo • Sin spam',
  'signup.testimonial': '"He obtenido conocimientos increíbles sobre las necesidades de mi cuerpo según mi signo" — Sara K.',
  'signup.profile': 'Tu Perfil de Salud Horoscópico',
  'signup.select': 'Selecciona tu signo zodiacal para comenzar',
  'signup.get': 'Obtener Mi Horóscopo',
  'signup.dashboard': 'Ir al Panel',
  
  // Community
  'community.title': 'Comunidad',
  'community.forum': 'Foro',
  'community.backToForum': 'Volver al Foro',
  'community.createNewTopic': 'Crear Nuevo Tema',
  'community.shareThoughts': 'Comparte tus pensamientos con la comunidad de {sign}',
  'community.shareThoughtsPlaceholder': 'Comparte tus pensamientos...',
  'community.postTopic': 'Publicar Tema',
  'community.postReply': 'Publicar Respuesta',
  'community.replyToTopic': 'Responder a este tema',
  'community.views': 'vistas',
  'community.replies': 'respuestas',
  'community.likes': 'me gusta',
  'community.noRepliesYet': 'Aún No Hay Respuestas',
  'community.user': 'Usuario {id}',
  'community.emptyReply': 'Respuesta Vacía',
  'community.enterContent': 'Por favor ingresa contenido para tu respuesta',
  'community.loadMore': 'Cargar Más',
  'community.selectCategory': 'Seleccionar Categoría',
  'community.allCategories': 'Todas las Categorías',
  'community.topics': 'Temas',
  'community.pinned': 'Destacado',
  'community.editTopic': 'Editar Tema',
  'community.deleteTopic': 'Eliminar Tema',
  'community.editReply': 'Editar Respuesta',
  'community.deleteReply': 'Eliminar Respuesta',
  'community.community': 'Comunidad',
  'community.connect': 'Conéctate con otros miembros para compartir ideas y experiencias',
  'community.newTopic': 'Nuevo Tema',
  'community.all': 'Todos',
  'community.description': 'Conéctate con otras personas que comparten tu signo zodiacal. Discute temas de bienestar específicos para tu signo, comparte experiencias y obtén consejos personalizados adaptados a tu perfil astrológico.',
  'community.your': 'Tu',
  'community.personal': 'Tu comunidad personalizada basada en tu signo zodiacal',
  'community.recommendation': 'Temas y discusiones recomendados específicamente para',
  'community.enter': 'Entrar a Tu Comunidad',
  'community.view': 'Ver Comunidad',
  'community.members': 'Miembros',
  
  // Zodiac Sign Brief Descriptions for Community
  'zodiac.aries.brief': 'Comunidad dinámica de Aries para discusiones sobre bienestar y motivación',
  'zodiac.taurus.brief': 'Comunidad centrada de Tauro para discusiones sobre bienestar holístico',
  'zodiac.gemini.brief': 'Comunidad versátil de Géminis para discusiones sobre bienestar mental',
  'zodiac.cancer.brief': 'Comunidad nutricia de Cáncer para discusiones sobre bienestar emocional',
  'zodiac.leo.brief': 'Comunidad vibrante de Leo para discusiones sobre confianza y bienestar',
  'zodiac.virgo.brief': 'Comunidad analítica de Virgo para discusiones sobre optimización de la salud',
  'zodiac.libra.brief': 'Comunidad equilibrada de Libra para discusiones sobre armonía y bienestar',
  'zodiac.scorpio.brief': 'Comunidad intensa de Escorpio para discusiones sobre bienestar transformador',
  'zodiac.sagittarius.brief': 'Comunidad aventurera de Sagitario para discusiones sobre bienestar holístico',
  'zodiac.capricorn.brief': 'Comunidad disciplinada de Capricornio para discusiones sobre bienestar estructurado',
  'zodiac.aquarius.brief': 'Comunidad innovadora de Acuario para discusiones sobre bienestar progresivo',
  'zodiac.pisces.brief': 'Comunidad intuitiva de Piscis para discusiones sobre bienestar espiritual',
  
  // Auth messages
  'auth.authRequired': 'Autenticación Requerida',
  'auth.loginToReply': 'Por favor inicia sesión para responder a los temas',
  'auth.loginToLike': 'Por favor inicia sesión para dar me gusta a los temas',
  'auth.loginToLikeReplies': 'Por favor inicia sesión para dar me gusta a las respuestas',
  'auth.loginToPost': 'Por favor inicia sesión para crear temas',
  
  // Features Section
  'features.heading': 'Características de Bienestar Personalizadas',
  'features.subheading': 'Nuestra plataforma combina conocimientos astrológicos con enfoques de bienestar basados en evidencia para crear una experiencia verdaderamente personalizada.',
  'features.personalized.title': 'Análisis Personalizado',
  'features.personalized.desc': 'Obtén recomendaciones de bienestar adaptadas a tu perfil zodiacal y necesidades personales.',
  'features.mental.title': 'Bienestar Mental',
  'features.mental.desc': 'Descubre técnicas de atención plena y reducción del estrés alineadas con tus rasgos zodiacales.',
  'features.alignment.title': 'Alineación Cósmica',
  'features.alignment.desc': 'Sincroniza tus rutinas de bienestar con patrones astrológicos para obtener resultados óptimos.',
  'features.physical.title': 'Bienestar Físico',
  'features.physical.desc': 'Recomendaciones de ejercicio y movimiento adaptadas a tus fortalezas zodiacales.',
  
  // Premium
  'premium.title': 'Premium Horóscopo Salud',
  'premium.subtitle': 'Desbloquea tu potencial completo de bienestar cósmico',
  'premium.monthly.title': 'Plan Mensual',
  'premium.monthly.price': '$19.99',
  'premium.monthly.period': 'por mes',
  'premium.annual.title': 'Plan Anual',
  'premium.annual.price': '$89.91',
  'premium.annual.period': 'por año',
  'premium.annual.savings': 'Ahorra 25%',
  'premium.features.reports': 'Informes semanales detallados',
  'premium.features.forecasts': 'Pronósticos mensuales',
  'premium.features.support': 'Soporte prioritario',
  'premium.features.exclusive': 'Contenido exclusivo',
  'premium.cta': 'Comenzar Ahora',
  
  // Marketplace
  'marketplace.title': 'Mercado de Bienestar',
  'marketplace.subtitle': 'Productos de bienestar curados cósmicamente',
  'marketplace.cosmic_curation': 'Nuestra Curación Cósmica',
  'marketplace.no_products': 'No se encontraron productos',
  'marketplace.adjust_filters': 'Intenta ajustar tus criterios de búsqueda o filtros',
  'marketplace.clear_filters': 'Limpiar Filtros',
  'marketplace.featured_brands': 'Marcas Premium Destacadas',
  'marketplace.showing_results': 'Mostrando {start}-{end} de {total} productos',
  'marketplace.filtered_from': '(filtrado de {total} total)',
  
  // Pagination
  'pagination.previous': 'Anterior',
  'pagination.next': 'Siguiente',
  'pagination.page': 'Página',
  'pagination.of': 'de',
  
  // Footer
  'footer.company': 'Battle Green Consulting LLC',
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

  const t = (key: string, params?: Record<string, string>): string => {
    let translatedText = translations[language][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translatedText = translatedText.replace(`{${paramKey}}`, paramValue);
      });
    }
    
    return translatedText;
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