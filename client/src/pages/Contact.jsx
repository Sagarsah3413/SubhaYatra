import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Footer from "../components/footer/Footer";
import { Header } from '../components/header/Header';
import { useTheme } from '../contexts/ThemeContext';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Contact() {
  const { bgClass, textClass } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all fields.');
      return;
    }
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex flex-col`}>
      <Header />
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828)'}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-75"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-7xl font-bold text-white mb-4 animate-fade-in">Contact Us</h1>
          <p className="text-xl text-slate-200">Let's start your next adventure together</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Introduction */}
        <div className="text-center mb-16">
          <p className="text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto">
            Have questions about your next adventure? We're here to help you plan the perfect trip. Reach out anytime!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-xl p-8 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Get In Touch</h2>
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-semibold">✓ Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Tell us about your travel plans or questions..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 font-semibold transform hover:scale-105"
              >
                Send Message ✈️
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {[
                  { icon: '📍', title: 'Address', info: 'Kathmandu, Nepal' },
                  { icon: '📞', title: 'Phone', info: '+977-1-234567' },
                  { icon: '✉️', title: 'Email', info: 'info@roamiowanderly.com' },
                  { icon: '🕒', title: 'Hours', info: 'Mon-Fri 9-6pm, Sat-Sun 10-4pm' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4 hover:translate-x-1 transition-transform">
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{item.title}</h3>
                      <p className="text-slate-600">{item.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Find Us</h3>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapContainer
                  center={[27.7172, 85.3240]}
                  zoom={7}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[27.7172, 85.3240]}>
                    <Popup>
                      <strong>Roamio Wanderly</strong><br />Kathmandu, Nepal
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-12 border border-slate-200">
          <h2 className="text-4xl font-bold text-slate-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { question: "How do I get personalized recommendations?", answer: "Create an account and tell us your preferences, budget, and travel style for tailored suggestions." },
              { question: "Can I book tours through your platform?", answer: "We focus on recommendations and can connect you with trusted local operators for bookings." },
              { question: "Do you offer travel insurance?", answer: "We recommend reliable insurance partners, though we don't provide it directly." },
              { question: "How often is information updated?", answer: "Our database is continuously updated with the latest info from travelers and local experts." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border-l-4 border-blue-500 shadow hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-slate-800 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeInUp 0.8s ease-out; }
      `}</style>

      <Footer />
    </div>
  );
}
