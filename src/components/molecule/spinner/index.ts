import {Size} from '@/components/atom/variable/type';
import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {Base} from '../../base';
import {HbSpinnerTheme} from './type';

/**
 *
 */

@customElement('hb-spinner')
export class HbSpinner extends Base {
  static get styles() {
    return [require('@/styles/molecule/spinner.scss').default];
  }

  size: Size;

  theme: HbSpinnerTheme = HbSpinnerTheme.solid;
  // size: size = size.large

  static get properties() {
    return {
      size: {type: String, Reflect: true},
      theme: {type: String, Reflect: true},
      // size: { type: String, Reflect: true },
    };
  }

  render() {
    return html`
      <svg class="hb-spinner__svg" viewBox="0 0 50 50">
        <circle
          class="hb-spinner__svg__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="5"
        ></circle>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-spinner': HbSpinner;
  }
}
