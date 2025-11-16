import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import TawkToWidget from '@/components/TawkToWidget';
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import StructuredData from '@/components/StructuredData';
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blogme.africa';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Blogme - You to the World",
    template: "%s | Blogme",
  },
  description: "A platform for sharing your stories with the world. Connect, share your thoughts, and read amazing articles from writers around the globe.",
  keywords: ["blog", "writing", "stories", "articles", "community", "platform", "content creation", "publishing"],
  authors: [{ name: "Blogme Team" }],
  creator: "Blogme",
  publisher: "Blogme",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Blogme",
    title: "Blogme - You to the World",
    description: "A platform for sharing your stories with the world. Connect, share your thoughts, and read amazing articles from writers around the globe.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Blogme - You to the World",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogme - You to the World",
    description: "A platform for sharing your stories with the world",
    images: [`${baseUrl}/og-image.jpg`],
    creator: "@blogme",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: baseUrl,
    types: {
      'application/rss+xml': `${baseUrl}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="dark:bg-zinc-950 bg-gray-50">
        <ClerkProvider
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: '#f97316',
              colorText: '#18181b',
              colorTextSecondary: '#52525b',
              colorBackground: '#ffffff',
              colorInputBackground: '#ffffff',
              colorInputText: '#18181b',
              borderRadius: '0.75rem',
              fontFamily: 'Inter, sans-serif',
            },
            elements: {
              modalContent: 'rounded-3xl shadow-2xl bg-white dark:bg-zinc-900',
              modal: 'items-center justify-center',
              modalBackdrop: 'bg-black/60 dark:bg-black/70 backdrop-blur-sm',
              card: 'bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8',
              headerTitle: 'text-2xl md:text-3xl font-bold text-gray-900 dark:text-zinc-50',
              headerSubtitle: 'text-gray-600 dark:text-zinc-400 text-base md:text-lg',
              header: 'text-center mb-6',
              socialButtonsBlockButton: 'bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-50 border-2 border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-semibold transition-all duration-200 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md w-full mb-3',
              socialButtonsBlockButtonText: 'text-gray-900 dark:text-zinc-50 font-semibold',
              formButtonPrimary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full',
              formFieldInput: 'bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-gray-900 dark:text-zinc-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 w-full',
              formFieldLabel: 'text-gray-700 dark:text-zinc-300 font-semibold mb-2',
              formFieldInputShowPasswordButton: 'text-gray-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400',
              footerActionLink: 'text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 font-semibold transition-colors',
              dividerLine: 'bg-gray-200 dark:bg-zinc-700',
              dividerText: 'text-gray-500 dark:text-zinc-400 font-medium',
              formResendCodeLink: 'text-orange-500 dark:text-orange-400 hover:text-orange-600 font-semibold',
              footerAction: 'text-gray-600 dark:text-zinc-400 text-sm md:text-base',
              footerActionLink__signIn: 'text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 font-semibold',
              footerActionLink__signUp: 'text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 font-semibold',
              formFieldErrorText: 'text-red-500 dark:text-red-400 text-sm',
              alertText: 'text-gray-600 dark:text-zinc-400 text-sm',
              formFieldSuccessText: 'text-green-600 dark:text-green-400 text-sm',
              identityPreviewText: 'text-gray-900 dark:text-zinc-50',
              identityPreviewEditButton: 'text-orange-500 dark:text-orange-400 hover:text-orange-600',
            },
            layout: {
              socialButtonsPlacement: 'top',
            },
          }}
        >
          <SpeedInsights />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast: 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-lg',
                title: 'text-gray-900 dark:text-zinc-50',
                description: 'text-gray-600 dark:text-zinc-400',
                success: 'border-green-200 dark:border-green-800',
                error: 'border-red-200 dark:border-red-800',
                warning: 'border-yellow-200 dark:border-yellow-800',
                info: 'border-blue-200 dark:border-blue-800',
              },
            }}
          />
          <TawkToWidget />
          <ErrorBoundary>
            <StructuredData
              type="Organization"
              data={{}}
            />
            <StructuredData
              type="WebSite"
              data={{}}
            />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ErrorBoundary>
        </ClerkProvider>
      </body>
    </html>
  )
}

