// =========================
// FILE: src/events.ts
// Central type-safe event map for PubSub between panels and AstroViewer
// =========================

import { AstroEntity, AstroState, AstroTaFootprintSetLoadedReqPayload, AstroTaFootprintSetLoadedResPayload, AstroTapAddRepoReqPayload, AstroTapAddRepoResPayload, AstroTapCatalogueLoadedReqPayload, AstroTapCatalogueLoadedResPayload, DataProvider, TabKey, TapRepoLoadedPayload } from "./types";


export const EVT_ASTRO_META_RA_CHANGED   = 'astro.metadata:raChanged';
export const EVT_ASTRO_META_DEC_CHANGED  = 'astro.metadata:decChanged';
export const EVT_ASTRO_META_HUE_CHANGED  = 'astro.metadata:hueChanged';
export const EVT_ASTRO_META_SIZE_CHANGED = 'astro.metadata:sizeChanged';
export const EVT_ASTRO_META_COLOR_CHANGED = 'astro.metadata:colorChanged'

export const EVT_ASTRO_STATE_GET_req = 'astro.get.state:req'
export const EVT_ASTRO_STATE_GET_res = 'astro.get.state:res'
export const EVT_ASTRO_STATE_CHANGED = 'astro.state.changed'
export const EVT_ASTRO_READY = 'astro.ready'

export const EVT_ASTRO_PLOT_CATALOGUE_SHOW = 'astro.plot.catalogue:show'
export const EVT_ASTRO_PLOT_CATALOGUE_REMOVE = 'astro.plot.catalogue:remove'

export const EVT_ASTRO_PLOT_FOOTPRINTSET_req = 'astro.plot.footprintset:req'
export const EVT_ASTRO_PLOT_FOOTPRINTSET_res = 'astro.plot.footprintset:res'

export const EVT_ASTRO_PLOT_CATALOGUE_req = 'astro.plot.catalogue:req'
export const EVT_ASTRO_PLOT_CATALOGUE_res = 'astro.plot.catalogue:res'

export const EVT_TAP_ADDREPO_req = 'astro.tap.addRepo:req'
export const EVT_TAP_ADDREPO_res = 'astro.tap.addRepo:res'
export const EVT_TAP_REPO_LOADED = 'tap:repoLoaded'

export const EVT_ASTRO_FOOTPRINTSET_F_SELECTED = 'tap:footprintsetSelected'


export const EVT_ASTRO_SET_FOV = 'astro.set.fov'
export const EVT_ASTRO_TOGGLE_INSIDE_SPHERE = 'astro.toggle.insideSphere'
export const EVT_ASTRO_TOGGLE_GRID_EQUATORIAL = 'astro.toggle.equatorial'
export const EVT_ASTRO_TOGGLE_GRID_HEALPIX = 'astro.toggle.healpix'
export const EVT_ASTRO_GOTO = 'astro.goto'

export const EVT_PLUGIN_REGISTER = 'plugin.register'
export const EVT_PLUGIN_ERROR = 'plugin.error'

  // UI intent
export const EVT_PANEL_OPEN_KEY = 'ui:openPanelKey'
export const EVT_PANEL_OPEN = 'ui:openPanel'
export const EVT_PANEL_CLOSE = 'ui:closePanel'

export interface BusEvents {
  
  // plugin
  [EVT_PLUGIN_REGISTER]: { name: string; version: string };
  [EVT_PLUGIN_ERROR]: { plugin: string; message: string };

  // UI intent
  [EVT_PANEL_OPEN_KEY]: { key: string }; // for sternal plugin
  [EVT_PANEL_OPEN]: { tab: TabKey }; // for core tabs
  [EVT_PANEL_CLOSE]: { id: string, key: string }; // opzionale

  // Astro commands
  [EVT_ASTRO_GOTO]: { ra: number; dec: number; fov?: number };
  [EVT_ASTRO_TOGGLE_GRID_HEALPIX]: { on?: boolean };
  [EVT_ASTRO_TOGGLE_GRID_EQUATORIAL]: { on?: boolean };
  [EVT_ASTRO_TOGGLE_INSIDE_SPHERE]: { on?: boolean };
  [EVT_ASTRO_SET_FOV]: { fov: number };

  // TAP integration
  [EVT_TAP_ADDREPO_req]: AstroTapAddRepoReqPayload;
  [EVT_TAP_ADDREPO_res]: AstroTapAddRepoResPayload;
  [EVT_TAP_REPO_LOADED]: TapRepoLoadedPayload;

  
  [EVT_ASTRO_FOOTPRINTSET_F_SELECTED]: { dataProvider: DataProvider, footprintSet: AstroEntity };
  
  [EVT_ASTRO_PLOT_FOOTPRINTSET_req]: AstroTaFootprintSetLoadedReqPayload
  [EVT_ASTRO_PLOT_FOOTPRINTSET_res]: AstroTaFootprintSetLoadedResPayload

  // Catalogue
  // 'tap:catalogueSelected': { dataProvider: DataProvider, catalogue: Catalogue };
  [EVT_ASTRO_PLOT_CATALOGUE_req]: AstroTapCatalogueLoadedReqPayload
  [EVT_ASTRO_PLOT_CATALOGUE_res]: AstroTapCatalogueLoadedResPayload

  [EVT_ASTRO_META_RA_CHANGED]: { catalogue: AstroEntity; column: string };
  [EVT_ASTRO_META_DEC_CHANGED]: { catalogue: AstroEntity; column: string };
  [EVT_ASTRO_META_HUE_CHANGED]: { catalogue: AstroEntity; column: string | undefined };
  [EVT_ASTRO_META_SIZE_CHANGED]: { catalogue: AstroEntity; column: string };
  [EVT_ASTRO_META_COLOR_CHANGED]:  { catalogue: AstroEntity; hexColor: string };
  
  // Plots
  [EVT_ASTRO_PLOT_CATALOGUE_SHOW]: { catalogue: AstroEntity; isVisible: boolean };
  [EVT_ASTRO_PLOT_CATALOGUE_REMOVE]: { catalogue: AstroEntity };
  
  // Queries
  [EVT_ASTRO_STATE_GET_req]: { cid: string };
  [EVT_ASTRO_STATE_GET_res]: { cid: string; state: AstroState };
  [EVT_ASTRO_STATE_CHANGED]: { state: AstroState };
  // 'astro.state.changed': { state: AstroState };
  // Broadcast
  

  [EVT_ASTRO_READY]: { version: string };
}