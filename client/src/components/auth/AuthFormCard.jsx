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
                ? 'bg-slate-900/80 border-slate-700/60 shadow-slate-950/60'
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
                className="text-teal-500 hover:text-teal-400 font-semibold transition-colors duration-200"
            >
                {nudgeAction}
            </button>
        </p>
    </div>
);

export default AuthFormCard;