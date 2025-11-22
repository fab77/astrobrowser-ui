import { CatalogueGL, FootprintSetGL, FoV, MetadataManager, Point, PointCoordinates } from "astroviewer";

export interface IAstroViewerAPI {
  // init(canvasDomId: string): void;
  version?: string;
  goto(ra: number, dec: number, fov?: number): void;
  toggleHealpixGrid(on?: boolean): void;
  toggleEquatorialGrid(on?: boolean): void;
  toggleInsideSphere(on?: boolean): void;

  // addTAPRepo(url: string): Promise<DataProvider>;
  getCenterCoordinates(): PointCoordinates | undefined 
  getFoV(): FoV
  setFoV(fov: number): void;
  getState(): AstroState;
  getFoVPolygon(): Point[];
  onStateChanged?: (cb: (s: AstroState) => void) => void; // optional subscription bridge
  // catalogue
  showCatalogue(catalogue: AstroEntity): void //TODO pass here only Catalogue
  changeCatalogueRA(catalogue: AstroEntity, raColumnName: string): AstroEntity
  changeCatalogueDec(catalogue: AstroEntity, decColumnName: string): AstroEntity
  changeCatalogueColor(catalogue: AstroEntity, hexColor: string): AstroEntity
  setCatalogueShapeHue(catalogue: AstroEntity, metadataColumnName: string | undefined): AstroEntity
  setCatalogueShapeSize(catalogue: AstroEntity, metadataColumnName: string): AstroEntity
  hideCatalogue(catalogue: AstroEntity, show: boolean): void
  removeCatalogue(catalogue: AstroEntity): void
  // footprintset
  showFootprintSet(fset: AstroEntity): void //TODO pass here only Footprint
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

export type DataProviderType = 'TAP'

export type FunctionDetails = {
  name: string
  signature?: string
  description?: string
}

export interface DataProvider {
  type: DataProviderType
  url: string;
  functions: FunctionDetails[]
  catalogues: AstroEntity[];
  footprints: AstroEntity[];
  notClassified: AstroEntity[];
  getQueryFoVPolygon(points: Point[]): string;
  queryCatalogueByFoV(catalogueGL: CatalogueGL, fovPolygon: Point[]): Promise<CatalogueGL | undefined>
  queryFootprintSetByFov(footprintSetGL: FootprintSetGL, fovPolygon: Point[], centralPoint: Point, radiusDeg: number): Promise<FootprintSetGL | undefined>
}

export interface AstroEntity {
  id: string
  name: string;
  description?: string;
  providerUrl: string;
  metadataManager?: MetadataManager;
  astroviewerGlObj: CatalogueGL | FootprintSetGL | undefined
}

export interface AstroEntityInit {
  id: string;
  name: string;
  description?: string
  providerUrl: string;
  metadataManager?: MetadataManager;
}

// Request/response for adding a TAP repo (used by astro-panel-tap fallback path)
export interface TapRepoLoadedPayload {
  url: string;
  dataProvider: DataProvider
}

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
  catalogue: AstroEntity
}

export type AstroTapCatalogueLoadedResPayload =
  | {
    cid: string;
    ok: true;
    payload: { dataProvider: DataProvider, catalogue: AstroEntity };
  }
  | {
    cid: string;
    ok: false;
    error: string;
  };


export interface AstroTaFootprintSetLoadedReqPayload {
  cid: string;
  dataProvider: DataProvider
  footprintSet: AstroEntity
}

export type AstroTaFootprintSetLoadedResPayload =
  | {
    cid: string;
    ok: true;
    payload: { dataProvider: DataProvider, footprintSet: AstroEntity };
  }
  | {
    cid: string;
    ok: false;
    error: string;
  };