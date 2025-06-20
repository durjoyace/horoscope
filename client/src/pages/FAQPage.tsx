import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Star, Shield, Clock, Heart } from 'lucide-react';

const faqData = [
  {
    category: "General",
    icon: <HelpCircle className="h-5 w-5" />,
    questions: [
      {
        question: "How accurate are your horoscope predictions?",
        answer: "Our horoscopes are generated using advanced AI trained on astrological principles and wellness research. While we strive for meaningful insights, astrology is for entertainment purposes only and should not replace professional medical or psychological advice."
      },
      {
        question: "How often are horoscopes updated?",
        answer: "Daily horoscopes are generated fresh each morning at 6 AM EST. Weekly premium reports are released every Sunday, and monthly insights are available on the first of each month."
      },
      {
        question: "Can I get horoscopes for different time zones?",
        answer: "Yes! Our system automatically adjusts delivery times based on your location. You can also manually set your preferred time zone in your account settings."
      },
      {
        question: "What makes HoroscopeHealth different from other astrology sites?",
        answer: "We focus specifically on wellness and health insights through an astrological lens. Our content combines traditional astrological wisdom with modern wellness practices, nutrition advice, and mindfulness techniques."
      }
    ]
  },
  {
    category: "Premium Features",
    icon: <Star className="h-5 w-5" />,
    questions: [
      {
        question: "What's included in the Premium subscription?",
        answer: "Premium includes detailed weekly reports, personalized wellness recommendations, compatibility analysis, exclusive content, priority customer support, and access to our wellness marketplace with member discounts."
      },
      {
        question: "Can I cancel my Premium subscription anytime?",
        answer: "Yes, you can cancel your Premium subscription at any time through your account settings. Your access will continue until the end of your current billing period."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 7-day money-back guarantee for new Premium subscribers. If you're not satisfied within the first week, contact our support team for a full refund."
      },
      {
        question: "Is there a free trial for Premium features?",
        answer: "Yes! New users get a 3-day free trial of all Premium features. No credit card required to start your trial."
      }
    ]
  },
  {
    category: "Privacy & Security",
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        question: "How do you protect my personal information?",
        answer: "We use industry-standard encryption to protect your data. We never sell your personal information to third parties and only collect what's necessary to provide our services."
      },
      {
        question: "Can I delete my account and data?",
        answer: "Yes, you can permanently delete your account and all associated data from your account settings. This action is irreversible and will remove all your horoscope history and preferences."
      },
      {
        question: "Do you share my birth information with anyone?",
        answer: "No, your birth date and personal astrological information are kept strictly confidential and are only used to generate your personalized horoscopes and wellness recommendations."
      },
      {
        question: "What cookies do you use?",
        answer: "We use essential cookies for site functionality and analytics cookies to improve user experience. You can manage cookie preferences in your browser settings."
      }
    ]
  },
  {
    category: "Technical Support",
    icon: <Clock className="h-5 w-5" />,
    questions: [
      {
        question: "I'm not receiving my daily horoscope emails. What should I do?",
        answer: "First, check your spam/junk folder. Add our email address to your contacts. If you still don't receive emails, verify your email address in account settings or contact our support team."
      },
      {
        question: "The website isn't loading properly. How can I fix this?",
        answer: "Try clearing your browser cache and cookies, or try a different browser. Ensure you have a stable internet connection. If problems persist, contact our technical support team."
      },
      {
        question: "Can I use HoroscopeHealth on my mobile device?",
        answer: "Yes! Our website is fully responsive and works on all devices. We also offer push notifications for daily horoscopes when you enable them in your browser."
      },
      {
        question: "How do I change my zodiac sign or birth information?",
        answer: "You can update your zodiac sign and birth information in your account settings. Note that changing this information will affect future horoscope accuracy and recommendations."
      }
    ]
  },
  {
    category: "Wellness & Health",
    icon: <Heart className="h-5 w-5" />,
    questions: [
      {
        question: "Are your health recommendations medically reviewed?",
        answer: "Our wellness content is based on general health principles and astrological traditions. Always consult with healthcare professionals for medical advice. Our recommendations are for general wellness only."
      },
      {
        question: "Can astrology really influence my health and wellness?",
        answer: "While scientific evidence for astrology's direct health effects is limited, many people find astrological insights helpful for self-reflection and mindfulness practices that can support overall wellness."
      },
      {
        question: "Do you offer personalized nutrition advice?",
        answer: "We provide general nutrition tips based on astrological principles and seasonal influences. For specific dietary needs or health conditions, consult with a registered dietitian or healthcare provider."
      },
      {
        question: "How do I use the compatibility feature?",
        answer: "Our compatibility tool analyzes the astrological harmony between two zodiac signs. Use it to understand relationship dynamics with partners, friends, or family members. Remember, real relationships depend on many factors beyond astrology."
      }
    ]
  }
];

export default function FAQPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
          <div className="absolute -top-40 right-60 transform w-96 h-96 rounded-full bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 blur-3xl opacity-40"></div>
          <div className="absolute bottom-20 left-40 transform w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-700 via-purple-800 to-indigo-900 blur-3xl opacity-30"></div>
          <div className="h-full w-full bg-[url('/stars-bg.png')] bg-repeat opacity-20"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about HoroscopeHealth, our services, and how to make the most of your cosmic wellness journey.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-white text-xl">
                    <div className="p-2 bg-purple-600/20 rounded-lg mr-3">
                      {category.icon}
                    </div>
                    {category.category}
                    <Badge variant="outline" className="ml-auto border-purple-500/50 text-purple-300">
                      {category.questions.length} questions
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${categoryIndex}-${index}`}
                        className="border-purple-900/30"
                      >
                        <AccordionTrigger className="text-white hover:text-purple-300 text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-300 mb-6">
                Our support team is here to help you on your cosmic wellness journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Contact Support
                </a>
                <a
                  href="mailto:support@horoscopehealth.com"
                  className="inline-flex items-center justify-center px-6 py-3 border border-purple-500/50 hover:bg-purple-900/20 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Email Us
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}