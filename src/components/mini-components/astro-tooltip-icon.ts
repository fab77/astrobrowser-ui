// src/components/ui/astro-tooltip-icon.ts
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type Placement = 'top' | 'bottom' | 'left' | 'right';

@customElement('astro-tooltip-icon')
export class AstroTooltipIcon extends LitElement {
  static styles = css`
    :host { display:inline-block; position:relative; }

    .icon-btn {
      display:inline-grid; place-items:center;
      inline-size: 22px; block-size: 22px;
      border: 1px solid #ddd; border-radius: 6px;
      background:#fff; color:#333; font-size: 12px; font-weight: 700;
      cursor: pointer; user-select: none; padding: 0; line-height: 1;
    }
    .icon-btn:hover, .icon-btn:focus-visible { background:#f7f7ff; outline: none; }

    /* NOTE: fixed so it won't be clipped by overflow containers */
    .tip {
      position: fixed;
      z-index: 999999; /* over sticky headers / tables */
      max-width: 360px;
      padding: 8px 10px;
      border-radius: 8px;
      background:#111; color:#fff;
      font: 12px/1.35 system-ui, sans-serif;
      box-shadow: 0 8px 20px rgba(0,0,0,.25);
      pointer-events: auto; /* allow clicking links */
    }

    .tip a { color:#9ecbff; text-decoration:underline; }
    .tip a:hover { text-decoration:none; }

    /* Arrow: draw with a rotated square so it works with fixed pos */
    .arrow {
      position: fixed; /* also fixed */
      width: 10px; height: 10px;
      background: #111;
      transform: rotate(45deg);
      z-index: 999998;
    }
  `;

  /** Plain string content (for quick use). Prefer slot="content" for rich content. */
  @property({ type: String }) content = '';
  /** top | bottom | left | right */
  @property({ reflect: true }) placement: Placement = 'top';
  /** A11y label for the icon button */
  @property({ type: String, attribute: 'icon-title' }) iconTitle = 'More info';
  /** Override icon text (or slot="icon" for SVG/custom) */
  @property({ type: String }) icon = '？';

  @state() private _open = false;
  @state() private _tipX = 0;
  @state() private _tipY = 0;
  @state() private _arrowX = 0;
  @state() private _arrowY = 0;

  private _closeTimer?: number;

  private get _btn(): HTMLButtonElement | null {
    return this.shadowRoot?.querySelector('.icon-btn') as HTMLButtonElement | null;
  }

  private open = () => {
    if (this._closeTimer) { clearTimeout(this._closeTimer); this._closeTimer = undefined; }
    this._open = true;
    this.updateComplete.then(() => this.positionTooltip());
    window.addEventListener('scroll', this.onWindowScroll, true);
    window.addEventListener('resize', this.onWindowResize, true);
  };

  private scheduleClose = (delay = 140) => {
    if (this._closeTimer) clearTimeout(this._closeTimer);
    this._closeTimer = window.setTimeout(() => this.close(), delay) as unknown as number;
  };

  private close = () => {
    this._open = false;
    if (this._closeTimer) { clearTimeout(this._closeTimer); this._closeTimer = undefined; }
    window.removeEventListener('scroll', this.onWindowScroll, true);
    window.removeEventListener('resize', this.onWindowResize, true);
  };

  private onWindowScroll = () => { if (this._open) this.positionTooltip(); };
  private onWindowResize = () => { if (this._open) this.positionTooltip(); };

  private positionTooltip(): void {
  const btn = this._btn;
  if (!btn) return;

  const r = btn.getBoundingClientRect();
  const gap = 8;
  const tip = this.shadowRoot!.querySelector('.tip') as HTMLElement | null;
  const vw = window.innerWidth, vh = window.innerHeight;

  const tipW = tip?.offsetWidth || 240;
  const tipH = tip?.offsetHeight || 44;

  let x = 0, y = 0, ax = 0, ay = 0;
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  switch (this.placement) {
    case 'top': {
      x = clamp(r.left + r.width / 2 - tipW / 2, 8, vw - tipW - 8);
      y = r.top - tipH - gap;
      ax = clamp(r.left + r.width / 2 - 5, 8, vw - 5 - 8);
      ay = y + tipH - 5;
      if (y < 4) { this.placement = 'bottom'; this.positionTooltip(); return; }
      break;
    }
    case 'bottom': {
      x = clamp(r.left + r.width / 2 - tipW / 2, 8, vw - tipW - 8);
      y = r.bottom + gap;
      ax = clamp(r.left + r.width / 2 - 5, 8, vw - 5 - 8);
      ay = y - 5;
      if (y + tipH > vh - 4) { this.placement = 'top'; this.positionTooltip(); return; }
      break;
    }
    case 'left': {
      x = r.left - tipW - gap;
      y = clamp(r.top + r.height / 2 - tipH / 2, 8, vh - tipH - 8);
      ax = x + tipW - 5;
      ay = clamp(r.top + r.height / 2 - 5, 8, vh - 5 - 8);
      if (x < 4) { this.placement = 'right'; this.positionTooltip(); return; }
      break;
    }
    case 'right': {
      x = r.right + gap;
      y = clamp(r.top + r.height / 2 - tipH / 2, 8, vh - tipH - 8);
      ax = x - 5;
      ay = clamp(r.top + r.height / 2 - 5, 8, vh - 5 - 8);
      if (x + tipW > vw - 4) { this.placement = 'left'; this.positionTooltip(); return; }
      break;
    }
  }

  this._tipX = Math.round(x);
  this._tipY = Math.round(y);
  this._arrowX = Math.round(ax);
  this._arrowY = Math.round(ay);
}

  // hover/focus handling (keeps bubble open when moving into it)
  private onTriggerEnter = () => this.open();
  private onTriggerLeave = () => this.scheduleClose();
  private onTipEnter     = () => this.open();
  private onTipLeave     = () => this.scheduleClose();

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.close();
      this._btn?.focus();
    }
  };

  render() {
    const hasSlotted = !!this.querySelector('[slot="content"]');

    return html`
      <button
        class="icon-btn"
        aria-haspopup="dialog"
        aria-expanded=${this._open ? 'true' : 'false'}
        title=${this.iconTitle}
        @mouseenter=${this.onTriggerEnter}
        @mouseleave=${this.onTriggerLeave}
        @focus=${this.onTriggerEnter}
        @blur=${this.onTriggerLeave}
        @keydown=${this.onKeyDown}
      >
        <slot name="icon">${this.icon}</slot>
      </button>

      ${this._open ? html`
        <!-- bubble -->
        <div
          class="tip"
          style="left:${this._tipX}px; top:${this._tipY}px"
          role="tooltip"
          @mouseenter=${this.onTipEnter}
          @mouseleave=${this.onTipLeave}
        >
          ${hasSlotted
            ? html`<slot name="content"></slot>`
            : (this.content ? html`${this.content}` : nothing)}
        </div>
        <!-- arrow (rotated square) -->
        <div
          class="arrow"
          style="left:${this._arrowX}px; top:${this._arrowY}px"
          aria-hidden="true"
        ></div>
      ` : nothing}
    `;
  }
}