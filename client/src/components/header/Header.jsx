import { useRef } from "react";
import { UserButton, SignUpButton, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

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

  // 3D tilt refs & handlers
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const containerRef = useRef(null);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleTilt = (e) => {
    if (prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const ry = (x / rect.width) * 8; // rotateY up to 8deg
    const rx = (-y / rect.height) * 8; // rotateX up to 8deg

    if (logoRef.current) {
      logoRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px) scale(1.03)`;
    }
    if (titleRef.current) {
      titleRef.current.style.transform = `translateZ(6px) rotateX(${rx / 3}deg) rotateY(${ry / 3}deg)`;
    }
  };

  const resetTilt = () => {
    if (logoRef.current) logoRef.current.style.transform = "";
    if (titleRef.current) titleRef.current.style.transform = "";
  };

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 bg-slate-900 border-b shadow-sm flex justify-between items-center">
      {/* Logo + App Name */}
      <div ref={containerRef} onMouseMove={handleTilt} onMouseLeave={resetTilt} className="flex items-center cursor-pointer logo-container" onClick={handleLogoClick} aria-label="Roamio Wanderly home">
        <span ref={logoRef} className="logo-emoji text-2xl md:text-2xl font-bold" role="img" aria-label="mountain">🌄</span>
        <span ref={titleRef} className="ml-2 text-2xl md:text-2xl font-serif app-title">
          Roamio Wanderly
        </span>

      </div> 

      {/* Navigation / Sign Up / UserButton */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-2 py-1 text-gray-100 hover:text-amber-400 font-semibold transition"
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => navigate("/about")}
          className="px-2 py-1 text-gray-100 hover:text-amber-400 font-semibold transition"
        >
          About Us
        </button>
        <button
          type="button"
          onClick={() => navigate("/contact")}
          className="px-2 py-1 text-gray-100 hover:text-amber-400 font-semibold transition"
        >
          Contact Us
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

      <style>{`
        /* 3D polished logo and title */
        .logo-emoji { display:inline-block; transform-style: preserve-3d; will-change: transform; transition: transform 300ms cubic-bezier(.2,.8,.2,1); filter: drop-shadow(0 6px 12px rgba(0,0,0,0.12)); }
        .logo-emoji:active { transform: translateZ(6px) scale(.98); }

        .app-title { display:inline-block; transform-style: preserve-3d; transition: transform 350ms cubic-bezier(.2,.8,.2,1), filter 200ms ease; background: linear-gradient(90deg,#f59e0b,#f97316,#f59e0b); -webkit-background-clip: text; background-clip: text; color: transparent; background-size: 300% 100%; text-shadow: 0 2px 8px rgba(0,0,0,0.18); }

        /* subtle sheen animation across text for a high-quality look */
        @keyframes sheen { 0% { background-position: 0% 0; } 50% { background-position: 50% 0; } 100% { background-position: 100% 0; } }
        .app-title { animation: sheen 6s linear infinite; }

        /* small hover depth */
        .logo-emoji:hover { transform: translateZ(12px) rotateZ(4deg) scale(1.04); }
        .app-title:hover { filter: drop-shadow(0 6px 20px rgba(245,158,11,0.15)); transform: translateZ(8px); }

        /* small floating animation so effect is visible even without mousemove */
        .logo-container { perspective: 900px; }
        .logo-emoji { animation: floaty 4s ease-in-out infinite; }
        @keyframes floaty { 0% { transform: translateY(0) rotateZ(0); } 50% { transform: translateY(-6px) rotateZ(-1deg); } 100% { transform: translateY(0) rotateZ(0); } }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .logo-emoji, .app-title { animation: none !important; transition: none !important; }
        }
      `}</style>
    </header>
  );
};
