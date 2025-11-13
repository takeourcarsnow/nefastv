"use client";
import React from 'react';
import { useSection } from './SectionContext.tsx';
import { sectionTerminalContent } from '../data/sectionTerminalContent.ts';
import { useTypewriter } from '../hooks/useTypewriter.ts';

export const TerminalLines: React.FC<{ sectionId: string }> = ({ sectionId }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { active } = useSection();
  const shouldType = active === sectionId;
  useTypewriter(ref, sectionTerminalContent[sectionId], shouldType, sectionId);
  return <div ref={ref} className="terminal-output" style={{ minHeight: 8 }} />;
};