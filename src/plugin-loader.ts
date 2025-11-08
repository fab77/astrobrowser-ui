// =========================
// FILE: src/plugin-loader.ts
// Dynamically load third-party panels safely (ES modules)
// =========================

import { bus } from './bus';
import { EVT_PLUGIN_REGISTER, EVT_PLUGIN_ERROR } from './events';

export async function loadPanel(url: string) {
  try {
    const mod = await import(/* @vite-ignore */ url);
    bus.emit(EVT_PLUGIN_REGISTER, { name: url, version: (mod as any)?.version ?? 'unknown' });
    return mod;
  } catch (err: any) {
    bus.emit(EVT_PLUGIN_ERROR, { plugin: url, message: err?.message ?? String(err) });
    throw err;
  }
}