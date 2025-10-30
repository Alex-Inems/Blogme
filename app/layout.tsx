import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from "@vercel/speed-insights/next";
import TawkToWidget from '@/components/TawkToWidget';
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import './globals.css'

export const metadata: Metadata = {
  title: "Blogme - You to the World",
  description: "A platform for sharing your stories with the world. Connect, share your thoughts, and read amazing articles from writers around the globe.",
  keywords: "blog, writing, stories, articles, community, platform",
  authors: [{ name: "Blogme Team" }],
  openGraph: {
    title: "Blogme - You to the World",
    description: "A platform for sharing your stories with the world",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="dark:bg-gray-950 bg-gray-50">
        <ClerkProvider>
          <SpeedInsights />
          <TawkToWidget />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  )
}

