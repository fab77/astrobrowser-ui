// =========================
// FILE: src/events.ts
// Central type-safe event map for PubSub between panels and AstroViewer
// =========================

import { AstroState, AstroTapAddRepoReqPayload, AstroTapAddRepoResPayload, Catalogue, TabKey, TapRepoLoadedPayload } from "./types";



export interface BusEvents {
  // plugin
  'plugin.register': { name: string; version: string };
  'plugin.error': { plugin: string; message: string };

  // UI intent
  'ui:openPanelKey': { key: string }; // for sternal plugin
  'ui:openPanel': { tab: TabKey }; // for core tabs
  'ui:closePanel': { id: string, key: string }; // opzionale

  // Astro commands
  'astro.goto': { ra: number; dec: number; fov?: number };
  'astro.toggle.healpix': { on?: boolean };
  'astro.toggle.equatorial': { on?: boolean };
  'astro.toggle.insideSphere': { on?: boolean };
  'astro.set.fov': { fov: number };

  // TAP integration
  'astro.tap.addRepo:req': AstroTapAddRepoReqPayload;
  'astro.tap.addRepo:res': AstroTapAddRepoResPayload;
  'tap:repoLoaded': TapRepoLoadedPayload;
  'tap:catalogueSelected': { repo: string, catalogue:Catalogue };

  // Queries
  'astro.get.state:req': { cid: string };
  'astro.get.state:res': { cid: string; state: AstroState };

  // Broadcast
  'astro.state.changed': { state: AstroState };
  'astro.ready': { version: string };
}