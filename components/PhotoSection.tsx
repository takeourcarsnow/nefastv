/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from 'react';
import { TerminalLines } from './TerminalLines.tsx';
import { useSection } from './SectionContext.tsx';
import { useFetchJson } from './hooks.ts';
import { useFlattenPhotos } from '../lib/utils/flattenPhotos.ts';
import { InstagramEmbed } from './InstagramEmbed.tsx';
import { AlbumItemComponent } from './AlbumItem.tsx';
import { PhotoItemComponent } from './PhotoItem.tsx';
import type { PhotoEntry, PhotoItem, AlbumItem } from '../lib/types/content.ts';
import { ViewerModal } from './ViewerModal.tsx';

interface FlatPhoto extends PhotoItem { albumTitle?: string; }

export const PhotoSection: React.FC = () => {
  const { active } = useSection();
  const { data, loading, error } = useFetchJson<PhotoEntry[]>('/data/photos.json');
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const [flatPhotos, albums]: [FlatPhoto[], AlbumItem[]] = useFlattenPhotos(data);

  return (
    <div
      id="photo-content"
      className="content-section"
      style={{ display: active === 'photo-content' ? 'block' : 'none' }}
    >
  <h2>&gt; photography</h2>
      <TerminalLines sectionId="photo-content" />
      <p>i point my camera at things. mostly around the streets.</p>

      <InstagramEmbed />

      {loading && <p>Loading photos...</p>}
      {error && <p style={{ color: 'red' }}>[ERROR] {error}</p>}
      {!loading && !error && (
        <div className="grid-container">
          {albums.map((a) => (
            <AlbumItemComponent
              key={a.title}
              album={a}
              onClick={() => setViewerIndex(flatPhotos.findIndex(p => p.albumTitle === a.title))}
            />
          ))}
            {flatPhotos.map((p: FlatPhoto, i: number) => (
            <PhotoItemComponent
              key={p.image + i}
              photo={p}
              onClick={() => setViewerIndex(i)}
            />
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
