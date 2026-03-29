import { useState, useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Header } from '../components/header/Header';
import Footer from '../components/footer/Footer';

import AuthBackground from '../components/auth/AuthBackground';
import AuthBrandPanel from '../components/auth/AuthBrandPanel';
import AuthFormCard from '../components/auth/AuthFormCard';
import { getClerkAppearance } from '../components/auth/clerkAppearance';  // NOT useClerkAppearance

export default function SignInPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  // Start true — content is visible immediately, then animates in.
  // Starting false causes a flash of invisible content on slow devices.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const dark = theme === 'dark';
  const appearance = getClerkAppearance(dark);  // plain function, not a hook

  return (
    <div className={`min-h-screen flex flex-col ${dark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Header />

      <main className="flex-1 relative overflow-hidden pt-16">
        {/* AuthBackground renders the @keyframes <style> tag first,
            so fadeUp is available to AuthBrandPanel and AuthFormCard */}
        <AuthBackground dark={dark} />

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] py-16 px-4">
          <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* LEFT */}
            <AuthBrandPanel
              dark={dark}
              mounted={mounted}
              badge="Welcome back, Explorer"
              headline={
                <>
                  <span className={dark ? 'text-white' : 'text-slate-900'}>Continue your</span>
                  <br />
                  <span className="bg-linear-to-r from-teal-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    adventure
                  </span>
                </>
              }
              subtext="Sign in to access your saved destinations, travel plans, and personalized Nepal recommendations."
            />

            {/* RIGHT */}
            <AuthFormCard
              dark={dark}
              mounted={mounted}
              nudgeText="Don't have an account?"
              nudgeAction="Sign up for free"
              onNudge={() => navigate('/sign-up')}
              clerkForm={
                <SignIn
                  appearance={appearance}
                  redirectUrl="/"
                  signUpUrl="/sign-up"
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