/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from 'next';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'nefas.tv - VISUALS, VIBES & VARIOUS EXPERIMENTS',
  description: 'A vaporwave-inspired personal website with retro aesthetics and interactive elements',
  viewport: 'width=device-width, initial-scale=1',
  metadataBase: new URL('https://nefas.tv'),
  themeColor: '#0a0a0a',
  openGraph: {
    title: 'nefas.tv - VISUALS, VIBES & VARIOUS EXPERIMENTS',
    description: 'A vaporwave-inspired personal website with retro aesthetics and interactive elements',
    url: 'https://nefas.tv',
    siteName: 'nefas.tv'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "nefas.tv",
    "url": "https://nefas.tv",
    "description": "A vaporwave-inspired personal website with retro aesthetics and interactive elements"
  };

  return (
    <html lang="en">
      <head>
        {/* Load VT323 from Google Fonts for the App Router (public/index.html is not used) */}
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="author" content="nefas" />
        <meta name="robots" content="index,follow" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body style={{ fontFamily: 'VT323, monospace', background: 'linear-gradient(135deg,#0a0a0a 0%,#0a0a0f 25%,#0a0a0a 50%,#0f0a0f 75%,#0a0a0a 100%)', color: '#00ff9d' }}>
        {children}
      </body>
    </html>
  );
}
