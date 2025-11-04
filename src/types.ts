// =========================
// FILE: src/types.ts
// Minimal, stable API surface exposed by your AstroViewer wrapper
// =========================

import { CatalogueGL, FootprintSetGL } from "astroviewer";


// import { DataProvider } from "./events";

export interface AstroState { centralRADeg: number; centralDecDeg: number; fov: number }

export interface IAstroViewerAPI {
    // init(canvasDomId: string): void;
    version?: string;
    goto(ra: number, dec: number, fov?: number): void;
    toggleHealpixGrid(on?: boolean): void;
    toggleEquatorialGrid(on?: boolean): void;
    toggleInsideSphere(on?: boolean): void;
    
    addTAPRepo(url: string): Promise<DataProvider>;
    setFoV(fov: number): void;
    getState(): AstroState;
    onStateChanged?: (cb: (s: AstroState) => void) => void; // optional subscription bridge
    // catalogue
    showCatalogue(catalogue: CatalogueGL): void //TODO pass here only Catalogue
    changeCatalogueRA(catalogue: Catalogue, raColumnName: string): Catalogue
    changeCatalogueDec(catalogue: Catalogue, decColumnName: string): Catalogue
    changeCatalogueColor(catalogue: Catalogue, hexColor: string): Catalogue
    setCatalogueShapeHue(catalogue: Catalogue, metadataColumnName: string | undefined): Catalogue
    setCatalogueShapeSize(catalogue: Catalogue, metadataColumnName: string): Catalogue
    hideCatalogue(catalogue: Catalogue, show: boolean): void
    removeCatalogue(catalogue: Catalogue): void
    
    // footprintset
    showFootprintSet(fset: FootprintSetGL): void //TODO pass here only Footprint
    

}

export interface AstroState {
  centralRADeg: number;
  centralDecDeg: number;
  fov: number;
  equatorialGridVisible: boolean;
  healpixGridVisible: boolean;
  insideSphere: boolean;
  mouseRADeg: number | undefined;
  mouseDecDeg: number | undefined;
  // add more fields if you have them
}


export type TabKey = 'explore' | 'analysis' | 'metadata' | 'settings';

export type DataProviderType = 'TAP'

export type RA = number; // degrees
export type DEC = number; // degrees


export const CATALOGUE_TYPE = 'Catalogue' as const
export const FOOTPRINTSET_TYPE = 'FootprintSet' as const
export type DatasetType = typeof CATALOGUE_TYPE | typeof FOOTPRINTSET_TYPE
export type MiniMetadataPanel = {
  catOrFoot: Catalogue | FootprintSet
  datasetType: DatasetType
}

export type Metadata = {
  name: string
  description?: string
  unit?: string
  dataType?: string
  ucd?: string
  uType?: string
  index?: number
}

export type MetadataDetails = {
  metadataList: Metadata[];
  posEqRAMetaColumns: Metadata[];
  posEqDecMetaColumns: Metadata[];
  sRegionMetaColumns: Metadata[];
  pgSphereMetaColumns: Metadata[];
};

export type FunctionDetails = {
  name: string
  signature?: string
  description?: string
}

export interface DataProvider {
  type: DataProviderType
  url: string;
  functions: FunctionDetails[]
  catalogues: Catalogue[];
  footprints: FootprintSet[];
}

export interface Catalogue {
  id: string
  name: string;
  description?: string;
  provider: string;
  metadataDetails?: MetadataDetails;
  astroviewerGlObj: CatalogueGL
  // allow extra fields coming from adapters
  [k: string]: any;
}

export interface FootprintSet {
  id: string
  name: string;
  description?: string;
  provider: string;
  metadataDetails?: MetadataDetails;
  astroviewerGlObj: FootprintSetGL
  // allow extra fields coming from adapters
  [k: string]: any;
}

export interface AstroSettings {
  equatorialGrid: boolean;
  healpixGrod: boolean;
  insideSphere: boolean;
}


// Request/response for adding a TAP repo (used by astro-panel-tap fallback path)
export interface AstroTapAddRepoReqPayload {
  cid: string;
  url: string;
}

export type AstroTapAddRepoResPayload =
  | {
      cid: string;
      ok: true;
      payload: { dataProvider: DataProvider };
    }
  | {
      cid: string;
      ok: false;
      error: string;
    };

    export interface AstroTapCatalogueLoadedReqPayload {
      cid: string;
      dataProvider: DataProvider
      catalogue: Catalogue
    }
    
    export type AstroTapCatalogueLoadedResPayload =
  | {
      cid: string;
      ok: true;
      payload: { dataProvider: DataProvider, catalogue: Catalogue };
    }
  | {
      cid: string;
      ok: false;
      error: string;
    };
    
    
    export interface AstroTaFootprintSetLoadedReqPayload {
      cid: string;
      dataProvider: DataProvider
      footprintSet: FootprintSet
    }
    
    export type AstroTaFootprintSetLoadedResPayload =
  | {
      cid: string;
      ok: true;
      payload: { dataProvider: DataProvider, footprintSet: FootprintSet };
    }
  | {
      cid: string;
      ok: false;
      error: string;
    };





// Fire-and-forget notification once a TAP repo is effectively available app-wide
export interface TapRepoLoadedPayload {
  url: string;
  dataProvider: DataProvider
}

export interface SettingChangedPayload {
  equatorialGrid: string;
  dataProvider: DataProvider
}