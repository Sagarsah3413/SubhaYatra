import React from 'react';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';

/**
 * Sign-up button (signed out) or UserButton avatar (signed in).
 *
 * Props:
 *   onNavigation {Function}
 *   theme        {string}
 */
const AuthenticationButtons = ({ onNavigation, theme }) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-3">
            <SignedOut>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onNavigation('/sign-up');
                    }}
                    className={`
            group relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300
            transform-gpu will-change-transform overflow-hidden btn-professional
            bg-linear-to-r from-teal-600 via-emerald-600 to-cyan-600
            hover:from-teal-700 hover:via-emerald-700 hover:to-cyan-700
            text-white shadow-lg hover:shadow-xl hover:scale-105
            border border-teal-500/30 backdrop-blur-sm cursor-pointer z-10
          `}
                >
                    <span className="relative z-10 flex items-center gap-2.5 pointer-events-none">
                        <div className="p-1 rounded-md bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                        </div>
                        <span className="font-bold">{t('header.signUp')}</span>
                    </span>
                    {/* Shimmer */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                </button>
            </SignedOut>

            <SignedIn>
                <div
                    className={`
            flex items-center p-2 rounded-xl border backdrop-blur-xl transition-all duration-300
            hover:shadow-lg hover:scale-105 transform-gpu
            ${theme === 'dark'
                            ? 'border-teal-700/50 bg-teal-900/30 hover:bg-teal-800/40'
                            : 'border-teal-200/50 bg-teal-50/30 hover:bg-teal-100/40'
                        }
          `}
                    style={{ zIndex: 9999 }}
                >
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: 'w-8 h-8 rounded-lg',
                                userButtonPopoverCard: 'shadow-2xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl !fixed !top-16 !right-4 z-[9999]',
                                userButtonPopoverActionButton: 'hover:bg-teal-50 dark:hover:bg-teal-900/50 cursor-pointer',
                                userButtonPopoverActionButtonText: 'text-slate-700 dark:text-slate-200',
                                userButtonPopoverActionButtonIcon: 'text-slate-600 dark:text-slate-300',
                                userButtonPopoverFooter: 'hidden',
                            },
                            layout: { shimmer: true },
                        }}
                        userProfileMode="modal"
                        userProfileProps={{ appearance: { elements: { rootBox: 'z-[9999]', card: 'shadow-2xl' } } }}
                    />
                </div>
            </SignedIn>
        </div>
    );
};

export default AuthenticationButtons;