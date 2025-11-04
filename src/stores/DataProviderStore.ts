import type { Catalogue, DataProvider } from 'src/types';

type Listener = (p: DataProvider | undefined) => void;

class DataProviderStore {
  // private _provider?: DataProvider;
  private _providers: DataProvider[] = [];
  private listeners = new Set<Listener>();
  // private activeCatalogues: Map<DataProvider, Catalogue[]> = new Map()
  private activeCatalogues: Catalogue[] = []

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

  getAllActiveCatalogues(): Catalogue[] {
    return this.activeCatalogues
  }

  getCatalogueById(id: string): Catalogue | undefined {
    return this.activeCatalogues.find( c => c.id == id)
  }

  getActiveCatalogues(prodiderUrl: string): Catalogue[] {
    return this.activeCatalogues.filter((cat) => cat.provider == prodiderUrl)
  }
  
  addToActiveCatalogues(cat: Catalogue): Catalogue[] {
    if (!this.activeCatalogues.some(c => c.id == cat.id)){
      this.activeCatalogues.push(cat)
    }
    return this.activeCatalogues
  }

  removeFromActiveCatalogues(cat: Catalogue): Catalogue[] {
    const idx = this.activeCatalogues.findIndex(c => c.id === cat.id);
    if (idx === -1) return [];
    this.activeCatalogues.splice(idx, 1);            // mutate in place (fine here)
    return this.activeCatalogues
  }

  // Optional: remove everything for a provider
  removeAllForProvider(prodiderUrl: string): Catalogue[] {
    const arr = this.activeCatalogues.filter(c => c.provider !== prodiderUrl)
    this.activeCatalogues = arr
    return this.activeCatalogues
  }

}

export const dataProviderStore = new DataProviderStore();