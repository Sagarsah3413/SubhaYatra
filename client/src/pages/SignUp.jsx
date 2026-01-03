import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useTheme } from '../contexts/ThemeContext';
import { Header } from '../components/header/Header';
import Footer from '../components/footer/Footer';

export default function SignUpPage() {
  const { theme, bgClass, textClass } = useTheme();

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex flex-col`}>
      <Header />
      
      {/* Hero Section with Sign Up */}
      <section className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Join Roamio Wanderly
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Create your account and start your extraordinary travel journey
            </p>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: `${
                    theme === 'dark' 
                      ? 'bg-slate-800/80 backdrop-blur-xl border-slate-700/50' 
                      : 'bg-white/80 backdrop-blur-xl border-slate-200/50'
                  } shadow-2xl rounded-3xl border`,
                  headerTitle: `${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  } text-2xl font-bold`,
                  headerSubtitle: `${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`,
                  formButtonPrimary: 
                    'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300',
                  formFieldInput: `${
                    theme === 'dark' 
                      ? 'bg-slate-700/50 border-slate-600/50 text-white' 
                      : 'bg-white/50 border-slate-300/50 text-gray-900'
                  } rounded-xl border backdrop-blur-sm`,
                  formFieldLabel: `${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  } font-medium`,
                  dividerLine: `${
                    theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                  }`,
                  dividerText: `${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`,
                  socialButtonsBlockButton: `${
                    theme === 'dark' 
                      ? 'bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50' 
                      : 'bg-white/50 border-slate-300/50 text-gray-900 hover:bg-slate-50/50'
                  } rounded-xl border backdrop-blur-sm transition-all duration-300`,
                  footerActionLink: 'text-teal-600 hover:text-teal-700 font-semibold'
                }
              }}
              redirectUrl="/"
              signInUrl="/sign-in"
            />
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free to Join</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}