import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Script from "next/script";
import CookieBanner from "@/app/components/CookieBanner";
import InstallPrompt from "@/app/components/InstallPrompt";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://onlyforteachers.co.uk'),
  title: {
    default: 'Only for Teachers - The UK Teacher Community',
    template: '%s | Only for Teachers',
  },
  description: 'Join the free UK teacher community. Take weekly surveys, earn points and rewards for sharing your professional opinion.',
  keywords: ['teachers', 'UK teachers', 'teacher survey', 'teacher community', 'teacher rewards'],
  authors: [{ name: 'Only for Teachers' }],
  creator: 'Only for Teachers',
  icons: {
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://onlyforteachers.co.uk',
    siteName: 'Only for Teachers',
    title: 'Only for Teachers - The UK Teacher Community',
    description: 'Join the free UK teacher community. Take weekly surveys, earn points and rewards for sharing your professional opinion.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Only for Teachers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Only for Teachers - The UK Teacher Community',
    description: 'Join the free UK teacher community. Take weekly surveys, earn points and rewards.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Only for Teachers',
  url: 'https://onlyforteachers.co.uk',
  logo: 'https://onlyforteachers.co.uk/logo.png',
  description: 'Free UK teacher community for weekly surveys and rewards',
  sameAs: [
    'https://www.instagram.com/onlyforteachers.co.uk',
    'https://www.linkedin.com/company/only-for-teachers',
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B3A2D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Only for Teachers" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F5EDE0] font-sans text-[#2C2C2C]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QB8MZV2H75"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', { analytics_storage: 'denied' });
            var consent = localStorage.getItem('cookie_consent');
            if (consent === 'accepted') {
              gtag('consent', 'update', { analytics_storage: 'granted' });
            } else if (consent === 'essential') {
              window['ga-disable-G-QB8MZV2H75'] = true;
            }
            gtag('config', 'G-QB8MZV2H75', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Navbar user={user} />
        <div className={`flex flex-col flex-1 ${user ? "md:ml-[260px]" : ""}`}>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
        <Script id="register-sw" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }`}
        </Script>
        <CookieBanner />
        <InstallPrompt />
        <SpeedInsights />
      </body>
    </html>
  );
}
