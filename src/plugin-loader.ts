// =========================
// FILE: src/plugin-loader.ts
// Dynamically load third-party panels safely (ES modules)
// =========================

import { bus } from './bus';

export async function loadPanel(url: string) {
  try {
    const mod = await import(/* @vite-ignore */ url);
    bus.emit('plugin.register', { name: url, version: (mod as any)?.version ?? 'unknown' });
    return mod;
  } catch (err: any) {
    bus.emit('plugin.error', { plugin: url, message: err?.message ?? String(err) });
    throw err;
  }
}