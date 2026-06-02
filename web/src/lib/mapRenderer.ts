import { useSyncExternalStore } from 'react';
import type { MapRenderer } from './mapTypes';

const STORAGE_KEY = 'aoa-map-renderer';
const listeners = new Set<() => void>();

function readInitial(): MapRenderer {
  if (typeof window === 'undefined') return 'svg';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'svg' || saved === 'globe') return saved;
  } catch {
    /* ignore */
  }
  return 'svg';
}

let current: MapRenderer = readInitial();

export function setMapRenderer(renderer: MapRenderer) {
  if (renderer === current) return;
  current = renderer;
  try {
    localStorage.setItem(STORAGE_KEY, renderer);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function toggleMapRenderer() {
  setMapRenderer(current === 'svg' ? 'globe' : 'svg');
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useMapRenderer(): MapRenderer {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => 'svg',
  );
}
