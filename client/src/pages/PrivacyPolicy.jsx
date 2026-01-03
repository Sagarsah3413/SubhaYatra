import React from 'react';
import { Header } from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { FaShieldAlt, FaUserShield, FaCookie, FaEnvelope } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-teal-900/50' : 'bg-teal-100'}`}>
              <FaShieldAlt className="text-4xl text-teal-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: December 30, 2024
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          
          {/* Information We Collect */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaUserShield className="text-2xl text-teal-600 mr-3" />
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-teal-600">Personal Information</h3>
                <ul className={`list-disc list-inside space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>Name and contact information when you create an account</li>
                  <li>Email address for communication and account verification</li>
                  <li>Profile information you choose to provide</li>
                  <li>Travel preferences and booking history</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-teal-600">Usage Information</h3>
                <ul className={`list-disc list-inside space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>Pages visited and features used on our platform</li>
                  <li>Search queries and interaction patterns</li>
                  <li>Device information and browser type</li>
                  <li>IP address and location data (with consent)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <h3 className="font-medium mb-2 text-teal-600">Service Provision</h3>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• Provide travel recommendations</li>
                  <li>• Process bookings and reservations</li>
                  <li>• Customize your experience</li>
                  <li>• Provide customer support</li>
                </ul>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <h3 className="font-medium mb-2 text-teal-600">Communication</h3>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• Send booking confirmations</li>
                  <li>• Share travel updates and tips</li>
                  <li>• Notify about service changes</li>
                  <li>• Respond to inquiries</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaCookie className="text-2xl text-teal-600 mr-3" />
              <h2 className="text-2xl font-semibold">Cookies and Tracking</h2>
            </div>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              We use cookies and similar technologies to enhance your experience and analyze usage patterns.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <h4 className="font-medium text-teal-600 mb-1">Essential Cookies</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Required for basic site functionality and security.
                </p>
              </div>
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <h4 className="font-medium text-teal-600 mb-1">Analytics Cookies</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Help us understand how you use our platform.
                </p>
              </div>
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <h4 className="font-medium text-teal-600 mb-1">Preference Cookies</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Remember your settings and preferences.
                </p>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">Data Sharing and Third Parties</h2>
            <div className="space-y-4">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                We do not sell your personal information. We may share data with:
              </p>
              <ul className={`list-disc list-inside space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <li><strong>Service Providers:</strong> Third-party companies that help us operate our platform</li>
                <li><strong>Travel Partners:</strong> Hotels, airlines, and tour operators for booking purposes</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-teal-600">Data Rights</h3>
                <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Access your personal data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Delete your account and data</li>
                  <li>• Export your data</li>
                  <li>• Restrict data processing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3 text-teal-600">Communication Preferences</h3>
                <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Unsubscribe from marketing emails</li>
                  <li>• Manage notification settings</li>
                  <li>• Control cookie preferences</li>
                  <li>• Opt out of data analytics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              We implement industry-standard security measures to protect your information:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className={`list-disc list-inside space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>SSL encryption for data transmission</li>
                <li>Secure data storage and backup systems</li>
                <li>Regular security audits and updates</li>
              </ul>
              <ul className={`list-disc list-inside space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-2xl text-teal-600 mr-3" />
              <h2 className="text-2xl font-semibold">Contact Us</h2>
            </div>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
            </p>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Email:</strong> privacy@roamiowanderly.com<br />
                <strong>Address:</strong> Roamio Wanderly, Kathmandu, Nepal<br />
                <strong>Response Time:</strong> We aim to respond within 30 days
              </p>
            </div>
          </section>

          {/* Updates */}
          <section className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Posting the updated policy on our website</li>
              <li>Sending an email notification to registered users</li>
              <li>Displaying a prominent notice on our platform</li>
            </ul>
            <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Continued use of our services after policy updates constitutes acceptance of the new terms.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;