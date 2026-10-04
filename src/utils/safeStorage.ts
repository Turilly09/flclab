// Resilient storage wrapper that never throws, preventing white-screen crashes
// in mobile Safari Private Browsing, Android WebView, or when storage is restricted.

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

const memoryFallback = new MemoryStorage();

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        const item = window.localStorage.getItem(key);
        if (item !== null) return item;
      }
    } catch (e) {
      console.warn(`[safeStorage] localStorage.getItem failed for "${key}", falling back to memory:`, e);
    }
    return memoryFallback.getItem(key);
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[safeStorage] localStorage.setItem failed for "${key}", falling back to memory:`, e);
    }
    memoryFallback.setItem(key, value);
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[safeStorage] localStorage.removeItem failed for "${key}":`, e);
    }
    memoryFallback.removeItem(key);
  },
};
