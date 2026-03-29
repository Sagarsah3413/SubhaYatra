/**
 * Returns a Clerk `appearance` config object driven by the current theme.
 * Used by both SignInPage and SignUpPage to keep Clerk styling in sync.
 *
 * NOT a hook — named getClerkAppearance deliberately.
 * Call it anywhere: inside useMemo, directly in render, or at module level.
 *
 * @param {boolean} dark
 * @returns {object} Clerk appearance config
 */
export const getClerkAppearance = (dark = false) => ({
    elements: {
        rootBox: 'w-full',
        card: 'bg-transparent shadow-none border-0 p-0 w-full',

        headerTitle: `${dark ? 'text-white' : 'text-slate-900'} text-xl font-bold`,
        headerSubtitle: `${dark ? 'text-slate-400' : 'text-slate-500'} text-sm`,

        formButtonPrimary: [
            'w-full bg-linear-to-r from-teal-600 to-cyan-600',
            'hover:from-teal-700 hover:to-cyan-700',
            'text-white font-semibold py-3 px-6 rounded-xl',
            'shadow-lg hover:shadow-xl transition-all duration-200 border-0',
        ].join(' '),

        formFieldInput: [
            'w-full rounded-xl py-3 px-4 text-sm transition-all duration-200',
            'border focus:outline-none focus:ring-2 focus:ring-teal-500/50',
            dark
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-teal-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-teal-400',
        ].join(' '),

        formFieldLabel: `${dark ? 'text-slate-300' : 'text-slate-700'} text-sm font-medium`,

        dividerLine: dark ? 'bg-slate-700' : 'bg-slate-200',
        dividerText: `${dark ? 'text-slate-500' : 'text-slate-400'} text-xs`,

        socialButtonsBlockButton: [
            'w-full rounded-xl py-3 px-4 border text-sm font-medium transition-all duration-200',
            dark
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
        ].join(' '),

        footerActionLink: 'text-teal-500 hover:text-teal-400 font-semibold transition-colors duration-200',
        identityPreviewText: dark ? 'text-slate-300' : 'text-slate-700',
        identityPreviewEditButton: 'text-teal-500 hover:text-teal-400',
        formResendCodeLink: 'text-teal-500 hover:text-teal-400',

        otpCodeFieldInput: [
            'rounded-xl text-center border focus:ring-2 focus:ring-teal-500/50',
            dark
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-white border-slate-200 text-slate-900',
        ].join(' '),

        formFieldSuccessText: 'text-emerald-500 text-xs',
        formFieldErrorText: 'text-red-400 text-xs',

        alertClerkAPIResponseError: [
            'rounded-xl border text-sm p-3',
            dark
                ? 'bg-red-900/20 border-red-800/50 text-red-300'
                : 'bg-red-50 border-red-200 text-red-600',
        ].join(' '),

        formFieldHintText: `${dark ? 'text-slate-500' : 'text-slate-400'} text-xs`,
    },
});