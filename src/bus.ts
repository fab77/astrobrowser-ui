// src/bus.ts
import type { BusEvents } from './events';

type Handler<T> = (payload: T) => void;

class TypedBus<EvtMap extends Record<string, any>> {
  private handlers = new Map<keyof EvtMap, Set<Handler<any>>>();

  on<K extends keyof EvtMap>(type: K, fn: Handler<EvtMap[K]>) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(fn);
    return () => this.off(type, fn);
  }

  once<K extends keyof EvtMap>(type: K, fn: Handler<EvtMap[K]>) {
    const off = this.on(type, (payload: EvtMap[K]) => {
      off();
      fn(payload);
    });
    return off;
  }

  off<K extends keyof EvtMap>(type: K, fn: Handler<EvtMap[K]>) {
    this.handlers.get(type)?.delete(fn);
  }

  emit<K extends keyof EvtMap>(type: K, payload: EvtMap[K]) {
    const fns = this.handlers.get(type);
    if (!fns || fns.size === 0) return;

    // Copy to avoid mutation during iteration
    for (const fn of Array.from(fns)) {
      try {
        fn(payload);
      } catch (err) {
        // Keep other listeners running even if one fails
        // eslint-disable-next-line no-console
        console.error(`[bus.emit] listener error for "${String(type)}":`, err);
      }
    }
  }

  // Promise-based convenience (resolves on next matching event)
  waitFor<K extends keyof EvtMap>(type: K): Promise<EvtMap[K]> {
    return new Promise(resolve => {
      const off = this.on(type, (payload) => {
        off();
        resolve(payload);
      });
    });
  }

  // Optional: clear all listeners (use carefully)
  clear() {
    this.handlers.clear();
  }
}

export const bus = new TypedBus<BusEvents>();
export const cid = () => Math.random().toString(36).slice(2);

// Re-export types so other modules can `import { bus, type BusEvents } from 'src/bus'`
// export * from './events';