import { SignIn } from '@clerk/nextjs';

export default function SiginInPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden py-8 px-4">
      {/* Wallpaper Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&q=80&auto=format&fit=crop)',
        }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 dark:from-black/80 dark:via-black/70 dark:to-black/80"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Sign In Container - Let Clerk handle its own card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <SignIn
          appearance={{
          elements: {
              rootBox: 'w-full mx-auto',
              card: 'bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-zinc-700/50 p-6 md:p-8',
              headerTitle: 'text-2xl md:text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-2',
              headerSubtitle: 'text-gray-600 dark:text-zinc-400 text-base md:text-lg',
              header: 'text-center mb-6',
              socialButtonsBlockButton: 'bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-50 border-2 border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-semibold transition-all duration-200 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md w-full mb-3',
              socialButtonsBlockButtonText: 'text-gray-900 dark:text-zinc-50 font-semibold',
              formButtonPrimary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full',
              formFieldInput: 'bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-gray-900 dark:text-zinc-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 w-full',
              formFieldLabel: 'text-gray-700 dark:text-zinc-300 font-semibold mb-2',
              formFieldInputShowPasswordButton: 'text-gray-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400',
              footerActionLink: 'text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 font-semibold transition-colors',
              identityPreviewText: 'text-gray-900 dark:text-zinc-50',
              identityPreviewEditButton: 'text-orange-500 dark:text-orange-400 hover:text-orange-600',
              dividerLine: 'bg-gray-200 dark:bg-zinc-700',
              dividerText: 'text-gray-500 dark:text-zinc-400 font-medium',
              formResendCodeLink: 'text-orange-500 dark:text-orange-400 hover:text-orange-600 font-semibold',
              footerAction: 'text-gray-600 dark:text-zinc-400 text-sm md:text-base',
              footerActionLink__signIn: 'text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 font-semibold',
              footerActionLink__signUp: 'text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 font-semibold',
              formFieldErrorText: 'text-red-500 dark:text-red-400 text-sm',
              alertText: 'text-gray-600 dark:text-zinc-400 text-sm',
              formFieldSuccessText: 'text-green-600 dark:text-green-400 text-sm',
            },
            layout: {
              socialButtonsPlacement: 'top',
            },
          }}
        />
      </div>
    </main>
  );
}