/**
 * Right-side card wrapper used by both SignInPage and SignUpPage.
 * Renders: glass card, Clerk form slot, security badges, bottom nudge link.
 *
 * Props:
 *   dark        {boolean}
 *   mounted     {boolean}
 *   clerkForm   {ReactNode}  — <SignIn /> or <SignUp />
 *   nudgeText   {string}     — e.g. "Don't have an account?"
 *   nudgeAction {string}     — e.g. "Sign up for free"
 *   onNudge     {Function}   — called when nudge button clicked
 */
const AuthFormCard = ({ dark, mounted, clerkForm, nudgeText, nudgeAction, onNudge }) => (
    <div style={{ animation: 'fadeUp 0.4s ease both' }}>

        {/* Glass card */}
        <div className={`
      rounded-3xl border p-10 backdrop-blur-xl shadow-2xl
      ${dark
                ? 'bg-[#0F1B2D]/80 border-[#2E4A6B]/60 shadow-slate-950/60'
                : 'bg-white/90 border-slate-200 shadow-slate-200/80'
            }
    `}>
            {/* Clerk form injected by parent */}
            {clerkForm}


        </div>

        {/* Bottom nudge */}
        <p className={`mt-5 text-center text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            {nudgeText}{' '}
            <button
                onClick={onNudge}
                className="text-[#2356A0] hover:text-[#D97706] font-semibold transition-colors duration-200"
            >
                {nudgeAction}
            </button>
        </p>
    </div>
);

export default AuthFormCard;