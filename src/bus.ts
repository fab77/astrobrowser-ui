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

  off<K extends keyof EvtMap>(type: K, fn: Handler<EvtMap[K]>) {
    this.handlers.get(type)?.delete(fn);
  }

  emit<K extends keyof EvtMap>(type: K, payload: EvtMap[K]) {
    this.handlers.get(type)?.forEach(fn => fn(payload));
  }
}

export const bus = new TypedBus<BusEvents>();
export const cid = () => Math.random().toString(36).slice(2);

// Ri-esporta i tipi così altrove puoi importare da 'bus'
export * from './events';
