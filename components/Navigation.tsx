"use client";
import React from 'react';
import { useSection, SectionId } from './SectionContext.tsx';

const sections: { id: SectionId; label: string }[] = [
  { id: 'home-content', label: '[ home ]' },
  { id: 'video-content', label: '[ video ]' },
  { id: 'photo-content', label: '[ photo ]' },
  { id: '3d-content', label: '[ 3d ]' },
  { id: 'webdev-content', label: '[ webdev ]' },
  { id: 'blog-content', label: '[ blog ]' },
  { id: 'misc-content', label: '[ misc ]' }
];

export const Navigation: React.FC = () => {
  const { active, setActive } = useSection();
  return (
    <nav id="main-nav">
      {sections.map(s => (
        <a
          key={s.id}
          data-section={s.id}
          onClick={(e) => { e.preventDefault(); setActive(s.id); }}
          className={active === s.id ? 'active' : ''}
          href={`#${s.id}`}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
};
