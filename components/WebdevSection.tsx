/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { TerminalLines } from './TerminalLines.tsx';
import { useSection } from './SectionContext.tsx';
import { useFetchJson } from './hooks.ts';
import type { WebdevProjectItem } from '../lib/types/content.ts';

export const WebdevSection: React.FC = () => {
  const { active } = useSection();
  const { data, loading, error } = useFetchJson<WebdevProjectItem[]>('/data/webdev.json');
  return (
    <div 
      id="webdev-content" 
      className="content-section"
      style={{ display: active === 'webdev-content' ? 'block' : 'none' }}
    >
  <h2>&gt; webdev projects</h2>
      <TerminalLines sectionId="webdev-content" />
      <p>i occasionally write code that gets deployed to the internet. no startup grind, no VC buzzwords — just late-night commits and whatever felt fun to build.</p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>[ERROR] {error}</p>}
      <div className="grid-container">
  {data?.map((p: WebdevProjectItem) => (
          <div key={p.title} className="grid-item">
            <img src={p.image} alt={p.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 6 }} />
            <h3>{p.title}</h3>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
