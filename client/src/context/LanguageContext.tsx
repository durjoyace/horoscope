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
  // Pagination
  'pagination.previous': 'Previous',
  'pagination.next': 'Next',
  'pagination.page': 'Page',
  'pagination.of': 'of',
  
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
  'hero.title2': 'Wellness Optimization',
  'hero.description': 'Receive data-driven wellness recommendations enhanced by astrological insights to create personalized health routines aligned with your natural tendencies.',
  
  // Signup Form
  'signup.header': 'Begin Your Personalized Wellness Journey',
  'signup.title': 'Start Your Wellness Optimization',
  'signup.subtitle': 'Personalized Health Insights Based on Your Profile',
  'signup.join': 'Join thousands improving their health with personalized wellness insights',
  'signup.email.placeholder': 'Enter your email address',
  'signup.benefit1': 'Data-driven health recommendations',
  'signup.benefit2': 'Personalized wellness routines',
  'signup.benefit3': 'Evidence-based health insights',
  'signup.benefit4': 'Tailored self-care protocols',
  'signup.benefits.insights': 'Data-driven health recommendations',
  'signup.benefits.wellness': 'Personalized wellness routines',
  'signup.benefits.forecasts': 'Evidence-based health insights',
  'signup.benefits.rituals': 'Tailored self-care protocols',
  'signup.button.loading': 'Creating Your Profile...',
  'signup.button': 'Get My Personalized Plan',
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
  'how.title': 'WELLNESS METHODOLOGY',
  'how.heading': 'How Horoscope Health Works',
  'how.description': 'Our evidence-based wellness platform integrates established health science with astrological insights for comprehensive personalization',
  'how.card1.title': 'Personalized Analysis',
  'how.card1.description': 'We create your unique profile based on your preferences, tendencies, and astrological indicators to identify your natural wellness inclinations.',
  'how.card2.title': 'Evidence-Based Approach',
  'how.card2.description': 'Our team develops recommendations grounded in peer-reviewed wellness research, supplemented with astrological insights that enhance personalization.',
  'how.card3.title': 'Adaptive Optimization',
  'how.card3.description': 'You receive daily wellness recommendations tailored to your unique profile, with personalized health insights that adapt based on your feedback and preferences.',
  
  // Premium Section
  'premium.badge': 'Premium Membership',
  'premium.title': 'Advanced Wellness Optimization',
  'premium.description': 'Enhance your personalized wellness experience with advanced data-driven insights and tailored health protocols.',
  'premium.benefit1': 'Weekly comprehensive wellness reports with detailed action plans',
  'premium.benefit2': 'Personalized nutrition and fitness recommendations based on your profile',
  'premium.benefit3': 'Access to expert-reviewed content and evidence-based health protocols',
  'premium.button': 'Upgrade to Premium',
  'premium.heading': 'Advanced Wellness Integration',
  // Premium Features
  'premium.features': 'Premium Features',
  'premium.features.weekly': 'Weekly in-depth health reports',
  'premium.features.compatibility': 'Compatibility insights',
  'premium.features.career': 'Career wellness guidance',
  'premium.features.health': 'Personalized health protocols',
  'premium.features.rituals': 'Custom wellness rituals',
  'premium.features.support': 'Priority wellness support',
  // Preview section
  'premium.preview.title': 'Weekly Health Report Preview',
  'premium.preview.subtitle': 'Sample of your personalized premium content',
  'premium.preview.section1.title': 'Physical Wellness Focus',
  'premium.preview.section1.content': 'Your cosmic alignment this week suggests focusing on joint mobility and flexibility exercises for optimal physical wellness.',
  'premium.preview.section2.title': 'Mental Balance Recommendation',
  'premium.preview.section2.content': 'The current planetary positions indicate a need for mindfulness practices to maintain emotional equilibrium.',
  'premium.preview.note': 'Unlock full reports with premium membership',
  // For pricing box
  'premium.plan.title': 'Monthly Plan',
  'premium.plan.period': '/month',
  'premium.plan.feature1': 'Full access to all features',
  'premium.plan.feature2': 'Weekly premium reports',
  'premium.plan.feature3': 'Cancel anytime',
  'premium.plan.button': 'Subscribe Now',
  // Keep legacy keys for backward compatibility
  'premium.pricing.title': 'Monthly Plan',
  'premium.pricing.price': '$9.99',
  'premium.pricing.period': '/month',
  'premium.pricing.feature1': 'Full access to all features',
  'premium.pricing.feature2': 'Weekly premium reports',
  'premium.pricing.feature3': 'Cancel anytime',
  'premium.pricing.button': 'Subscribe Now',
  'premium.methodology': 'Learn About Our Methodology',
  'premium.label': 'Premium',
  'premium.upgrade': 'Upgrade to Premium',
  
  // Methodology section
  'methodology.button': 'Learn About Our Methodology',
  
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
  'theme.title': 'Theme',
  'theme.dark': 'Dark Mode',
  'theme.light': 'Light Mode',
  
  // Onboarding Wizard
  'onboarding.welcome.title': 'Welcome to Horoscope Health',
  'onboarding.welcome.description': 'Discover your cosmic wellness journey',
  'onboarding.welcome.intro': 'Let\'s get started by discovering your zodiac sign and creating your personalized wellness profile.',
  'onboarding.welcome.feature1.title': 'Personalized Insights',
  'onboarding.welcome.feature1.description': 'Get daily wellness recommendations based on your unique astrological profile.',
  'onboarding.welcome.feature2.title': 'Cosmic Journey',
  'onboarding.welcome.feature2.description': 'Track your progress and earn achievements as you explore your cosmic wellness path.',
  'onboarding.welcome.start': 'Start Your Journey',
  
  'onboarding.quiz.step': 'Step',
  'onboarding.quiz.instruction': 'Choose the option that best describes you.',
  'onboarding.quiz.back': 'Back',
  'onboarding.quiz.next': 'Next',
  'onboarding.quiz.finish': 'See Results',
  
  'onboarding.result.title': 'Your Zodiac Match',
  'onboarding.result.description': 'Based on your personality traits, we\'ve identified your likely zodiac sign.',
  'onboarding.result.element': 'Element',
  'onboarding.result.question': 'Is this your zodiac sign? If not, select the correct one:',
  'onboarding.result.back': 'Retake Quiz',
  'onboarding.result.continue': 'Continue',
  
  'onboarding.profile.title': 'Complete Your Profile',
  'onboarding.profile.description': 'Just a few more details to personalize your cosmic wellness journey.',
  'onboarding.profile.email': 'Email Address',
  'onboarding.profile.firstName': 'First Name',
  'onboarding.profile.lastName': 'Last Name',
  'onboarding.profile.birthDate': 'Birth Date',
  'onboarding.profile.referralCode': 'Referral Code',
  'onboarding.profile.referralDescription': 'If someone referred you, enter their code to earn bonus features.',
  'onboarding.profile.back': 'Back',
  'onboarding.profile.complete': 'Complete Setup',
  
  'onboarding.submitting.title': 'Creating Your Cosmic Profile',
  'onboarding.submitting.description': 'Please wait while we align the stars for your personalized experience...',
  
  'onboarding.success.title': 'Welcome to Your Cosmic Wellness Journey!',
  'onboarding.success.description': 'Your profile has been created successfully.',
  
  'onboarding.error.title': 'Something Went Wrong',
  'onboarding.error.description': 'We couldn\'t complete your registration. Please try again.',
  
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
  
  // Journey Section
  'journey.badge': 'PERSONALIZED EXPERIENCE',
  'journey.title': 'Start Your Cosmic Wellness Journey',
  'journey.description': 'Embark on a personalized journey through the cosmic influences on your wellbeing with our intuitive onboarding process.',
  'journey.step1.title': 'Discover Your Zodiac Profile',
  'journey.step1.description': 'Take our personality quiz to confirm your zodiac sign and unique cosmic wellness traits.',
  'journey.step2.title': 'Unlock Your Star Map',
  'journey.step2.description': 'Receive a detailed analysis of how celestial bodies influence your health and wellbeing.',
  'journey.step3.title': 'Personalized Guidance',
  'journey.step3.description': 'Get tailored wellness recommendations and daily rituals based on your astrological profile.',
  
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
  
  // Wellness Tips
  'tips.title': 'Wellness Tip',
  'tips.daily': 'Daily Tip',
  'tips.close': 'Close',
  'tips.next': 'Next Tip',
  'tips.save': 'Save Tip',
  'tips.share': 'Share Tip',
  'tips.category.nutrition': 'Nutrition',
  'tips.category.exercise': 'Exercise',
  'tips.category.mindfulness': 'Mindfulness',
  'tips.category.sleep': 'Sleep',
  'tips.category.hydration': 'Hydration',
  'tips.personalized': 'Personalized for your cosmic profile',
  'tips.element': 'Element',
  'tips.zodiac': 'Zodiac',
  'tips.universal': 'Universal',
  'tips.savedTitle': 'Tip Saved',
  'tips.savedDescription': 'This wellness tip has been saved to your collection.',
  'tips.alreadySavedTitle': 'Already Saved',
  'tips.alreadySavedDescription': 'This wellness tip is already in your collection.',
  'tips.copiedTitle': 'Copied to Clipboard',
  'tips.copiedDescription': 'The wellness tip has been copied to clipboard.',
  'tips.removedTitle': 'Tip Removed',
  'tips.removedDescription': 'The wellness tip has been removed from your collection.',
  'tips.savedCollection': 'Saved Wellness Tips',
  'tips.noSavedTitle': 'No Saved Tips',
  
  // Features Section
  'features.heading': 'Personalized Wellness Features',
  'features.subheading': 'Our platform combines astrological insights with evidence-based wellness approaches to create a truly personalized experience.',
  
  // Features - Personalized
  'features.personalized.title': 'Personalized Analysis',
  'features.personalized.desc': 'Get wellness recommendations tailored to your zodiac profile and personal needs.',
  'features.personalized.detail.title1': 'Your Cosmic Profile',
  'features.personalized.detail.content1': 'Our algorithm analyzes your zodiac sign\'s elemental properties and planetary influences to identify your natural wellness tendencies.',
  'features.personalized.detail.title2': 'Personalized Recommendations',
  'features.personalized.detail.content2': 'Receive daily wellness suggestions that align with your cosmic profile and adapt to your feedback over time.',
  
  // Features - Mental
  'features.mental.title': 'Mental Wellness',
  'features.mental.desc': 'Discover mindfulness and stress-reduction techniques aligned with your zodiac traits.',
  'features.mental.detail.title1': 'Sign-Specific Mindfulness',
  'features.mental.detail.content1': 'Access meditation and mindfulness practices designed to complement your zodiac sign\'s natural mental patterns.',
  'features.mental.detail.title2': 'Stress Response Insights',
  'features.mental.detail.content2': 'Learn how your sign typically responds to stress and discover targeted techniques to maintain mental balance.',
  
  // Features - Alignment
  'features.alignment.title': 'Cosmic Alignment',
  'features.alignment.desc': 'Sync your wellness routines with astrological patterns for optimal results.',
  'features.alignment.detail.title1': 'Planetary Timing',
  'features.alignment.detail.content1': 'Time your wellness activities to align with favorable planetary positions for your sign.',
  'features.alignment.detail.title2': 'Seasonal Adaptation',
  'features.alignment.detail.content2': 'Adjust your health practices according to seasonal changes that particularly affect your zodiac element.',
  
  // Features - Physical
  'features.physical.title': 'Physical Wellness',
  'features.physical.desc': 'Exercise and movement recommendations tailored to your zodiac strengths.',
  'features.physical.detail.title1': 'Element-Based Activity',
  'features.physical.detail.content1': 'Discover physical activities that complement your zodiac element\'s natural energy patterns.',
  'features.physical.detail.title2': 'Strength Optimization',
  'features.physical.detail.content2': 'Focus on exercises that enhance your sign\'s natural physical strengths while addressing potential weaknesses.',
  
  // Features - Holistic
  'features.holistic.title': 'Holistic Integration',
  'features.holistic.desc': 'Connect mind, body, and cosmic influences for complete wellness.',
  'features.holistic.detail.title1': 'Whole-Being Approach',
  'features.holistic.detail.content1': 'Our recommendations integrate physical, mental, and spiritual practices specific to your zodiac profile.',
  'features.holistic.detail.title2': 'Elemental Balance',
  'features.holistic.detail.content2': 'Learn techniques to balance your dominant element with complementary practices from other elemental domains.',
  
  // Features - Daily
  'features.daily.title': 'Daily Guidance',
  'features.daily.desc': 'Receive daily horoscope readings with actionable wellness advice.',
  'features.daily.detail.title1': 'Daily Horoscope',
  'features.daily.detail.content1': 'Start each day with insights about cosmic influences affecting your sign and how they might impact your wellbeing.',
  'features.daily.detail.title2': 'Practical Recommendations',
  'features.daily.detail.content2': 'Get specific, actionable wellness suggestions tailored to the day\'s astrological forecast for your sign.',
  
  // Gift Page
  'gift.title': 'Cosmic Wellness Gift Cards',
  'gift.subtitle': 'Share the gift of personalized astrological wellness with someone special.',
  'gift.monthly.title': 'Monthly Premium Gift',
  'gift.monthly.subtitle': 'Perfect for a cosmic wellness introduction',
  'gift.monthly.price': '$9.99',
  'gift.monthly.period': 'for one month',
  'gift.monthly.feature1': 'One month of Premium membership',
  'gift.monthly.feature2': 'Weekly in-depth health reports',
  'gift.monthly.feature3': 'Personalized wellness recommendations',
  'gift.monthly.button': 'Purchase Gift Card',
  'gift.annual.title': 'Annual Premium Gift',
  'gift.annual.subtitle': 'A full year of cosmic wellness guidance',
  'gift.annual.price': '$89.99',
  'gift.annual.period': 'for one year',
  'gift.annual.saving': 'Save $29.89',
  'gift.annual.feature1': 'Full year of Premium membership',
  'gift.annual.feature2': 'Priority wellness support',
  'gift.annual.feature3': 'Exclusive seasonal cosmic reports',
  'gift.annual.button': 'Purchase Gift Card',
  'gift.how.title': 'How Gift Cards Work',
  'gift.how.step1': 'Purchase a gift card for your recipient',
  'gift.how.step2': 'Receive a unique code and customizable digital card via email',
  'gift.how.step3': 'Share the code with your recipient',
  'gift.how.step4': 'Your recipient redeems the code during signup or from their account settings',
  
  // Features - Insights
  'features.insights.title': 'Wellness Insights',
  'features.insights.desc': 'Gain deeper understanding of your health patterns through astrological analysis.',
  'features.insights.detail.title1': 'Pattern Recognition',
  'features.insights.detail.content1': 'Identify recurring wellness challenges related to your zodiac sign and learn effective strategies to address them.',
  'features.insights.detail.title2': 'Preventive Guidance',
  'features.insights.detail.content2': 'Receive personalized tips to prevent health issues common to your zodiac sign before they arise.',
  
  // Testimonials Section
  'testimonials.heading': 'What Our Users Say',
  'testimonials.subheading': 'Discover how HoroscopeHealth has transformed wellness routines for people just like you.',
  'testimonials.quote1': 'As a Cancer, I\'ve always been sensitive to my environment. HoroscopeHealth helped me understand my need for emotional wellness practices and how they affect my physical health. My sleep quality has improved dramatically!',
  'testimonials.author1': 'Sarah K.',
  'testimonials.quote2': 'The personalized exercise recommendations were spot-on for my Leo energy. I\'ve finally found a fitness routine I can stick with because it actually works with my natural tendencies instead of against them.',
  'testimonials.author2': 'Michael R.',
  'testimonials.quote3': 'Being a Virgo, I was skeptical about mixing astrology with health science. But the evidence-based approach won me over, and the personalized nutrition guidance has helped me resolve digestive issues I\'ve had for years.',
  'testimonials.author3': 'Jennifer L.',
  'testimonials.quote4': 'The mental wellness techniques tailored for Pisces have been life-changing for me. I\'ve finally found meditation practices that work with my intuitive nature rather than forcing me into a one-size-fits-all approach.',
  'testimonials.author4': 'David W.',
  'testimonials.quote5': 'As a Taurus, consistency is key for me. The structured wellness plans that still honor my need for comfort and pleasure have helped me build sustainable health habits for the first time in my life.',
  'testimonials.author5': 'Melissa T.',
  
  // CTA Section
  'cta.heading': 'Start Your Cosmic Wellness Journey Today',
  'cta.subheading': 'Join thousands who have transformed their wellness routine with personalized astrological insights',
  'cta.button': 'Get Started Now',
  'cta.disclaimer': 'The astrological insights provided on this website are for informational and entertainment purposes only and should not replace professional medical advice.',
  'cta.copyright': '© {year} Battle Green Consulting LLC. All rights reserved.',
  'tips.noSavedDescription': 'Your saved wellness tips will appear here.',
  'tips.goExplore': 'Explore Wellness Tips',
  'tips.allCategories': 'All',
  'tips.remove': 'Remove',
  'nav.back': 'Back',
  
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
  // Pagination
  'pagination.previous': 'Anterior',
  'pagination.next': 'Siguiente',
  'pagination.page': 'Página',
  'pagination.of': 'de',
  
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
  'theme.title': 'Tema',
  'theme.dark': 'Modo Oscuro',
  'theme.light': 'Modo Claro',
  
  // Onboarding Wizard
  'onboarding.welcome.title': 'Bienvenido a Horóscopo Salud',
  'onboarding.welcome.description': 'Descubre tu viaje de bienestar cósmico',
  'onboarding.welcome.intro': 'Comencemos descubriendo tu signo zodiacal y creando tu perfil de bienestar personalizado.',
  'onboarding.welcome.feature1.title': 'Información Personalizada',
  'onboarding.welcome.feature1.description': 'Obtén recomendaciones diarias de bienestar basadas en tu perfil astrológico único.',
  'onboarding.welcome.feature2.title': 'Viaje Cósmico',
  'onboarding.welcome.feature2.description': 'Sigue tu progreso y gana logros mientras exploras tu camino de bienestar cósmico.',
  'onboarding.welcome.start': 'Inicia Tu Viaje',
  
  'onboarding.quiz.step': 'Paso',
  'onboarding.quiz.instruction': 'Elige la opción que mejor te describa.',
  'onboarding.quiz.back': 'Atrás',
  'onboarding.quiz.next': 'Siguiente',
  'onboarding.quiz.finish': 'Ver Resultados',
  
  'onboarding.result.title': 'Tu Coincidencia Zodiacal',
  'onboarding.result.description': 'Basado en tus rasgos de personalidad, hemos identificado tu probable signo zodiacal.',
  'onboarding.result.element': 'Elemento',
  'onboarding.result.question': '¿Es este tu signo zodiacal? Si no, selecciona el correcto:',
  'onboarding.result.back': 'Volver a Realizar el Cuestionario',
  'onboarding.result.continue': 'Continuar',
  
  'onboarding.profile.title': 'Completa Tu Perfil',
  'onboarding.profile.description': 'Solo algunos detalles más para personalizar tu viaje de bienestar cósmico.',
  'onboarding.profile.email': 'Correo Electrónico',
  'onboarding.profile.firstName': 'Nombre',
  'onboarding.profile.lastName': 'Apellido',
  'onboarding.profile.birthDate': 'Fecha de Nacimiento',
  'onboarding.profile.referralCode': 'Código de Referencia',
  'onboarding.profile.referralDescription': 'Si alguien te recomendó, ingresa su código para obtener funciones adicionales.',
  'onboarding.profile.back': 'Atrás',
  'onboarding.profile.complete': 'Completar Configuración',
  
  'onboarding.submitting.title': 'Creando Tu Perfil Cósmico',
  'onboarding.submitting.description': 'Por favor espera mientras alineamos las estrellas para tu experiencia personalizada...',
  
  'onboarding.success.title': '¡Bienvenido a Tu Viaje de Bienestar Cósmico!',
  'onboarding.success.description': 'Tu perfil ha sido creado con éxito.',
  
  'onboarding.error.title': 'Algo Salió Mal',
  'onboarding.error.description': 'No pudimos completar tu registro. Por favor intenta de nuevo.',
  
  // Journey Section
  'journey.badge': 'EXPERIENCIA PERSONALIZADA',
  'journey.title': 'Comienza Tu Viaje de Bienestar Cósmico',
  'journey.description': 'Embárcate en un viaje personalizado a través de las influencias cósmicas en tu bienestar con nuestro proceso de incorporación intuitivo.',
  'journey.step1.title': 'Descubre Tu Perfil Zodiacal',
  'journey.step1.description': 'Realiza nuestro cuestionario de personalidad para confirmar tu signo zodiacal y tus rasgos únicos de bienestar cósmico.',
  'journey.step2.title': 'Desbloquea Tu Mapa Estelar',
  'journey.step2.description': 'Recibe un análisis detallado de cómo los cuerpos celestes influyen en tu salud y bienestar.',
  'journey.step3.title': 'Orientación Personalizada',
  'journey.step3.description': 'Obtén recomendaciones de bienestar y rituales diarios personalizados basados en tu perfil astrológico.',
  
  // Gift Page
  'gift.title': 'Tarjetas de Regalo de Bienestar Cósmico',
  'gift.subtitle': 'Comparte el regalo del bienestar astrológico personalizado con alguien especial.',
  'gift.monthly.title': 'Regalo Premium Mensual',
  'gift.monthly.subtitle': 'Perfecto para una introducción al bienestar cósmico',
  'gift.monthly.price': '$9.99',
  'gift.monthly.period': 'por un mes',
  'gift.monthly.feature1': 'Un mes de membresía Premium',
  'gift.monthly.feature2': 'Informes de salud detallados semanales',
  'gift.monthly.feature3': 'Recomendaciones de bienestar personalizadas',
  'gift.monthly.button': 'Comprar Tarjeta de Regalo',
  'gift.annual.title': 'Regalo Premium Anual',
  'gift.annual.subtitle': 'Un año completo de orientación de bienestar cósmico',
  'gift.annual.price': '$89.99',
  'gift.annual.period': 'por un año',
  'gift.annual.saving': 'Ahorra $29.89',
  'gift.annual.feature1': 'Un año completo de membresía Premium',
  'gift.annual.feature2': 'Soporte de bienestar prioritario',
  'gift.annual.feature3': 'Informes cósmicos estacionales exclusivos',
  'gift.annual.button': 'Comprar Tarjeta de Regalo',
  'gift.how.title': 'Cómo Funcionan las Tarjetas de Regalo',
  'gift.how.step1': 'Compra una tarjeta de regalo para tu destinatario',
  'gift.how.step2': 'Recibe un código único y una tarjeta digital personalizable por correo electrónico',
  'gift.how.step3': 'Comparte el código con tu destinatario',
  'gift.how.step4': 'Tu destinatario canjea el código durante el registro o desde la configuración de su cuenta',

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
  'premium.heading': 'Integración Avanzada de Bienestar',
  // Premium Features
  'premium.features': 'Funciones Premium',
  'premium.features.weekly': 'Informes de salud semanales detallados',
  'premium.features.compatibility': 'Análisis de compatibilidad',
  'premium.features.career': 'Orientación de bienestar profesional',
  'premium.features.health': 'Protocolos de salud personalizados',
  'premium.features.rituals': 'Rituales de bienestar a medida',
  'premium.features.support': 'Soporte prioritario de bienestar',
  // Preview section
  'premium.preview.title': 'Vista Previa del Informe Semanal',
  'premium.preview.subtitle': 'Muestra de tu contenido premium personalizado',
  'premium.preview.section1.title': 'Enfoque en Bienestar Físico',
  'premium.preview.section1.content': 'Tu alineación cósmica esta semana sugiere enfocarte en ejercicios de movilidad y flexibilidad para un óptimo bienestar físico.',
  'premium.preview.section2.title': 'Recomendación de Equilibrio Mental',
  'premium.preview.section2.content': 'Las posiciones planetarias actuales indican una necesidad de prácticas de atención plena para mantener el equilibrio emocional.',
  'premium.preview.note': 'Desbloquea informes completos con membresía premium',
  // For pricing box
  'premium.plan.title': 'Plan Mensual',
  'premium.plan.period': '/mes',
  'premium.plan.feature1': 'Acceso completo a todas las funciones',
  'premium.plan.feature2': 'Informes premium semanales',
  'premium.plan.feature3': 'Cancela cuando quieras',
  'premium.plan.button': 'Suscríbete Ahora',
  // Keep legacy keys for backward compatibility
  'premium.pricing.title': 'Plan Mensual',
  'premium.pricing.price': '$9.99',
  'premium.pricing.period': '/mes',
  'premium.pricing.feature1': 'Acceso completo a todas las funciones',
  'premium.pricing.feature2': 'Informes premium semanales',
  'premium.pricing.feature3': 'Cancela cuando quieras',
  'premium.pricing.button': 'Suscríbete Ahora',
  'premium.methodology': 'Conoce Nuestra Metodología',
  'premium.label': 'Premium',
  'premium.upgrade': 'Actualizar a Premium',
  
  // Methodology section
  'methodology.button': 'Conoce Nuestra Metodología',
  
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
  
  // Wellness Tips
  'tips.title': 'Consejo de Bienestar',
  'tips.daily': 'Consejo Diario',
  'tips.close': 'Cerrar',
  'tips.next': 'Siguiente Consejo',
  'tips.save': 'Guardar Consejo',
  'tips.share': 'Compartir Consejo',
  'tips.category.nutrition': 'Nutrición',
  'tips.category.exercise': 'Ejercicio',
  'tips.category.mindfulness': 'Atención Plena',
  'tips.category.sleep': 'Sueño',
  'tips.category.hydration': 'Hidratación',
  'tips.personalized': 'Personalizado para tu perfil cósmico',
  'tips.element': 'Elemento',
  'tips.zodiac': 'Zodiaco',
  'tips.universal': 'Universal',
  'tips.savedTitle': 'Consejo Guardado',
  'tips.savedDescription': 'Este consejo de bienestar ha sido guardado en tu colección.',
  'tips.alreadySavedTitle': 'Ya Guardado',
  'tips.alreadySavedDescription': 'Este consejo de bienestar ya está en tu colección.',
  'tips.copiedTitle': 'Copiado al Portapapeles',
  'tips.copiedDescription': 'El consejo de bienestar ha sido copiado al portapapeles.',
  'tips.removedTitle': 'Consejo Eliminado',
  'tips.removedDescription': 'El consejo de bienestar ha sido eliminado de tu colección.',
  'tips.savedCollection': 'Consejos de Bienestar Guardados',
  'tips.noSavedTitle': 'Aún No Hay Consejos Guardados',
  'tips.noSavedDescription': 'Tus consejos de bienestar guardados aparecerán aquí.',
  'tips.goExplore': 'Explorar Consejos de Bienestar',
  'tips.allCategories': 'Todos',
  'tips.remove': 'Eliminar',
  'nav.back': 'Volver',
  
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