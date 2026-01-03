import React from 'react';
import { Header } from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { FaGavel, FaUserCheck, FaExclamationTriangle, FaHandshake } from 'react-icons/fa';

const TermsOfService = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-teal-900/50' : 'bg-teal-100'}`}>
              <FaGavel className="text-4xl text-teal-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Please read these terms carefully before using our services.
          </p>
          <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: December 30, 2024
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          
          {/* Acceptance of Terms */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaUserCheck className="text-2xl text-teal-600 mr-3" />
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            </div>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              By accessing and using Roamio Wanderly ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>Important:</strong> If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Roamio Wanderly is a travel recommendation platform that provides:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <h3 className="font-medium mb-2 text-teal-600">Core Services</h3>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• Travel destination recommendations</li>
                  <li>• Hotel and accommodation listings</li>
                  <li>• Restaurant and dining suggestions</li>
                  <li>• Activity and attraction information</li>
                </ul>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <h3 className="font-medium mb-2 text-teal-600">Additional Features</h3>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• User reviews and ratings</li>
                  <li>• Personalized recommendations</li>
                  <li>• Travel planning tools</li>
                  <li>• Community features</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-teal-600">Account Registration</h3>
                <ul className={`list-disc list-inside space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must be at least 18 years old to create an account</li>
                  <li>One person may not maintain more than one account</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-teal-600">Account Responsibilities</h3>
                <ul className={`list-disc list-inside space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Keep your contact information up to date</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-2xl text-amber-500 mr-3" />
              <h2 className="text-2xl font-semibold">4. Acceptable Use Policy</h2>
            </div>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} border border-red-200`}>
                <h3 className="font-medium mb-2 text-red-600">Prohibited Activities</h3>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Posting false or misleading information</li>
                  <li>• Harassment or abusive behavior</li>
                  <li>• Spam or unsolicited communications</li>
                  <li>• Violation of intellectual property rights</li>
                  <li>• Attempting to hack or disrupt the service</li>
                </ul>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'} border border-green-200`}>
                <h3 className="font-medium mb-2 text-green-600">Encouraged Behavior</h3>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Honest and helpful reviews</li>
                  <li>• Respectful community interaction</li>
                  <li>• Accurate travel information sharing</li>
                  <li>• Constructive feedback and suggestions</li>
                  <li>• Reporting inappropriate content</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content and Reviews */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">5. User Content and Reviews</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-teal-600">Content Ownership</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  You retain ownership of content you submit, but grant us a license to use, display, and distribute it on our platform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-teal-600">Review Guidelines</h3>
                <ul className={`list-disc list-inside space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>Reviews must be based on genuine experiences</li>
                  <li>No fake or incentivized reviews</li>
                  <li>Respectful language and constructive criticism</li>
                  <li>No personal attacks or discriminatory content</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Booking and Payments */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">6. Booking and Payments</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <h3 className="font-medium mb-2 text-teal-600">Third-Party Services</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Bookings are processed through third-party providers. We are not responsible for the quality, availability, or pricing of third-party services.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <h3 className="font-medium mb-2 text-teal-600">Payment Terms</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  All payments are subject to the terms and conditions of the respective service providers. Refunds and cancellations are governed by provider policies.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimers and Limitations</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50'} border border-amber-200`}>
                <h3 className="font-medium mb-2 text-amber-600">Service Availability</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  We strive to maintain service availability but cannot guarantee uninterrupted access. We reserve the right to modify or discontinue services with notice.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50'} border border-amber-200`}>
                <h3 className="font-medium mb-2 text-amber-600">Information Accuracy</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  While we strive for accuracy, we cannot guarantee that all information on our platform is current, complete, or error-free. Users should verify information independently.
                </p>
              </div>
            </div>
          </section>

          {/* Liability */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              To the maximum extent permitted by law, Roamio Wanderly shall not be liable for:
            </p>
            <ul className={`list-disc list-inside space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Actions or omissions of third-party service providers</li>
              <li>Travel-related incidents, accidents, or disruptions</li>
              <li>User-generated content or interactions between users</li>
            </ul>
          </section>

          {/* Termination */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-teal-600">By You</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  You may terminate your account at any time by contacting us or using account settings. Some information may be retained as required by law.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-teal-600">By Us</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  We may suspend or terminate accounts for violations of these terms, illegal activity, or at our discretion with reasonable notice.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaHandshake className="text-2xl text-teal-600 mr-3" />
              <h2 className="text-2xl font-semibold">10. Governing Law and Disputes</h2>
            </div>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                These terms are governed by the laws of Nepal. Any disputes will be resolved through:
              </p>
              <ol className={`list-decimal list-inside space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <li><strong>Direct Communication:</strong> We encourage users to contact us first to resolve issues</li>
                <li><strong>Mediation:</strong> Good faith mediation before formal legal proceedings</li>
                <li><strong>Jurisdiction:</strong> Courts of Kathmandu, Nepal for any legal disputes</li>
              </ol>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              We may update these Terms of Service from time to time. We will notify users of material changes by:
            </p>
            <ul className={`list-disc list-inside space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Posting updated terms on our website</li>
              <li>Sending email notifications to registered users</li>
              <li>Displaying prominent notices on our platform</li>
            </ul>
            <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>Effective Date:</strong> Changes become effective 30 days after notification. Continued use constitutes acceptance of new terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              For questions about these Terms of Service, please contact us:
            </p>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Email:</strong> legal@roamiowanderly.com<br />
                <strong>Address:</strong> Roamio Wanderly, Kathmandu, Nepal<br />
                <strong>Business Hours:</strong> Sunday - Friday, 9:00 AM - 6:00 PM (NPT)
              </p>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;