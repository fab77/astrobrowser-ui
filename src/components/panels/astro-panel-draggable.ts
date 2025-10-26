// astro-panel-draggable.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { bus } from '../../bus';


type ResizeEdge = 'right' | 'bottom' | 'corner' | null;

@customElement('astro-panel-draggable')
export class AstroPanelDraggable extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 100px;
      left: 100px;
      width: 360px;
      height: 260px;
      max-width: calc(100vw - 20px);
      max-height: calc(100vh - 20px);
      background: #1c1f27;
      color: #e9edf1;
      border: 1px solid #2b3240;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,.35);
      user-select: none;
      touch-action: none;
      box-sizing: border-box;
      overflow: hidden;
    }

    header {
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: 10px 12px;
      background: #232a36;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      font: 600 13px/1.2 system-ui, sans-serif;
      cursor: grab;
    }
    header:active { cursor: grabbing; }

    .content {
      padding: 12px;
      height: calc(100% - 44px);
      overflow: auto;
      box-sizing: border-box;
    }

    .handle {
      position: absolute;
      background: transparent;
      touch-action: none;
    }
    .handle.right {
      top: 6px; right: 0;
      width: 10px; height: calc(100% - 12px);
      cursor: ew-resize;
    }
    .handle.bottom {
      left: 6px; bottom: 0;
      width: calc(100% - 12px); height: 10px;
      cursor: ns-resize;
    }
    .handle.corner {
      right: 0; bottom: 0;
      width: 14px; height: 14px;
      cursor: nwse-resize;
      border-bottom-right-radius: 10px;
    }

    .handle:hover { background: rgba(255,255,255,0.03); }

    /* Close button */
    button.icon {
      all: unset;
      cursor: pointer;
      padding: 4px;
      border-radius: 8px;
    }
    button.icon:hover { background: rgba(255,255,255,0.06); }
  `;

  @property({ type: String }) title = 'Panel';
  @property({ type: Number }) minW = 240;
  @property({ type: Number }) minH = 140;

  @state() private dragging = false;
  @state() private resizing: ResizeEdge = null;

  private grabDx = 0;
  private grabDy = 0;

  private startW = 0;
  private startH = 0;
  private startX = 0;
  private startY = 0;

  private onHeaderPointerDown = (e: PointerEvent) => {
    // 🚫 Ignore if the pointerdown started on a no-drag control (e.g., the close button)
    const target = e.target as HTMLElement | null;
    if (target && target.closest('.no-drag')) return;

    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const rect = this.getBoundingClientRect();
    this.grabDx = e.clientX - rect.left;
    this.grabDy = e.clientY - rect.top;
    this.dragging = true;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp);
    this.bringToFront();
  };

  private beginResize = (edge: ResizeEdge) => (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    this.resizing = edge;
    this.dragging = false;

    const rect = this.getBoundingClientRect();
    this.startW = rect.width;
    this.startH = rect.height;
    this.startX = e.clientX;
    this.startY = e.clientY;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp);
    this.bringToFront();
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.dragging) {
      e.preventDefault();
      let newLeft = e.clientX - this.grabDx;
      let newTop = e.clientY - this.grabDy;

      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const w = this.offsetWidth;
      const h = this.offsetHeight;

      newLeft = Math.max(0, Math.min(vw - w, newLeft));
      newTop = Math.max(0, Math.min(vh - h, newTop));

      this.style.left = `${newLeft}px`;
      this.style.top = `${newTop}px`;
      return;
    }

    if (this.resizing) {
      e.preventDefault();
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;

      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;

      const rect = this.getBoundingClientRect();
      const left = rect.left;
      const top = rect.top;

      let newW = this.startW;
      let newH = this.startH;

      if (this.resizing === 'right' || this.resizing === 'corner') {
        newW = this.clamp(this.startW + dx, this.minW, vw - left);
      }
      if (this.resizing === 'bottom' || this.resizing === 'corner') {
        newH = this.clamp(this.startH + dy, this.minH, vh - top);
      }

      this.style.width = `${newW}px`;
      this.style.height = `${newH}px`;
    }
  };

  private onPointerUp = () => {
    this.dragging = false;
    this.resizing = null;
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
  };

  
  private onCloseClick = (e: MouseEvent) => {
    e.stopPropagation(); // don't let header drag start

    // UIPanelManager sets these when opening the panel
    const id = this.getAttribute('data-panel-id');
    const key = this.getAttribute('data-panel-key');
    
    if (id && key) {
      // Tell UIPanelManager to close; navbar can update its active state
      bus.emit('ui:closePanel', { id, key });
    } else {
      // Fallback if not managed by UIPanelManager
      this.remove();
    }
  };


  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
  }

  private clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
  }

  private bringToFront() {
    this.style.zIndex = `${Date.now()}`;
  }

  render() {
    return html`
      <header @pointerdown=${this.onHeaderPointerDown}>
        <span>${this.title}</span>
        <span style="flex:1"></span>
        <!-- mark as no-drag so header handler ignores it -->
        <button class="icon no-drag" title="Close" @click=${this.onCloseClick}>✕</button>
      </header>

      <div class="content">
        <slot></slot>
      </div>

      <!-- Resize handles -->
      <div class="handle right"  @pointerdown=${this.beginResize('right')}></div>
      <div class="handle bottom" @pointerdown=${this.beginResize('bottom')}></div>
      <div class="handle corner" @pointerdown=${this.beginResize('corner')}></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'astro-panel-draggable': AstroPanelDraggable;
  }
}
