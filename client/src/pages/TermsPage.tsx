import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Scale, AlertCircle, CreditCard, UserCheck, Shield } from 'lucide-react';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Please read these terms carefully before using HoroscopeHealth. By accessing our service, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Last updated: January 2025
          </p>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Acceptance of Terms */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <UserCheck className="h-5 w-5 mr-3 text-purple-400" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>By creating an account or using HoroscopeHealth services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.</p>
                <p>If you do not agree to these terms, you may not access or use our services. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.</p>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-purple-200"><strong>Age Requirement:</strong> You must be at least 13 years old to use our services. If you are under 18, you must have parental consent.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <FileText className="h-5 w-5 mr-3 text-purple-400" />
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">HoroscopeHealth Services</h4>
                  <p>We provide personalized astrological content, wellness recommendations, and related services based on zodiac signs and astrological principles. Our services include daily horoscopes, premium reports, compatibility analysis, and wellness marketplace access.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Entertainment Purpose</h4>
                  <p className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 text-amber-200">
                    <strong>Important:</strong> All astrological content and predictions are provided for entertainment purposes only. Our services should not be used as a substitute for professional medical, psychological, financial, or legal advice.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Service Availability</h4>
                  <p>We strive to maintain service availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue services at any time with or without notice.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <Scale className="h-5 w-5 mr-3 text-purple-400" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Account Security</h4>
                  <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Prohibited Uses</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Using the service for any illegal or unauthorized purpose</li>
                    <li>Attempting to gain unauthorized access to our systems</li>
                    <li>Sharing or reselling our content without permission</li>
                    <li>Creating multiple accounts to circumvent restrictions</li>
                    <li>Using automated tools to access our services</li>
                    <li>Harassing other users or our staff</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Content Guidelines</h4>
                  <p>When participating in community features, you agree to post only appropriate, respectful content that does not violate others' rights or applicable laws.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Terms */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <CreditCard className="h-5 w-5 mr-3 text-purple-400" />
                  Payment and Billing Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Premium Subscriptions</h4>
                  <p>Premium subscriptions are billed on a recurring basis according to your chosen plan. You authorize us to charge your payment method automatically until you cancel.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Cancellation Policy</h4>
                  <p>You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of your current billing period. No partial refunds are provided for unused portions of subscription periods.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Refund Policy</h4>
                  <p>We offer a 7-day money-back guarantee for new Premium subscribers. Refund requests must be submitted within 7 days of your initial subscription purchase.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Price Changes</h4>
                  <p>We reserve the right to change subscription prices with 30 days advance notice. Price changes will not affect your current billing cycle.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <Shield className="h-5 w-5 mr-3 text-purple-400" />
                  Intellectual Property Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Our Content</h4>
                  <p>All content on HoroscopeHealth, including text, graphics, logos, software, and astrological interpretations, is owned by Battle Green Consulting LLC or our licensors and is protected by copyright and other intellectual property laws.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Limited License</h4>
                  <p>We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal, non-commercial purposes only.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">User Content</h4>
                  <p>By submitting content to our community features, you grant us a worldwide, royalty-free license to use, modify, and display your content in connection with our services.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Limitation of Liability */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-gray-900/50 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <AlertCircle className="h-5 w-5 mr-3 text-purple-400" />
                  Disclaimers and Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-300 mb-2">Important Disclaimers</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-red-200">
                    <li>Our services are provided "as is" without warranties of any kind</li>
                    <li>We do not guarantee the accuracy of astrological predictions</li>
                    <li>Results and experiences may vary between users</li>
                    <li>We are not responsible for decisions made based on our content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Limitation of Liability</h4>
                  <p>To the maximum extent permitted by law, Battle Green Consulting LLC shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Maximum Liability</h4>
                  <p>Our total liability to you for any claims arising from these terms or your use of our services shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Governing Law */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                  <Scale className="h-5 w-5 mr-3 text-purple-400" />
                  Legal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Governing Law</h4>
                  <p>These terms are governed by the laws of the jurisdiction where Battle Green Consulting LLC is incorporated, without regard to conflict of law principles.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Dispute Resolution</h4>
                  <p>Any disputes arising from these terms or your use of our services will be resolved through binding arbitration, except for claims that may be brought in small claims court.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Severability</h4>
                  <p>If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Contact for Legal Matters</h4>
                  <p>For legal inquiries regarding these terms, contact us at: <strong className="text-white">legal@horoscopehealth.com</strong></p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}