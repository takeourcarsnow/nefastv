"use client";
import React, { Suspense } from 'react';
import { Header } from './Header.tsx';
import { BackgroundEffects } from './BackgroundEffects.tsx';
import { WinampPlayer } from './WinampPlayer.tsx';
import { Navigation } from './Navigation.tsx';
import { FooterTimestamp } from './FooterTimestamp.tsx';
import { SectionProvider } from './SectionContext.tsx';
import { usePerformanceMonitor } from './hooks.ts';
import { ErrorBoundary } from './ErrorBoundary.tsx';

// Use React.lazy for client-side code splitting (avoids importing next/dynamic types in client files)
const HomeSection = React.lazy(() => import('./HomeSection.tsx').then((m) => ({ default: m.HomeSection })));
const BlogSection = React.lazy(() => import('./BlogSection.tsx').then((m) => ({ default: m.BlogSection })));
const PhotoSection = React.lazy(() => import('./PhotoSection.tsx').then((m) => ({ default: m.PhotoSection })));
const VideoSection = React.lazy(() => import('./VideoSection.tsx').then((m) => ({ default: m.VideoSection })));
const Renders3DSection = React.lazy(() => import('./Renders3DSection.tsx').then((m) => ({ default: m.Renders3DSection })));
const WebdevSection = React.lazy(() => import('./WebdevSection.tsx').then((m) => ({ default: m.WebdevSection })));
const MiscSection = React.lazy(() => import('./MiscSection.tsx').then((m) => ({ default: m.MiscSection })));

const Inner: React.FC = () => {
  usePerformanceMonitor();

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (tgt) {
        // keep this lightweight for dev diagnostics only
        // eslint-disable-next-line no-console
        console.debug('[LayoutShell] click:', tgt.tagName, tgt.className, tgt.id);
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  return (
    <>
      <BackgroundEffects />
      <div className="site-container">
        <Header />
        <WinampPlayer />
        <Navigation />
        <main id="content-area">
          <ErrorBoundary>
            <Suspense fallback={<div className="section-loading">Loading sections...</div>}>
              <HomeSection />
              <VideoSection />
              <PhotoSection />
              <Renders3DSection />
              <WebdevSection />
              <BlogSection />
              <MiscSection />
            </Suspense>
          </ErrorBoundary>
        </main>
        <footer>
          <div className="footer-content">
            <div className="footer-left">
              <FooterTimestamp />
              <span className="footer-status">[ ONLINE ]</span>
            </div>
            <div className="footer-center">
              <span>© 2025 nefas.tv</span>
            </div>
            <div className="footer-right">
              <span className="footer-terminal">terminal_active.exe</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export const LayoutShell: React.FC = () => {
  return (
    <SectionProvider>
      <Inner />
    </SectionProvider>
  );
};
