// dinamic-container.ts
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  DinamicContainerController,
  PanelNode,
  LeafPanel,
  SplitPanel,
  EdgePosition,
  WidgetType,
} from './DinamicContainerController';

import '../astro-viewer/AstroViewer'
import '../table-viewer/TableViewer'

const stateAny: any = state;

@customElement('dinamic-container')
export class DinamicContainer extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    .root {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .panel {
      position: relative;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }

    .leaf {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #ddd;
      background: #fafafa;
    }

    .leaf.has-widget {
      padding: 0;
    }

    .split.horizontal {
      display: flex;
      flex-direction: column;
    }

    .split.vertical {
      display: flex;
      flex-direction: row;
    }

    .child {
      flex: 1;
      min-width: 0;
      min-height: 0;
    }

    .plus-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid rgba(46, 204, 113, 0.2);   /* visible outline */
      background: transparent;     /* transparent by default */
      color: rgba(46, 204, 113, 0.2);              /* green + icon */
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: none;
      transition:
        background-color 0.2s ease,
        color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.15s ease;
    }

    /* Hover → solid */
    .plus-btn:hover {
      background: #2ecc71;   /* solid green */
      color: #fff;           /* white + icon */
      box-shadow: 0 0 10px rgba(46, 204, 113, 0.4);
      transform: scale(1.05);
    }

    /* Pressed */
    .plus-btn:active {
      background: #28b862;
      transform: scale(0.97);
    }

    /* Icone sui bordi */
    .edge-plus {
      position: absolute;
      z-index: 10;
    }

    .edge-plus.top {
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
    }

    .edge-plus.right {
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
    }

    .edge-plus.bottom {
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
    }

    .edge-plus.left {
      left: 4px;
      top: 50%;
      transform: translateY(-50%);
    }

    .center-plus {
      /* per il pannello vuoto iniziale */
    }

    /* Widget container */
    .widget-wrapper {
      width: 100%;
      height: 100%;
    }

    /* Overlay menu */
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .overlay-content {
      background: #ffffff;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      min-width: 260px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .overlay-content h3 {
      margin: 0;
      font-size: 16px;
    }

    .overlay-content select {
      padding: 6px 8px;
      font-size: 14px;
    }

    .overlay-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .btn {
      padding: 6px 12px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 14px;
    }

    .btn.primary {
      background: #2ecc71;
      color: #fff;
    }

    .btn.secondary {
      background: #eee;
      color: #333;
    }

    .split.horizontal {
    display: flex;
    flex-direction: column;
  }

  .split.vertical {
    display: flex;
    flex-direction: row;
  }

  .child {
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }

  .divider {
    background: #ccc;
    flex: 0 0 auto;
    z-index: 20;
  }

  .divider.vertical {
    width: 4px;
    cursor: col-resize;
  }

  .divider.horizontal {
    height: 4px;
    cursor: row-resize;
  }

  .close-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    font-size: 16px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 11; /* above plus buttons */
    padding: 0;
    transition:
      background-color 0.15s ease,
      transform 0.1s ease;
  }

  .close-btn:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.05);
  }

  .close-btn:active {
    transform: scale(0.95);
  }
  `;

  @stateAny()
  private model: PanelNode | null = null;

  @stateAny()
  private menuPanelId: string | null = null;

  @stateAny()
  private menuPosition: EdgePosition | null = null;

  @stateAny()
  private menuSelection: WidgetType | '' = '';

  private controller: DinamicContainerController;

  // drag state (no need to be reactive)
  private draggingSplitId: string | null = null;
  private draggingOrientation: 'horizontal' | 'vertical' | null = null;
  private dragStartPos = 0;
  private dragStartRatio = 0;
  private dragContainerSize = 0;

  // keep stable references for window listeners
  private handleWindowMouseMove = (e: MouseEvent) => this.onWindowMouseMove(e);
  private handleWindowMouseUp = (e: MouseEvent) => this.onWindowMouseUp(e);

  constructor() {
    super();
    this.controller = new DinamicContainerController((root) => {
      this.model = root;
    });

    this.model = this.controller.getRoot();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    // cleanup in case of unmount while dragging
    window.removeEventListener('mousemove', this.handleWindowMouseMove);
    window.removeEventListener('mouseup', this.handleWindowMouseUp);
  }

  // ========== RENDER ==========

  protected render() {
    console.log('[DinamicContainer.render] model =', this.model);
    if (!this.model) {
      return html`<div class="root"></div>`;
    }

    return html`
      <div class="root">
        ${this.renderPanel(this.model)}
        ${this.renderOverlay()}
      </div>
    `;
  }

  private renderPanel(node: PanelNode): unknown {
    if (node.kind === 'leaf') {
      return this.renderLeaf(node);
    }
    return this.renderSplit(node);
  }

  private renderLeaf(leaf: LeafPanel): unknown {
    const hasWidget = !!leaf.widgetType;

    if (!hasWidget) {
      // Stato iniziale: solo icona verde centrale
      return html`
      <div class="panel leaf">
        <button
          class="plus-btn center-plus"
          @click=${() => this.openMenu(leaf.id, 'center')}
        >
          +
        </button>
      </div>
    `;
    }

    // Leaf con widget + 4 icone sui bordi
    return html`
    <div class="panel leaf has-widget">
      <!-- 🔴 Close button in the top-right -->
      <button
        class="close-btn"
        @click=${(e: MouseEvent) => this.closePanel(leaf.id, e)}
      >
        ✕
      </button>

      <!-- Icone sui bordi -->
      <div class="edge-plus top">
        <button
          class="plus-btn"
          @click=${() => this.openMenu(leaf.id, 'top')}
        >
          +
        </button>
      </div>
      <div class="edge-plus right">
        <button
          class="plus-btn"
          @click=${() => this.openMenu(leaf.id, 'right')}
        >
          +
        </button>
      </div>
      <div class="edge-plus bottom">
        <button
          class="plus-btn"
          @click=${() => this.openMenu(leaf.id, 'bottom')}
        >
          +
        </button>
      </div>
      <div class="edge-plus left">
        <button
          class="plus-btn"
          @click=${() => this.openMenu(leaf.id, 'left')}
        >
          +
        </button>
      </div>

      <!-- Widget vero e proprio -->
      <div class="widget-wrapper">
        ${this.renderWidget(leaf.widgetType!)}
      </div>
    </div>
  `;
  }

  private renderSplit(split: SplitPanel): unknown {
    const orientationClass =
      split.orientation === 'horizontal' ? 'horizontal' : 'vertical';

    const ratio = split.ratio ?? 0.5;
    const firstSize = `${ratio * 100}%`;
    const secondSize = `${(1 - ratio) * 100}%`;

    const isHorizontal = split.orientation === 'horizontal';

    return html`
    <div class="panel split ${orientationClass}">
      <div
        class="child"
        style=${isHorizontal
        ? `flex: 0 0 ${firstSize};`
        : `flex: 0 0 ${firstSize};`}
      >
        ${this.renderPanel(split.first)}
      </div>

      <div
        class="divider ${orientationClass}"
        @mousedown=${(e: MouseEvent) => this.onDividerMouseDown(e, split)}
      ></div>

      <div
        class="child"
        style=${isHorizontal
        ? `flex: 0 0 ${secondSize};`
        : `flex: 0 0 ${secondSize};`}
      >
        ${this.renderPanel(split.second)}
      </div>
    </div>
  `;
  }

  private renderWidget(widgetType: WidgetType): TemplateResult | null {
    switch (widgetType) {
      case 'astro-viewer':
        return html`<astro-viewer></astro-viewer>`;
      case 'table-viewer':
        return html`<table-viewer></table-viewer>`;
      default:
        return html``;
    }
  }

  // ========== OVERLAY MENU ==========

  private renderOverlay() {
    if (!this.menuPanelId || !this.menuPosition) return null;

    return html`
      <div class="overlay">
        <div class="overlay-content">
          <h3>Seleziona il componente da aggiungere</h3>
          <select
            @change=${this.onMenuSelectChange}
            .value=${this.menuSelection}
          >
            <option value="">-- scegli --</option>
            <option value="astro-viewer">astro-viewer</option>
            <option value="table-viewer">table-viewer</option>
          </select>

          <div class="overlay-actions">
            <button class="btn secondary" @click=${this.closeMenu}>
              Annulla
            </button>
            <button
              class="btn primary"
              @click=${this.confirmMenu}
              ?disabled=${!this.menuSelection}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ========== EVENT HANDLERS ==========

  private openMenu(panelId: string, position: EdgePosition) {
    this.menuPanelId = panelId;
    this.menuPosition = position;
    this.menuSelection = '';
  }

  private closeMenu() {
    this.menuPanelId = null;
    this.menuPosition = null;
    this.menuSelection = '';
  }

  private onMenuSelectChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value as WidgetType | '';
    this.menuSelection = value;
  }

  private confirmMenu() {
    if (!this.menuPanelId || !this.menuPosition || !this.menuSelection) return;

    this.controller.addWidget(
      this.menuPanelId,
      this.menuPosition,
      this.menuSelection as WidgetType,
    );

    this.closeMenu();
  }

  private onDividerMouseDown(e: MouseEvent, split: SplitPanel) {
    e.preventDefault();
    e.stopPropagation();

    const container = (e.currentTarget as HTMLElement).parentElement as HTMLElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    this.draggingSplitId = split.id;
    this.draggingOrientation = split.orientation;
    this.dragStartRatio = split.ratio ?? 0.5;
    this.dragStartPos = split.orientation === 'vertical' ? e.clientX : e.clientY;
    this.dragContainerSize = split.orientation === 'vertical' ? rect.width : rect.height;

    window.addEventListener('mousemove', this.handleWindowMouseMove);
    window.addEventListener('mouseup', this.handleWindowMouseUp);
  }

  private onWindowMouseMove(e: MouseEvent) {
    if (!this.draggingSplitId || !this.draggingOrientation || this.dragContainerSize <= 0) {
      return;
    }

    const currentPos =
      this.draggingOrientation === 'vertical' ? e.clientX : e.clientY;

    const delta = currentPos - this.dragStartPos;
    const deltaRatio = delta / this.dragContainerSize;
    const newRatio = this.dragStartRatio + deltaRatio;

    this.controller.updateSplitRatio(this.draggingSplitId, newRatio);
  }

  private onWindowMouseUp(_e: MouseEvent) {
    this.draggingSplitId = null;
    this.draggingOrientation = null;
    this.dragContainerSize = 0;

    window.removeEventListener('mousemove', this.handleWindowMouseMove);
    window.removeEventListener('mouseup', this.handleWindowMouseUp);
  }

  private closePanel(panelId: string, e?: MouseEvent) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.controller.closePanel(panelId);
  }
}