import { ORBS, FLOAT_ICONS } from './authConstants';

/**
 * Shared animated background used by both SignInPage and SignUpPage.
 * Renders: keyframes (first), base gradient, radial glow, floating blobs, floating icons.
 *
 * Props:
 *   dark {boolean}
 */
const AuthBackground = ({ dark }) => (
    <>
        {/* Keyframes FIRST — must be in the DOM before any element references them.
        Both floatBlob (blobs + icons) and fadeUp (brand panel + form card) live here. */}
        <style>{`
      @keyframes floatBlob {
        0%, 100% { transform: translateY(0px) scale(1); }
        50%       { transform: translateY(-18px) scale(1.04); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>

        {/* Base gradient */}
        <div
            className={`absolute inset-0 ${dark
                ? 'bg-linear-to-br from-slate-950 via-slate-900 to-slate-950'
                : 'bg-linear-to-br from-teal-50 via-white to-cyan-50'
                }`}
        />

        {/* Radial glow */}
        <div
            className={`absolute inset-0 pointer-events-none ${dark ? 'opacity-40' : 'opacity-30'}`}
            style={{
                background:
                    'radial-gradient(ellipse 60% 50% at 20% 40%, rgba(20,184,166,0.25) 0%, transparent 70%), ' +
                    'radial-gradient(ellipse 50% 60% at 80% 60%, rgba(6,182,212,0.20) 0%, transparent 70%)',
            }}
        />

        {/* Animated blobs */}
        {ORBS.map((orb, i) => (
            <div
                key={i}
                className={`absolute rounded-full bg-linear-to-br ${orb.color} blur-3xl pointer-events-none`}
                style={{
                    width: orb.w,
                    height: orb.h,
                    top: orb.top ?? undefined,
                    left: orb.left ?? undefined,
                    right: orb.right ?? undefined,
                    bottom: orb.bottom ?? undefined,
                    animation: `floatBlob ${orb.dur} ease-in-out infinite`,
                    animationDelay: orb.delay,
                }}
            />
        ))}

        {/* Floating icons */}
        {FLOAT_ICONS.map(({ Icon, top, left, size, delay, dur }, i) => (
            <div
                key={i}
                className={`absolute pointer-events-none ${dark ? 'text-teal-500/20' : 'text-teal-600/15'}`}
                style={{
                    top,
                    left,
                    animation: `floatBlob ${dur} ease-in-out infinite`,
                    animationDelay: delay,
                }}
            >
                <Icon size={size} />
            </div>
        ))}
    </>
);

export default AuthBackground;