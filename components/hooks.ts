"use client";
import { useEffect, useRef, useState } from 'react';

// Stable interval hook which stores the latest callback in a ref to avoid
// re-creating intervals when the callback changes identity.
export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function useNow() {
  const [now, setNow] = useState<Date>(new Date());
  useInterval(() => setNow(new Date()), 1000);
  return now;
}

export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

    const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
      for (const entry of list.getEntries()) {
        try {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            // eslint-disable-next-line no-console
            console.info(`Page load time: ${Math.round(navEntry.loadEventEnd - navEntry.fetchStart)}ms`);
          } else if (entry.entryType === 'largest-contentful-paint') {
            // eslint-disable-next-line no-console
            console.info(`LCP: ${Math.round(entry.startTime)}ms`);
          } else if (entry.entryType === 'paint') {
            // First Paint / First Contentful Paint
            // eslint-disable-next-line no-console
            console.info(`Paint: ${entry.name} @ ${Math.round(entry.startTime)}ms`);
          } else if (entry.entryType === 'layout-shift') {
            // layout-shift entries may expose a `value` property in supported browsers
            // eslint-disable-next-line no-console
            console.info(`Layout shift (CLS): ${(((entry as unknown) as { value?: number }).value ?? 0).toFixed(3)}`);
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('Error processing performance entry', err);
        }
      }
    });

    try {
      if (typeof observer.observe === 'function') {
        observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'paint', 'layout-shift'] });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('PerformanceObserver.observe failed', err);
    }

    return () => observer.disconnect();
  }, []);
}

// Simple in-memory response cache with TTL to reduce redundant network requests.
type CacheEntry = { data: unknown; expiresAt: number };
const FETCH_CACHE = new Map<string, CacheEntry>();

export function useFetchJson<T = unknown>(url: string, ttlSeconds = 300): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      const key = url;
      const now = Date.now();
      const cached = FETCH_CACHE.get(key);
      if (cached && cached.expiresAt > now) {
        setData(cached.data as T);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(url, { signal: controller.signal, headers: { 'Cache-Control': 'no-cache' } });
        if (!res.ok) throw new Error(res.statusText || `HTTP ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        FETCH_CACHE.set(key, { data: json, expiresAt: now + ttlSeconds * 1000 });
        setData(json as T);
        setLoading(false);
      } catch (e: unknown) {
        if (cancelled) return;
        const err = e as Error;
        if (err.name === 'AbortError') return;
        setError(err.message ?? String(e));
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url, ttlSeconds]);

  return { data, loading, error };
}
