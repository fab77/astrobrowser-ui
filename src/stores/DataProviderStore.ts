import { DataProvider, AstroEntity } from "../global-types";


type Listener = (p: DataProvider | undefined) => void;

class DataProviderStore {
  // private _provider?: DataProvider;
  private _providers: DataProvider[] = [];
  private listeners = new Set<Listener>();
  // private activeCatalogues: Map<DataProvider, Catalogue[]> = new Map()
  private activeCatalogues: AstroEntity[] = []

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

  getAllActiveCatalogues(): AstroEntity[] {
    return this.activeCatalogues
  }

  getCatalogueById(id: string): AstroEntity | undefined {
    return this.activeCatalogues.find( c => c.id == id)
  }

  getActiveCatalogues(prodiderUrl: string): AstroEntity[] {
    return this.activeCatalogues.filter((cat) => cat.providerUrl == prodiderUrl)
  }
  
  addToActiveCatalogues(cat: AstroEntity): AstroEntity[] {
    if (!this.activeCatalogues.some(c => c.id == cat.id)){
      this.activeCatalogues.push(cat)
    }
    return this.activeCatalogues
  }

  removeFromActiveCatalogues(cat: AstroEntity): AstroEntity[] {
    const idx = this.activeCatalogues.findIndex(c => c.id === cat.id);
    if (idx === -1) return [];
    this.activeCatalogues.splice(idx, 1);            // mutate in place (fine here)
    return this.activeCatalogues
  }

  // Optional: remove everything for a provider
  removeAllForProvider(prodiderUrl: string): AstroEntity[] {
    const arr = this.activeCatalogues.filter(c => c.providerUrl !== prodiderUrl)
    this.activeCatalogues = arr
    return this.activeCatalogues
  }

}

export const dataProviderStore = new DataProviderStore();