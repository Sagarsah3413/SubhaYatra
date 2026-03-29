import { FaCompass } from 'react-icons/fa';

/**
 * Left-side brand panel shared by SignInPage and SignUpPage.
 *
 * Props:
 *   dark     {boolean}
 *   mounted  {boolean}   — drives fadeUp animation
 *   badge    {string}    — e.g. "Welcome back, Explorer"
 *   headline {ReactNode} — JSX for the <h1> content
 *   subtext  {string}    — paragraph below the headline
 *   features {Array}     — [{ icon, label, sub }]
 */
const AuthBrandPanel = ({ dark, mounted, badge, headline, tagline, subtext }) => (
    <div
        className="space-y-8"
        style={mounted ? { animation: 'fadeUp 0.6s ease both' } : { opacity: 0 }}
    >
        {/* Badge */}
        <div className={` mt-4
      inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold
      border backdrop-blur-sm
      ${dark
                ? 'bg-teal-900/30 border-teal-700/50 text-teal-300'
                : 'bg-teal-50 border-teal-200 text-teal-700'
            }
    `}>
            <FaCompass className="text-teal-500 text-xs" />
            {badge}
        </div>

        {/* Headline */}
        <div>
            <h1 className="mt-8 text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                {headline}
            </h1>
            {tagline && (
                <h2 className={`mt-8 text-lg italic font-medium ${dark ? 'text-teal-300/90' : 'text-teal-600/90'
                    }`}>
                    {tagline}
                </h2>

            )}
            <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                {subtext}
            </p>
        </div>


    </div>
);

export default AuthBrandPanel;