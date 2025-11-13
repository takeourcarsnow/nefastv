"use client";
import React from 'react';
import { LazyImage } from './LazyImage.tsx';
import type { PhotoItem } from '../lib/types/content.ts';

interface FlatPhoto extends PhotoItem { albumTitle?: string; }

interface PhotoItemProps {
  photo: FlatPhoto;
  onClick: () => void;
}

export const PhotoItemComponent: React.FC<PhotoItemProps> = ({ photo, onClick }) => {
  return (
    <div className="grid-item photo-item" style={{ cursor: 'pointer' }} onClick={onClick}>
      <LazyImage
        src={photo.thumbnail || photo.image}
        alt={photo.title}
        style={{ width: '100%', height: 200, borderRadius: 6 }}
      />
      <h3>{photo.title}</h3>
      <p style={{ margin: 0 }}>{photo.description}</p>
      {photo.albumTitle && (
        <p style={{ fontSize: '0.8em', color: 'var(--accent-color)', margin: '4px 0' }}>
          Album: {photo.albumTitle}
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
          {new Date((photo as unknown as { date?: string })?.date ?? '2025-01-01').toLocaleDateString()}
        </span>
        <span className="photo-tags" style={{ color: 'var(--accent-color)', fontFamily: 'var(--mono-font)' }}>
          {(Array.isArray((photo as unknown as { tags?: string[] })?.tags) ? ((photo as unknown as { tags?: string[] })?.tags!.map((tag: string) => `#${tag}`).join(' ')) : '#photo')}
        </span>
      </div>
    </div>
  );
};