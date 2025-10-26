// src/services/panels/PanelRegistry.ts

/**
 * Un pannello è creato da una factory che restituisce un HTMLElement
 * (es. un tuo <astro-panel-draggable> già popolato con slot/HTML interno).
 */
export type PanelFactory = () => HTMLElement;

/**
 * Registry minimale:
 * - register(key, factory): registra/aggiorna la factory per una chiave
 * - has(key): true se la chiave è registrata
 * - create(key): istanzia un pannello dalla factory (throw se non c'è)
 * - keys(): elenco delle chiavi registrate (utile per menu/diagnostica)
 */
export class PanelRegistry {
  private factories = new Map<string, PanelFactory>();

  register(key: string, factory: PanelFactory) {
    this.factories.set(key, factory);
  }

  has(key: string): boolean {
    return this.factories.has(key);
  }

  create(key: string): HTMLElement {
    const f = this.factories.get(key);
    if (!f) {
      throw new Error(`No factory registered for panel key: "${key}"`);
    }
    return f();
  }

  keys(): string[] {
    return Array.from(this.factories.keys());
  }
}
