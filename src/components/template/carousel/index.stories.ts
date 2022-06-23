import { Meta, Story } from "@storybook/web-components";
import { html } from "lit";
import "./index";
import type { HbCarousel } from "./index";

export default {
  title: "components/template/hb-carousel",
  component: "hb-carousel",
  argTypes: {
    index: {
      options: ['0','1','2'],
      control: { type: 'radio' },
      defaultValue: '0'
    },
  }
} as Meta;


const Template: Story<HbCarousel> = ({index,items,visibleLength,infinite}) =>
  html`<hb-carousel ?infinite=${infinite} index=${index} items=${items} visibleLength=${visibleLength}>
    <div>
      업라이즈 블라블라
    </div>
    <div>
      헤이비트 블라블라
    </div>
    <div>
      이루다 블라블라
    </div>
  </hb-carousel>`;
export const primary: Story<HbCarousel> = Template.bind({});
primary.args = {
  index: 0,
  items: 3,
  visibleLength: 3,
  infinite: true
};