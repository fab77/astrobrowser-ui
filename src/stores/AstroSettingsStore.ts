import type { AstroSettings } from 'src/types';

type Listener = (a: AstroSettings | undefined) => void;

class AstroSettingsStore {
  // private _provider?: DataProvider;
  private _astroSettings: AstroSettings = {equatorialGrid: false, healpixGrod: false, insideSphere: false}
  private listeners = new Set<Listener>();

  get(): AstroSettings { return this._astroSettings; }

  set(a: AstroSettings) {
    this._astroSettings = a ;
    this.listeners.forEach(l => l(a));
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    // immediately push current value so late subscribers hydrate
    l(this._astroSettings)
    return () => this.listeners.delete(l);
  }

  clear() { this._astroSettings = {equatorialGrid: false, healpixGrod: false, insideSphere: false}; }
}

export const astroSettingsStore = new AstroSettingsStore();