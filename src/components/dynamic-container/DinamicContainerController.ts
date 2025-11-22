import '../astro-viewer/AstroViewer'

export type WidgetType = 'astro-viewer' | 'table-viewer';
export type EdgePosition = 'center' | 'top' | 'right' | 'bottom' | 'left';

export type PanelNode = LeafPanel | SplitPanel;

export interface LeafPanel {
  kind: 'leaf';
  id: string;
  widgetType?: WidgetType; // undefined => pannello vuoto (solo icona centrale)
}

export interface SplitPanel {
  kind: 'split';
  id: string;
  orientation: 'horizontal' | 'vertical'; // horizontal = top/bottom, vertical = left/right
  ratio: number;                           // between 0 and 1 (default 0.5)
  first: PanelNode;
  second: PanelNode;
}

export type ModelChangeCallback = (root: PanelNode) => void;

export class DinamicContainerController {
  private root: PanelNode;
  private onChange: ModelChangeCallback;
  private idCounter = 0;

  constructor(onChange: ModelChangeCallback) {
    this.onChange = onChange;
    // Stato iniziale: un solo leaf vuoto
    this.root = {
      kind: 'leaf',
      id: this.nextId(),
      widgetType: undefined,
    };
    this.emitChange();
  }

  getRoot(): PanelNode {
    return this.root;
  }

  /** Chiamato quando l’utente ha scelto il widget dal menu */
  addWidget(panelId: string, position: EdgePosition, widgetType: WidgetType) {
    if (position === 'center') {
      this.root = this.setWidgetInLeaf(this.root, panelId, widgetType);
    } else {
      this.root = this.splitLeafWithWidget(this.root, panelId, position, widgetType);
    }
    this.emitChange();
  }

  // update the ratio of a split (e.g. drag)
  updateSplitRatio(splitId: string, ratio: number) {
    // clamp for safety
    const clamped = Math.min(0.9, Math.max(0.1, ratio));
    this.root = this.updateSplitRatioRec(this.root, splitId, clamped);
    this.emitChange();
  }

  closePanel(panelId: string) {
    const newRoot = this.closePanelRec(this.root, panelId);

    // if everything got removed, keep at least one empty leaf
    if (!newRoot) {
      this.root = {
        kind: 'leaf',
        id: this.nextId(),
        widgetType: undefined,
      };
    } else {
      this.root = newRoot;
    }

    this.emitChange();
  }

  // ============= PRIVATE HELPERS =============

  private closePanelRec(node: PanelNode, targetId: string): PanelNode | null {
    if (node.kind === 'leaf') {
      // remove this leaf if it matches the target
      if (node.id === targetId) {
        return null;
      }
      return node;
    }

    // node.kind === 'split'
    const first = this.closePanelRec(node.first, targetId);
    const second = this.closePanelRec(node.second, targetId);

    // if neither child changed, keep this split as is
    if (first === node.first && second === node.second) {
      return node;
    }

    // if both children removed -> this split disappears
    if (!first && !second) {
      return null;
    }

    // if one child removed -> collapse split into the remaining child
    if (!first && second) return second;
    if (first && !second) return first;

    // at this point TS still thinks first/second might be null,
    // but logically both are non-null (we already handled all other cases).
    // We narrow explicitly:
    return {
      ...node,
      first: first!,
      second: second!,
    };
  }

  private nextId(): string {
    this.idCounter += 1;
    return `panel-${this.idCounter}`;
  }

  private emitChange() {
    this.onChange(this.root);
  }

  /** Imposta il widget in un leaf esistente (senza splittare) */
  private setWidgetInLeaf(node: PanelNode, targetId: string, widgetType: WidgetType): PanelNode {
    if (node.id === targetId && node.kind === 'leaf') {
      return { ...node, widgetType };
    }
    if (node.kind === 'split') {
      return {
        ...node,
        first: this.setWidgetInLeaf(node.first, targetId, widgetType),
        second: this.setWidgetInLeaf(node.second, targetId, widgetType),
      };
    }
    return node;
  }

  /** Sostituisce un leaf con uno split (leaf esistente + nuovo leaf con widget) */
  private splitLeafWithWidget(
    node: PanelNode,
    targetId: string,
    position: EdgePosition,
    widgetType: WidgetType,
  ): PanelNode {
    if (node.id === targetId && node.kind === 'leaf') {
      const newLeaf: LeafPanel = {
        kind: 'leaf',
        id: this.nextId(),
        widgetType,
      };

      let orientation: 'horizontal' | 'vertical';
      let first: PanelNode;
      let second: PanelNode;

      switch (position) {
        case 'top':
          orientation = 'horizontal';
          first = newLeaf;
          second = node;
          break;
        case 'bottom':
          orientation = 'horizontal';
          first = node;
          second = newLeaf;
          break;
        case 'left':
          orientation = 'vertical';
          first = newLeaf;
          second = node;
          break;
        case 'right':
          orientation = 'vertical';
          first = node;
          second = newLeaf;
          break;
        default:
          // fallback: trattalo come center (anche se non dovrebbe arrivare qui)
          return { ...node, widgetType };
      }

      const splitNode: SplitPanel = {
        kind: 'split',
        id: this.nextId(),
        orientation,
        ratio: 0.5,  // default 50/50
        first,
        second,
      };

      return splitNode;
    }

    if (node.kind === 'split') {
      return {
        ...node,
        first: this.splitLeafWithWidget(node.first, targetId, position, widgetType),
        second: this.splitLeafWithWidget(node.second, targetId, position, widgetType),
      };
    }

    return node;
  }

  private updateSplitRatioRec(node: PanelNode, splitId: string, ratio: number): PanelNode {
    if (node.kind === 'split' && node.id === splitId) {
      return { ...node, ratio };
    }
    if (node.kind === 'split') {
      return {
        ...node,
        first: this.updateSplitRatioRec(node.first, splitId, ratio),
        second: this.updateSplitRatioRec(node.second, splitId, ratio),
      };
    }
    return node;
  }
}