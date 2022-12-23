import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
import './index';
import type { HbTransition } from './index';
import { hbTransitionTypes } from './type';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'components/atom/hb-transition',
  component: 'hb-transition',
  argTypes: {
    show: {
      options: [false, true],
      control: { type: 'radio' },
      defaultValue: false
    },
    type: {
      options: hbTransitionTypes,
      control: { type: 'radio' },
      defaultValue: 'fade'
    }
  }
} as Meta;

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story<HbTransition> = ({ show, type }) =>
  html`
    <hb-transition type=${type} ?show=${show}
      ><div style="background: red;">블라블라</div></hb-transition
    >
  `;

export const visible: Story<HbTransition> = Template.bind({});
visible.args = {
  show: false,
  type: 'fade'
};
