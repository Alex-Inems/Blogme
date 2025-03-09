import type { Metadata } from "next";
import {  ClerkProvider} from '@clerk/nextjs';
import { SpeedInsights } from "@vercel/speed-insights/next";
import TawkToWidget from '@/components/TawkToWidget';

export const metadata: Metadata = {
  title: "Blogme",
  description: "You to the World",

};
import './globals.css'

import Footer from "@/components/Footer";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    {/* <head>
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </head> */}
        <body className="dark:bg-gray-950">

        <ClerkProvider>
        <SpeedInsights/>
        <TawkToWidget />
          {children}
          <Footer/> 
    </ClerkProvider>
        </body>
       
      </html>
  )
}

