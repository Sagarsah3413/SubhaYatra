import Footer from '../components/footer/Footer';
import { Header } from '../components/header/Header';
import { useTheme } from '../contexts/ThemeContext';

export default function About() {
  const { bgClass, textClass } = useTheme();
  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex flex-col`}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-slide-in {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
      `}</style>

      <Header />
      <div className="bg-cover bg-center h-80 flex items-center justify-center relative overflow-hidden" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828)'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        <div className="relative z-10 text-center animate-fade-in-up">
          <h1 className="text-7xl font-bold text-white mb-4">Roamio Wanderly</h1>
          <p className="text-xl text-blue-100 font-light">Discover Your Next Adventure</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Introduction */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">Welcome Traveler</h2>
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Your trusted travel companion, dedicated to helping you explore the world's finest destinations with personalized recommendations and expert insights.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-xl p-12 text-white animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <h2 className="text-4xl font-bold mb-4">✈️ Our Mission</h2>
          <p className="text-lg leading-relaxed">
            We believe that travel should be personalized, inspiring, and accessible to all. Our recommendation system adapts to your preferences, unveiling hidden gems and popular attractions tailored just for you.
          </p>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-indigo-600 mb-12 text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎯', title: 'Personalized', desc: 'Ours recommendation suggestions tailored to you' },
              { icon: '💎', title: 'Hidden Gems', desc: 'Discover local favorites' },
              { icon: '📱', title: 'Real-time Guides', desc: 'Instant travel tips' },
              { icon: '🤝', title: 'Community', desc: 'Connect with travelers' }
            ].map((item, idx) => (
              <div key={idx} className={`bg-white rounded-xl shadow-md p-8 text-center hover:shadow-2xl hover:scale-105 transition transform duration-300 animate-fade-in-up stagger-${idx + 1}`} style={{animationDelay: `${0.4 + idx * 0.1}s`}}>
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-indigo-600 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
