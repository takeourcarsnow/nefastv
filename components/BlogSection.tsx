"use client";
import React, { useEffect, useCallback, useState } from 'react';
import { useSection } from './SectionContext.tsx';
import { useTerminalTyping } from '../lib/hooks/useTerminalTyping.ts';
import { usePersistedState } from '../lib/hooks/usePersistedState.ts';
import { BlogSnippet } from './BlogSnippet.tsx';

interface Post { id: string; title: string; date: string; tags: string[]; content: { en: string[]; lt?: string[] }; }

export const BlogSection: React.FC = () => {
  const { active } = useSection();
  const [posts, setPosts] = useState<Post[]>([]);
  const [expanded, setExpanded] = usePersistedState<Set<string>>('expandedPosts', new Set());
  const [lang, setLang] = usePersistedState<'en' | 'lt'>('blogLang', 'en');

  const { terminalRef, terminalDone } = useTerminalTyping(active === 'blog-content', 'blog');

  // Load posts once terminal finished (or in parallel but render after)
  useEffect(() => {
    if (active !== 'blog-content') return;
    fetch('/data/posts.json').then(r => r.json()).then((p: Post[]) => setPosts(p));
  }, [active]);

  const toggle = useCallback((title: string) => {
    console.log('[BlogSection] toggle called for', title);
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      console.log('[BlogSection] expanded now', [...next]);
      return next;
    });
  }, [setExpanded]);

  return (
    <div
      id="blog-content"
      className="content-section"
      style={{ display: active === 'blog-content' ? 'block' : 'none' }}
    >
      <div ref={terminalRef} id="blog-terminal-output" className="terminal-output" />
      {terminalDone && (
        <div style={{ marginTop: 24 }}>
          {posts.map((p, idx) => (
            <BlogSnippet
              key={p.id ?? p.title ?? idx}
              post={p}
              index={idx}
              isOpen={expanded.has(p.title)}
              lang={lang}
              setLang={setLang}
              onToggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
