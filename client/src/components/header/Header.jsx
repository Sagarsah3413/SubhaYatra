import React, { useState, useRef, useEffect } from 'react';
import { UserButton, SignUpButton, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import NepaliCalendar from "../../pages/NepaliCalendar";
import { useTheme } from "../../contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

export const Header = ({ onHomeClick }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Detect whether Clerk context/hooks are available to avoid runtime errors in dev without a key
  let clerkAvailable = true;
  try {
    // useUser is a hook and may throw if not inside a ClerkProvider; this will catch that and set a fallback
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const _user = useUser();
    clerkAvailable = !!_user;
  } catch (e) {
    clerkAvailable = false;
  }

  const [showCalendar, setShowCalendar] = useState(false);
  const [mobileAnimating, setMobileAnimating] = useState(false);
  const calendarRef = useRef(null);
  const triggerRef = useRef(null); // store the button that opened the modal
  const previousActive = useRef(null);

  // Live clock state
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    function handleClickOutside(e) {
      // Check if click is outside both desktop and mobile modal containers
      const modalContainer = e.target.closest('[role="dialog"]');
      if (!modalContainer && showCalendar) {
        // If mobile sheet is open, animate it out first
        if (mobileAnimating) {
          setMobileAnimating(false);
          setTimeout(() => setShowCalendar(false), 300);
        } else {
          setShowCalendar(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileAnimating, showCalendar]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Escape key closes modal (already existed) + focus trap/tab handling
  useEffect(() => {
    function handleKey(e) {
      if (!showCalendar) return;
      if (e.key === 'Escape') {
        // animate mobile sheet out if open
        if (mobileAnimating) {
          setMobileAnimating(false);
          setTimeout(() => setShowCalendar(false), 300);
        } else {
          setShowCalendar(false);
        }
      }
      if (e.key === 'Tab' && calendarRef.current) {
        // focus trap inside calendar
        const focusable = calendarRef.current.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showCalendar, mobileAnimating]);

  // When modal opens, store previous active element and move focus into dialog
  useEffect(() => {
    if (showCalendar && calendarRef.current) {
      previousActive.current = document.activeElement;
      // find first focusable element inside calendar
      const focusable = calendarRef.current.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
      const first = focusable.length ? focusable[0] : calendarRef.current;
      // on mobile we want the sheet to slide in
      if (window.innerWidth < 768) {
        setMobileAnimating(true);
      }
      setTimeout(() => first.focus(), 50);
    } else {
      // when closing restore focus to trigger
      if (previousActive.current && previousActive.current.focus) previousActive.current.focus();
    }
  }, [showCalendar]);

  const handleLogoClick = () => {
    navigate("/");
  }; 

  return (
    <header className={`sticky top-0 z-50 w-full px-6 py-4 ${theme === "dark" ? "bg-slate-900" : "bg-white"} border-b shadow-sm flex justify-between items-center`}>
      {/* Logo + App Name */}
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
        <span className="text-2xl md:text-2xl font-bold">🌄</span>
        <span className={`ml-2 text-2xl md:text-2xl font-serif hidden md:inline ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}>
          Roamio Wanderly
        </span>
      </div>



      {/* Navigation / Sign Up / UserButton */}
      <div className="flex items-center gap-4">
        {/* Calendar button (moved to right-side) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            ref={triggerRef}
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              if (window.innerWidth < 768) {
                setShowCalendar(true);
                setMobileAnimating(false);
                setTimeout(() => setMobileAnimating(true), 20);
              } else {
                setShowCalendar(v => !v);
              }
            }}
            className={`px-2 py-1 ${theme === "dark" ? "text-teal-100 hover:text-amber-400" : "text-teal-600 hover:text-amber-700"} font-semibold transition`}
            aria-expanded={showCalendar}
            aria-haspopup="dialog"
            aria-label="Open Nepali Calendar"
            title="Nepali Calendar"
          >
             <span className="ml-2">Calendar</span>
          </button>

          {/* Desktop modal */}
          {showCalendar && (
            <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="nepali-calendar-title">
              <div className="absolute inset-0 bg-black/40" onClick={(e) => {
                e.stopPropagation();
                setShowCalendar(false);
              }} />
              <div ref={calendarRef} tabIndex={-1} className="relative z-10 w-full max-w-xl mx-4 transform transition-all duration-150" onClick={(e) => e.stopPropagation()}>
                <NepaliCalendar full onClose={() => setShowCalendar(false)} />
              </div>
            </div>
          )}

          {/* Mobile modal */}
          {showCalendar && (
            <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-labelledby="nepali-calendar-title">
            <div className="absolute inset-0 bg-black/40" onClick={() => {
              // animate out the sheet then close
              setMobileAnimating(false);
              setTimeout(() => setShowCalendar(false), 300);
            }} />
            <div ref={calendarRef} tabIndex={-1} className={`relative z-10 w-full transform transition-transform duration-300 ${mobileAnimating ? 'translate-y-0' : 'translate-y-full'}`} onClick={(e) => e.stopPropagation()}>
              <NepaliCalendar full mobile onClose={() => {
                setMobileAnimating(false);
                setTimeout(() => setShowCalendar(false), 300);
              }} />
            </div>
          </div>
          )}
        </div>
        <button
          onClick={() => navigate("/")}
          className={`px-2 py-1 ${theme === "dark" ? "text-teal-100 hover:text-amber-400" : "text-teal-600 hover:text-amber-700"} font-semibold transition`}
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => navigate("/about")}
          className={`px-2 py-1 ${theme === "dark" ? "text-teal-100 hover:text-amber-400" : "text-teal-600 hover:text-amber-700"} font-semibold transition`}
        >
          About Us
        </button>
        <button
          type="button"
          onClick={() => navigate("/contact")}
          className={`px-2 py-1 ${theme === "dark" ? "text-teal-100 hover:text-amber-400" : "text-teal-600 hover:text-amber-700"} font-semibold transition`}
        >
          Contact Us
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${theme === "dark" ? "text-teal-100 hover:text-amber-400" : "text-teal-600 hover:text-amber-700"} transition`}
          aria-label="Toggle theme"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>

        {/* Sign Up / UserButton (fallback when Clerk is not available) */}
        {!clerkAvailable ? (
          <button onClick={() => navigate('/signup')} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-amber-700 transition">
            Sign Up
          </button>
        ) : (
          <>
            <SignedOut>
              <SignUpButton>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-amber-700 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </>
        )}
      </div>
    </header>
  );
};