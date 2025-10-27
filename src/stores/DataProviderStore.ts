import type { DataProvider } from 'src/types';

type Listener = (p: DataProvider | undefined) => void;

class DataProviderStore {
  private _provider?: DataProvider;
  private listeners = new Set<Listener>();

  get(): DataProvider | undefined { return this._provider; }

  set(p?: DataProvider) {
    this._provider = p;
    this.listeners.forEach(l => l(this._provider));
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    // immediately push current value so late subscribers hydrate
    l(this._provider);
    return () => this.listeners.delete(l);
  }

  clear() { this.set(undefined); }
}

export const dataProviderStore = new DataProviderStore();