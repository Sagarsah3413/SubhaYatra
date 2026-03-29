import { useState, useEffect } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Header } from '../components/header/Header';
import Footer from '../components/footer/Footer';

import AuthBackground from '../components/auth/AuthBackground';
import AuthBrandPanel from '../components/auth/AuthBrandPanel';
import AuthFormCard from '../components/auth/AuthFormCard';
import { getClerkAppearance } from '../components/auth/clerkAppearance';
import { SIGN_UP_FEATURES } from '../components/auth/authConstants';

export default function SignUpPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const dark = theme === 'dark';
  const appearance = getClerkAppearance(dark);

  return (
    <div className={`min-h-screen flex flex-col ${dark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Header />

      <main className="flex-1 relative overflow-hidden pt-16">
        <AuthBackground dark={dark} />

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] py-16 px-4">
          <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* LEFT */}
            <AuthBrandPanel
              dark={dark}
              mounted={mounted}
              badge="Join thousands of explorers"
              headline={
                <>
                  <span className={dark ? 'text-white' : 'text-slate-900'}>Start your</span>
                  <br />
                  <span className="bg-linear-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    journey
                  </span>
                </>
              }
              subtext="Create a free account to discover Nepal's hidden gems, save your favourite places, and plan your perfect trip."
              tagline={
                "Every journey begins with a single step — yours starts here."
              }
            />

            {/* RIGHT */}
            <AuthFormCard
              dark={dark}
              mounted={mounted}
              nudgeText="Already have an account?"
              nudgeAction="Sign in"
              onNudge={() => navigate('/sign-in')}
              clerkForm={
                <SignUp
                  appearance={appearance}
                  redirectUrl="/"
                  signInUrl="/sign-in"
                />
              }
            />

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}