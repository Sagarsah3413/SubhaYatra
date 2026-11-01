import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';

/**
 * Right-side auth section.
 *
 * When signed OUT → Search icon + Sign In (ghost) + Sign Up (solid teal)
 * When signed IN  → Search icon + UserButton avatar
 *
 * The difference is driven by Clerk's <SignedIn> / <SignedOut> wrappers,
 * plus the clerkAvailable prop for any pre-render checks.
 *
 * Props:
 *   theme          {string}    'dark' | 'light'
 *   clerkAvailable {boolean}   !!user from useUser()
 *   onNavigation   {Function}
 *   onSearchOpen   {Function}
 */
const AuthSection = ({ theme, onNavigation, onSearchOpen }) => {
    const { t } = useTranslation();

    const ghostBtn = `
    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
    border transition-all duration-200
    ${theme === 'dark'
            ? 'border-[#2E4A6B] text-slate-300 hover:border-[#3D6A9A] hover:text-white hover:bg-[#1A2E4A]'
            : 'border-slate-300 text-slate-600 hover:border-[#2356A0] hover:text-[#1A2E4A] hover:bg-[#E8EFF8]'
        }
  `;

    const solidBtn = `
    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
    bg-[#C0392B] hover:bg-[#A93226] text-white
    transition-all duration-200 shadow-sm hover:shadow-md
  `;

    return (
        <div className="flex items-center gap-2 shrink-0">

            {/* Search icon — always visible */}
            <button
                onClick={onSearchOpen}
                aria-label="Search"
                className={`
          p-2 rounded-lg transition-all duration-200
          ${theme === 'dark'
                        ? 'text-slate-400 hover:text-white hover:bg-[#1A2E4A]'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }
        `}
            >
                <FaSearch className="w-3.5 h-3.5" />
            </button>

            {/* ── Signed OUT ──────────────────────────────────────── */}
            <SignedOut>
                {/* Sign In — ghost */}
                <button
                    type="button"
                    onClick={() => onNavigation('/sign-in')}
                    className={ghostBtn}
                >
                    {t('header.signIn', 'Sign in')}
                </button>

                {/* Sign Up — solid */}
                <button
                    type="button"
                    onClick={() => onNavigation('/sign-up')}
                    className={solidBtn}
                >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    {t('header.signUp', 'Sign up')}
                </button>
            </SignedOut>

            {/* ── Signed IN ───────────────────────────────────────── */}
            <SignedIn>
                <div className={`
          p-1 rounded-xl border transition-all duration-200 pb-0
          ${theme === 'dark'
                        ? 'border-[#2E4A6B] hover:border-[#D97706]'
                        : 'border-slate-200 hover:border-[#2356A0]'
                    }
        `}>

                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-7 h-7 rounded-lg ",
                                userButtonPopoverCard:
                                    "shadow-2xl  bg-white/95 dark:bg-[#0F1B2D]/95 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-[#2E4A6B] ",
                                userButtonPopoverActionButton:
                                    "hover:bg-slate-50 dark:hover:bg-[#1A2E4A] rounded-lg",
                                userButtonPopoverActionButtonText:
                                    "text-slate-700 dark:text-slate-200 text-sm",
                                userButtonPopoverFooter: "hidden",
                            },
                            layout: {
                                placement: "bottom-end",
                            },
                        }}
                        userProfileMode="modal"
                    />
                </div>
            </SignedIn>
        </div>
    );
};

export default AuthSection;