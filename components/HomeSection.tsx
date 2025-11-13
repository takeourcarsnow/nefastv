/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { TerminalLines } from './TerminalLines.tsx';
import { useSection } from './SectionContext.tsx';
import { useLatest } from '../lib/hooks/useLatest.ts';
import { ContentBlock } from './ContentBlock.tsx';
import type { PhotoEntry, Render3DItem, VideoItem, WebdevProjectItem, BlogPostMeta } from '../lib/types/content.ts';

export const HomeSection: React.FC = () => {
  const { active, setActive } = useSection();
  const blogs = useLatest<BlogPostMeta>('/data/posts.json');
  const videos = useLatest<VideoItem>('/data/videos.json');
  const photos = useLatest<PhotoEntry>('/data/photos.json');
  const renders3d = useLatest<Render3DItem>('/data/3d.json');
  const webdev = useLatest<WebdevProjectItem>('/data/webdev.json');

  return (
    <div
      id="home-content"
      className="content-section"
      style={{ display: active === 'home-content' ? 'block' : 'none' }}
    >
      <TerminalLines sectionId="home-content" />
      <ContentBlock title="> latest web stuff" caption="building and hoping that it just works" onJump={() => setActive('webdev-content')}>
        {webdev.loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid-container">
            {webdev.data.map((p, idx) => {
              const obj = p as unknown as { id?: string; image?: string; title?: string; date?: string };
              const key = obj.id ?? obj.title ?? idx;
              return (
                <a key={key} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('webdev-content'); }}>
                  <img src={obj.image ?? ''} alt={obj.title ?? 'untitled'} style={{ width: '100%', height: 120, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />
                  <div>
                    <p className="home-post-type">[WEBDEV]</p>
                    <h4 className="home-post-title">{obj.title ?? 'untitled'}</h4>
                  </div>
                  <div>
                    <p className="home-post-date">{obj.date ? new Date(obj.date).toLocaleDateString() : ''}</p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </ContentBlock>
      <ContentBlock title="> fresh photos" caption="megapixels and emulsion" onJump={() => setActive('photo-content')}>
        {photos.loading ? <p>Loading...</p> : (
          <div className="grid-container">
            {photos.data.map((p, idx) => {
              if ((p as unknown as { type?: string }).type === 'album') {
                const a = p as unknown as { title?: string; coverImage?: string; date?: string; description?: string };
                const key = a.title ?? a.coverImage ?? idx;
                return (
                  <a key={key} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('photo-content'); }}>
                    <img src={a.coverImage} alt={a.title} style={{ width: '100%', height: 120, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />
                    <div>
                      <p className="home-post-type">[ALBUM]</p>
                      <h4 className="home-post-title">{a.title}</h4>
                    </div>
                    <div>
                      <p className="home-post-date">{a.date ? new Date(a.date).toLocaleDateString() : ''}</p>
                    </div>
                  </a>
                );
              }
              const photo = p as unknown as { title?: string; thumbnail?: string; date?: string; description?: string };
              return (
                <a key={photo.title ?? photo.thumbnail ?? idx} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('photo-content'); }}>
                  <img src={photo.thumbnail} alt={photo.title} style={{ width: '100%', height: 120, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />
                  <div>
                    <p className="home-post-type">[PHOTO]</p>
                    <h4 className="home-post-title">{photo.title}</h4>
                  </div>
                  <div>
                    <p className="home-post-date">{photo.date ? new Date(photo.date).toLocaleDateString() : ''}</p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </ContentBlock>
      <ContentBlock title="> new renders" caption="fresh cgi right off the gpu" onJump={() => setActive('3d-content')}>
        {renders3d.loading ? <p>Loading...</p> : (
          <div className="grid-container">
            {renders3d.data.map((r, idx) => {
              const rKey = ((r as unknown as { id?: string }).id) ?? r.title ?? r.thumbnail ?? idx;
              return (
              <a key={rKey} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('3d-content'); }}>
                <img src={r.thumbnail} alt={r.title} style={{ width: '100%', height: 120, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />
                <div>
                  <p className="home-post-type">[3D]</p>
                  <h4 className="home-post-title">{r.title}</h4>
                </div>
                <div>
                  <p className="home-post-date">{new Date(r.date).toLocaleDateString()}</p>
                </div>
              </a>
            )})}
          </div>
        )}
      </ContentBlock>
  <ContentBlock title="> latest videos" caption="a collection of moving pictures. i&apos;ll replace these with my own stuff eventually. probably." onJump={() => setActive('video-content')}>
        {videos.loading ? <p>Loading...</p> : (
          <div className="grid-container">
            {videos.data.map((v, idx) => {
              const vKey = ((v as unknown as { id?: string }).id) ?? v.title ?? v.thumbnail ?? idx;
              return (
              <a key={vKey} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('video-content'); }}>
                <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: 120, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />
                <div>
                  <p className="home-post-type">[VIDEO]</p>
                  <h4 className="home-post-title">{v.title}</h4>
                </div>
                <div>
                  <p className="home-post-date">{new Date(v.date).toLocaleDateString()}</p>
                </div>
              </a>
            )})}
          </div>
        )}
      </ContentBlock>
      <ContentBlock title="> recent blogs" caption="fresh thoughts for your brain" onJump={() => setActive('blog-content')}>
        {blogs.loading ? <p>Loading...</p> : (
          <div className="grid-container">
            {blogs.data.map((b, idx) => (
              <a key={b.id ?? b.title ?? idx} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('blog-content'); }}>
                <div>
                  <p className="home-post-type">[BLOG]</p>
                  <h4 className="home-post-title">{b.title}</h4>
                </div>
                <div>
                  <p className="home-post-date">{new Date(b.date).toLocaleDateString()}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </ContentBlock>
    </div>
  );
};
