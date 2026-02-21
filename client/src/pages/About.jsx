import Footer from '../components/footer/Footer';
import { Header } from '../components/header/Header';
import { useTheme } from '../contexts/ThemeContext';

import DevelopmentTeam from '../components/about/developmentTeam/DevelopmentTeam';
import Testimonials from '../components/about/testimonials/Testimonials';
import UltraPremiumHero from '../components/about/ultraPremimumHero/UltraPremiumHero';
import Mission from '../components/about/mission/Mission';
import CoreValues from '../components/about/coreValues/CoreValues';
import Story from '../components/about/story/Story';


export default function About() {
  const { bgClass, textClass } = useTheme();
  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex flex-col`}>
      <Header />
      {/* Ultra-Premium Hero Section */}
      <UltraPremiumHero />
      {/* Company Story Section */}
      <Story />
      {/* Mission & Vision Section */}
      <Mission />
      {/* Core Values Section */}
      <CoreValues />
      {/* Development Team Section */}
      <DevelopmentTeam />
      {/* Enhanced Testimonials Section */}
      <Testimonials />
      <Footer />
    </div>
  );
}
