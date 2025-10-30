import type { DataProvider } from 'src/types';

type Listener = (p: DataProvider | undefined) => void;

class DataProviderStore {
  // private _provider?: DataProvider;
  private _providers: DataProvider[] = [];
  private listeners = new Set<Listener>();

  get(): DataProvider[] { return this._providers; }

  add(p: DataProvider) {
    this._providers.push( p );
    this.listeners.forEach(l => l(p));
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    // immediately push current value so late subscribers hydrate
    this._providers.forEach( (p) => {
      l(p);
    })    
    return () => this.listeners.delete(l);
  }

  clear() { this._providers = []; }
}

export const dataProviderStore = new DataProviderStore();