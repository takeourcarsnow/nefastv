/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { TerminalLines } from './TerminalLines.tsx';
import { useSection } from './SectionContext.tsx';
import { useFetchJson } from './hooks.ts';
import type { PhotoEntry, PhotoItem, AlbumItem } from '../types/content.ts';
import { ViewerModal } from './ViewerModal.tsx';
import { LazyImage } from './LazyImage.tsx';

interface FlatPhoto extends PhotoItem { albumTitle?: string; }

export const PhotoSection: React.FC = () => {
  const { active } = useSection();
  const { data, loading, error } = useFetchJson<PhotoEntry[]>('/data/photos.json');
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  
  // Load Instagram embed script when section becomes active
  useEffect(() => {
    if (active === 'photo-content' && !document.querySelector('script[src*="instagram.com/embed.js"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.instagram.com/embed.js';
      document.body.appendChild(script);
    }
  }, [active]);
  
  const [flatPhotos, albums] = useMemo(() => {
    if (!data) return [[], []] as [FlatPhoto[], AlbumItem[]];
    const flats: FlatPhoto[] = [];
    const albums: AlbumItem[] = [];
  data.forEach((item: PhotoEntry) => {
      if ((item as AlbumItem).type === 'album') {
        const album = item as AlbumItem;
        albums.push(album);
        album.photos.forEach(p => flats.push({ ...p, albumTitle: album.title }));
      } else {
        flats.push(item as PhotoItem);
      }
    });
    return [flats, albums];
  }, [data]);

  return (
    <div 
      id="photo-content" 
      className="content-section"
      style={{ display: active === 'photo-content' ? 'block' : 'none' }}
    >
  <h2>&gt; photography</h2>
      <TerminalLines sectionId="photo-content" />
      <p>i point my camera at things. mostly around the streets.</p>
      
      {/* Instagram Embed */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <h3 style={{ color: '#00ff9d', textAlign: 'center' }}>My Instagram Feed,<br />double-tap to boost my dopamine levels.</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <blockquote 
            className="instagram-media" 
            data-instgrm-permalink="https://www.instagram.com/nefotografija/" 
            data-instgrm-version="14" 
            style={{ 
              background: '#fff', 
              border: 0, 
              margin: '1em auto', 
              maxWidth: 540, 
              width: '100%', 
              minWidth: 326 
            }}
          >
            <a href="https://www.instagram.com/nefotografija/" target="_blank" rel="noopener" style={{ color: '#125688', fontWeight: 'bold' }}>
              View on Instagram
            </a>
          </blockquote>
        </div>
      </div>
      
      {loading && <p>Loading photos...</p>}
      {error && <p style={{ color: 'red' }}>[ERROR] {error}</p>}
      {!loading && !error && (
        <div className="grid-container">
          {albums.map((a: AlbumItem) => (
            <div key={a.title} className="grid-item album-item" style={{ cursor: 'pointer' }} onClick={() => setViewerIndex(flatPhotos.findIndex(p => p.albumTitle === a.title))}>
              <LazyImage 
                src={a.coverImage} 
                alt={a.title} 
                style={{ width: '100%', height: 200, borderRadius: 6 }} 
              />
              <h3>{a.title}</h3>
              <p style={{ margin: 0 }}>{a.description}</p>
              <div className="photo-meta" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: 'auto',
                paddingTop: 10,
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.8em'
              }}>
                <span className="photo-date" style={{ color: 'var(--secondary-color)' }}>
                  {new Date(a.date).toLocaleDateString()}
                </span>
                <span className="photo-tags" style={{ color: 'var(--accent-color)', fontFamily: 'var(--mono-font)' }}>
                  {a.tags?.map(tag => `#${tag}`).join(' ')}
                </span>
              </div>
            </div>
          ))}
            {flatPhotos.map((p: FlatPhoto, i: number) => (
            <div key={p.image + i} className="grid-item photo-item" style={{ cursor: 'pointer' }} onClick={() => setViewerIndex(i)}>
              <LazyImage 
                src={p.thumbnail || p.image} 
                alt={p.title} 
                style={{ width: '100%', height: 200, borderRadius: 6 }} 
              />
              <h3>{p.title}</h3>
              <p style={{ margin: 0 }}>{p.description}</p>
              {p.albumTitle && (
                <p style={{ fontSize: '0.8em', color: 'var(--accent-color)', margin: '4px 0' }}>
                  Album: {p.albumTitle}
                </p>
              )}
              <div className="photo-meta" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: 'auto',
                paddingTop: 10,
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.8em'
              }}>
                <span className="photo-date" style={{ color: 'var(--secondary-color)' }}>
                  {new Date((p as unknown as { date?: string })?.date ?? '2025-01-01').toLocaleDateString()}
                </span>
                <span className="photo-tags" style={{ color: 'var(--accent-color)', fontFamily: 'var(--mono-font)' }}>
                  {(Array.isArray((p as unknown as { tags?: string[] })?.tags) ? ((p as unknown as { tags?: string[] })?.tags!.map((tag: string) => `#${tag}`).join(' ')) : '#photo')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {viewerIndex !== null && viewerIndex >= 0 && (
        <ViewerModal
          photos={flatPhotos}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          setIndex={(i) => setViewerIndex(i)}
        />
      )}
    </div>
  );
};
