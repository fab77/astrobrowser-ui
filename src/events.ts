// =========================
// FILE: src/events.ts
// Central type-safe event map for PubSub between panels and AstroViewer
// =========================

import { AstroState, AstroTaFootprintSetLoadedReqPayload, AstroTaFootprintSetLoadedResPayload, AstroTapAddRepoReqPayload, AstroTapAddRepoResPayload, AstroTapCatalogueLoadedReqPayload, AstroTapCatalogueLoadedResPayload, Catalogue, DataProvider, FootprintSet, TabKey, TapRepoLoadedPayload } from "./types";



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
  
  'tap:footprintsetSelected': { dataProvider: DataProvider, footprintSet: FootprintSet };
  'astro.plot.footprintset:req': AstroTaFootprintSetLoadedReqPayload
  'astro.plot.footprintset:res': AstroTaFootprintSetLoadedResPayload

  // Catalogue
  'tap:catalogueSelected': { dataProvider: DataProvider, catalogue: Catalogue };
  'astro.plot.catalogue:req': AstroTapCatalogueLoadedReqPayload
  'astro.plot.catalogue:res': AstroTapCatalogueLoadedResPayload

  'astro.metadata:raChanged': { catalogue: Catalogue; column: string };
  'astro.metadata:decChanged': { catalogue: Catalogue; column: string };
  'astro.metadata:hueChanged': { catalogue: Catalogue; column: string };
  'astro.metadata:sizeChanged': { catalogue: Catalogue; column: string };

  // Queries
  'astro.get.state:req': { cid: string };
  'astro.get.state:res': { cid: string; state: AstroState };

  // 'astro:settingsChanged': SettingChangedPayload

  // Broadcast
  'astro.state.changed': { state: AstroState };
  'astro.ready': { version: string };
}