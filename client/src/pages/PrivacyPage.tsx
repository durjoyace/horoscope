import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Database, Settings, AlertTriangle, Mail } from 'lucide-react';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Last updated: January 2025
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Information We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <Database className="h-5 w-5 mr-3 text-purple-400" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Personal Information</h4>
                  <p>When you create an account, we collect your email address, zodiac sign, and optional profile information such as your name and birth date. This information is necessary to provide personalized horoscopes and wellness recommendations.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Usage Data</h4>
                  <p>We automatically collect information about how you interact with our service, including pages visited, features used, and time spent on the platform. This helps us improve our services and user experience.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Communication Preferences</h4>
                  <p>We store your preferences for email notifications, SMS alerts, and other communication settings to respect your choices about how we contact you.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How We Use Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <Settings className="h-5 w-5 mr-3 text-purple-400" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Service Delivery</h4>
                  <p>We use your zodiac sign and birth information to generate personalized horoscopes, wellness recommendations, and compatibility insights tailored specifically for you.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Communication</h4>
                  <p>We send you daily horoscopes, premium reports, and service updates based on your communication preferences. You can opt out of non-essential communications at any time.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Service Improvement</h4>
                  <p>We analyze usage patterns to improve our content quality, develop new features, and enhance the overall user experience on our platform.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Legal Compliance</h4>
                  <p>We may use your information to comply with legal obligations, resolve disputes, and enforce our terms of service.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <Eye className="h-5 w-5 mr-3 text-purple-400" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Third-Party Services</h4>
                  <p>We use trusted third-party services for email delivery, payment processing, and analytics. These providers only receive the minimum information necessary to perform their services and are bound by confidentiality agreements.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Legal Requirements</h4>
                  <p>We may disclose your information if required by law, legal process, or to protect the rights, property, or safety of HoroscopeHealth, our users, or others.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Business Transfers</h4>
                  <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction, subject to the same privacy protections.</p>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-300 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    What We Never Do
                  </h4>
                  <p className="text-red-200">We never sell your personal information to third parties for marketing purposes. Your astrological data and personal details remain confidential and are only used to provide our services to you.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Security */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <Shield className="h-5 w-5 mr-3 text-purple-400" />
                  Data Security and Retention
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Security Measures</h4>
                  <p>We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information from unauthorized access, alteration, or disclosure.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Data Retention</h4>
                  <p>We retain your personal information only as long as necessary to provide our services and comply with legal obligations. You can request deletion of your account and data at any time.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">International Transfers</h4>
                  <p>Your information may be processed and stored in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <Settings className="h-5 w-5 mr-3 text-purple-400" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Access and Correction</h4>
                  <p>You can access and update your personal information through your account settings at any time. Contact us if you need assistance accessing or correcting your data.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Data Portability</h4>
                  <p>You have the right to request a copy of your personal data in a structured, machine-readable format. This includes your horoscope history and account information.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Deletion</h4>
                  <p>You can delete your account and request removal of your personal data from our systems. Note that some information may be retained for legal compliance purposes.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Marketing Communications</h4>
                  <p>You can opt out of marketing emails at any time by clicking the unsubscribe link in any email or updating your preferences in your account settings.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <Mail className="h-5 w-5 mr-3 text-purple-400" />
                  Contact Us About Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-4">
                  If you have questions about this Privacy Policy or how we handle your personal information, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong className="text-white">Email:</strong> privacy@horoscopehealth.com</p>
                  <p><strong className="text-white">Company:</strong> Battle Green Consulting LLC</p>
                  <p><strong className="text-white">Response Time:</strong> We respond to privacy inquiries within 72 hours</p>
                </div>
                <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <p className="text-sm">
                    <strong className="text-purple-300">Notice of Changes:</strong> We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through our service. Your continued use of HoroscopeHealth after changes become effective constitutes acceptance of the updated policy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}