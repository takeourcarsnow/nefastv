/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef } from 'react';
import type { PhotoItem } from '../lib/types/content.ts';
import { useZoomPan } from '../lib/hooks/useZoomPan.ts';
import { useNavigation } from '../lib/hooks/useNavigation.ts';
import { useKeyboardNavigation } from '../lib/hooks/useKeyboardNavigation.ts';
import { useTouchSwipe } from '../lib/hooks/useTouchSwipe.ts';
import { ViewerModalButtons } from './ViewerModalButtons.tsx';
import { ViewerImageInfo } from './ViewerImageInfo.tsx';

interface ViewerModalProps {
  photos: PhotoItem[];
  index: number;
  onClose: () => void;
  setIndex: (i: number) => void;
}

export const ViewerModal: React.FC<ViewerModalProps> = ({ photos, index, onClose, setIndex }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const photo = photos[index];

  const {
    zoom,
    pan,
    isDragging,
    resetZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleImageClick,
    handleWheel
  } = useZoomPan();

  const { goNext, goPrev } = useNavigation(index, photos.length, setIndex, resetZoom);

  useKeyboardNavigation(onClose, goNext, goPrev);

  const { handleTouchStart, handleTouchEnd } = useTouchSwipe(goPrev, goNext);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // accessibility: trap focus inside modal and prevent background scroll
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // focus the container for screen readers / keyboard users
    const prevActive = document.activeElement as HTMLElement | null;
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'true');
    node.setAttribute('aria-label', photos[index]?.title ?? 'Image viewer');
    node.tabIndex = -1;
    node.focus({ preventScroll: true });

    function handleKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const nodeEl = node as HTMLElement;
      const focusable = nodeEl.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKey);
      if (prevActive) prevActive.focus();
    };
  }, [containerRef, index, photos]);

  if (!photo) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ViewerModalButtons zoom={zoom} onClose={onClose} goPrev={goPrev} goNext={goNext} />

      {/* Image container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '80%',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imgRef}
          src={photo.image}
          alt={photo.title}
          style={{
            maxWidth: zoom === 1 ? '90vw' : 'none',
            maxHeight: zoom === 1 ? '80vh' : 'none',
            width: zoom > 1 ? 'auto' : undefined,
            height: zoom > 1 ? 'auto' : undefined,
            objectFit: 'contain',
            borderRadius: 8,
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            cursor: zoom === 1 ? 'zoom-in' : (isDragging ? 'grabbing' : 'grab'),
            userSelect: 'none'
          }}
          onClick={handleImageClick}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          draggable={false}
        />
      </div>

      <ViewerImageInfo photo={photo} index={index} photosLength={photos.length} zoom={zoom} />
    </div>
  );
};
