"use client";

/**
 * Minimal external store over localStorage.
 *
 * Reading persistent state in a useEffect + setState causes a cascading render
 * (flagged by react-hooks/set-state-in-effect), so state lives in a store
 * consumed with `useSyncExternalStore`.
 *
 * Hydration safety: `getSnapshot` returns the server `fallback` until the store
 * is actually subscribed on the client (React subscribes in a passive effect,
 * i.e. after hydration). That guarantees the first client render matches the
 * server markup, then the persisted value is applied in a normal re-render.
 */

type Listener = () => void;

export interface BrowserStore<T> {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (value: T) => void;
}

export function createBrowserStore<T>({
  read,
  write,
  fallback,
}: {
  read: () => T;
  write: (value: T) => void;
  fallback: T;
}): BrowserStore<T> {
  const listeners = new Set<Listener>();
  let ready = false;
  let cached: { value: T } | undefined;

  const emit = () => {
    cached = undefined;
    listeners.forEach((listener) => listener());
  };

  return {
    subscribe(listener) {
      listeners.add(listener);

      // First subscription happens after hydration: persisted state is now safe
      // to read. Flip the snapshot and let React re-read it.
      if (!ready) {
        ready = true;
        emit();
      }

      const onStorage = () => emit();
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot() {
      if (!ready) return fallback;
      if (!cached) cached = { value: read() };
      return cached.value;
    },
    getServerSnapshot() {
      return fallback;
    },
    set(value) {
      ready = true;
      write(value);
      cached = { value };
      listeners.forEach((listener) => listener());
    },
  };
}
