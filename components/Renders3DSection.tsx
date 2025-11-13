/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { TerminalLines } from './TerminalLines.tsx';
import { useSection } from './SectionContext.tsx';
import { useFetchJson } from './hooks.ts';
import type { Render3DItem } from '../lib/types/content.ts';

export const Renders3DSection: React.FC = () => {
  const { active } = useSection();
  const { data, loading, error } = useFetchJson<Render3DItem[]>('/data/3d.json');
  return (
    <div 
      id="3d-content" 
      className="content-section"
      style={{ display: active === '3d-content' ? 'block' : 'none' }}
    >
  <h2>&gt; 3D stuff</h2>
      <TerminalLines sectionId="3d-content" />
  <p>some abstract pixel statues i cooked up in blender, c4d, and houdini. it&apos;s mostly shiny spheres and particle nonsense. click to expand</p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>[ERROR] {error}</p>}
      <div className="grid-container">
  {data?.map((r: Render3DItem) => (
          <div key={r.title} className="grid-item">
            <img src={r.thumbnail} alt={r.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 6 }} />
            <h3>{r.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
