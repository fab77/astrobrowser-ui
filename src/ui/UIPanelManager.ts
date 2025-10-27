// src/ui/UIPanelManager.ts
import { bus } from '../bus';
import { TabKey } from 'src/types';

import { PanelRegistry } from '../services/panels/PanelRegistry';
import '../components/panels/astro-panel-draggable';
import '../components/panels/astro-panel-grid';
import '../components/panels/astro-panel-goto';

const CORE_TABS = new Set<TabKey>(['explore','analysis','metadata','settings']);

export class UIPanelManager {
  private panelsById = new Map<string, HTMLElement>();
  private panelsByKey = new Map<string, string>(); // key -> id
  private zid = 10;

  constructor(
    private container: HTMLElement,
    private registry: PanelRegistry
  ) {}

  mount() {
    // Core tabs (exclusive, toggle)
    bus.on('ui:openPanel', ({ tab }) => this.toggleCoreTab(tab));

    // Generic close by id (optional)
    bus.on('ui:closePanel', ({ id }) => this.close(id));
  }

  private nextZ() { return ++this.zid; }
  private newId(key: string) { return `panel-${key}-${Date.now()}`; }

  /** Toggle logic for top-bar tabs: single open at a time */
  private toggleCoreTab(tab: TabKey) {
    const key = tab as string;

    // If already open -> close it
    if (this.panelsByKey.has(key)) {
      this.closeByKey(key);
      return;
    }

    // Close any other core-tab panel
    for (const k of Array.from(this.panelsByKey.keys())) {
      if (CORE_TABS.has(k as TabKey)) this.closeByKey(k);
    }

    // Open the requested tab
    this.open(key);
  }

  /** Open any panel by registry key */
  open(key: string) {
    const id = this.newId(key);
    const node = this.registry.create(key);

    node.setAttribute('data-panel-key', key);
    node.setAttribute('data-panel-id', id);
    (node.style as any).zIndex = String(this.nextZ());

    // Persist / z-index / close-button hooks could go here
    node.addEventListener('mousedown', () => {
      (node.style as any).zIndex = String(this.nextZ());
    });

    // When removed externally, clean up maps (just in case)
    const mo = new MutationObserver(() => {
      if (!node.isConnected) {
        this.panelsById.delete(id);
        if (this.panelsByKey.get(key) === id) this.panelsByKey.delete(key);
        mo.disconnect();
      }
    });
    mo.observe(document, { childList: true, subtree: true });

    this.container.appendChild(node);
    this.panelsById.set(id, node);
    this.panelsByKey.set(key, id);
  }

  closeByKey(key: string) {
    const id = this.panelsByKey.get(key);
    if (!id) return;
    this.close(id);
  }

  close(id: string) {
    const node = this.panelsById.get(id);
    if (!node) return;

    const key = node.getAttribute('data-panel-key') ?? undefined;
    if (node.parentElement) node.parentElement.removeChild(node);

    this.panelsById.delete(id);
    if (key && this.panelsByKey.get(key) === id) this.panelsByKey.delete(key);
  }

}
