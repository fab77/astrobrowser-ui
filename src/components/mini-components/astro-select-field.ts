import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type OptionItem = { value: string; label?: string; selected?: boolean; disabled?: boolean };

@customElement('astro-select-field')
export class AstroSelectField extends LitElement {
  static styles = css`
    :host { display:inline-flex; align-items:center; gap:6px; font: 13px/1.4 system-ui, sans-serif; }
    label { color:#444; }
    select { padding:4px 6px; border:1px solid #ddd; border-radius:8px; background:#fff; }
  `;

  @property() label = '';
  @property({ type: Array }) options: OptionItem[] = [];
  @property() value: string | undefined;

  private _onChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <label>${this.label}</label>
      <select @change=${this._onChange}>
        ${this.options.map(o => html`
          <option
            value=${o.value}
            ?selected=${this.value === o.value || o.selected === true}
            ?disabled=${o.disabled}
          >${o.label ?? o.value}</option>
        `)}
      </select>
    `;
  }
}