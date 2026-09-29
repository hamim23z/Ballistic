'use client';

import { useSyncExternalStore } from 'react';

export const GUEST_STORAGE_KEY = 'ballistic-guest-name';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  return window.localStorage.getItem(GUEST_STORAGE_KEY);
}

// Same reasoning as useReducedMotion: the server can't read localStorage, so
// both the server render and the client's first render have to agree on
// "no stored name" (null) to avoid a hydration mismatch. React resolves the
// real value right after hydrating, before the browser paints.
function getServerSnapshot() {
  return null;
}

export function useStoredGuestName(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}