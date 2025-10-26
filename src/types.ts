// =========================
// FILE: src/types.ts
// Minimal, stable API surface exposed by your AstroViewer wrapper
// =========================

export interface AstroState { ra: number; dec: number; fov: number }

export interface IAstroViewerAPI {
    init(canvasDomId: string): void;
    version?: string;
    goto(ra: number, dec: number, fov?: number): void;
    toggleHealpixGrid(on?: boolean): void;
    toggleEquatorialGrid(on?: boolean): void;
    setFoV(fov: number): void;
    getState(): AstroState;
    onStateChanged?: (cb: (s: AstroState) => void) => void; // optional subscription bridge
}

export interface AstroState {
  ra: number;
  dec: number;
  fov: number;
  // add more fields if you have them
}
