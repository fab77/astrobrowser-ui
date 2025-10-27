// =========================
// FILE: src/types.ts
// Minimal, stable API surface exposed by your AstroViewer wrapper
// =========================

// import { DataProvider } from "./events";

export interface AstroState { centralRADeg: number; centralDecDeg: number; fov: number }

export interface IAstroViewerAPI {
    // init(canvasDomId: string): void;
    version?: string;
    goto(ra: number, dec: number, fov?: number): void;
    toggleHealpixGrid(on?: boolean): void;
    toggleEquatorialGrid(on?: boolean): void;
    toggleInsideSphere(on?: boolean): void;
    // addTAPRepo(url: string): Promise<{ catalogues: Catalogue[]; footprints: FootprintSet[] }>;
    addTAPRepo(url: string): Promise<DataProvider>;
    setFoV(fov: number): void;
    getState(): AstroState;
    onStateChanged?: (cb: (s: AstroState) => void) => void; // optional subscription bridge
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


// --- TAP types shared on the bus ---

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
  provider?: string;
  metadataDetails?: MetadataDetails;
  // allow extra fields coming from adapters
  [k: string]: any;
}

export interface FootprintSet {
  id: string
  name: string;
  description?: string;
  provider?: string;
  metadataDetails?: MetadataDetails;
  // allow extra fields coming from adapters
  [k: string]: any;
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

// Fire-and-forget notification once a TAP repo is effectively available app-wide
export interface TapRepoLoadedPayload {
  url: string;
  dataProvider: DataProvider
}