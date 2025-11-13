"use client";
import { useState, useEffect } from 'react';

export const usePersistedState = <T,>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        try {
          setState(JSON.parse(stored));
        } catch {
          // Fallback: some older/external code might have stored raw values (e.g. en)
          // Try to coerce common primitives, otherwise use the raw string.
          if (stored === 'true' || stored === 'false') {
            // boolean
            setState((stored === 'true') as unknown as T);
          } else if (!Number.isNaN(Number(stored))) {
            // number
            setState((Number(stored) as unknown) as T);
          } else {
            // plain string
            setState((stored as unknown) as T);
          }
        }
      }
    }
  }, [key]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState] as const;
};