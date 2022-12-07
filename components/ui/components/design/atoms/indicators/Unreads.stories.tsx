import { Unreads } from "./Unreads";
import type { ComponentProps } from "solid-js";
import type { ComponentStory } from "../../../stories";
import makeSvgDecorator from "../../../../decorators/SvgDecorator";

export default {
  category: "Design System/Atoms/Indicators",
  component: Unreads,
  stories: [
    {
      title: "Default"
    },
    {
      title: "With Count",
      props: {
        count: 3
      }
    },
    {
      title: "Overflow Count",
      props: {
        count: 10
      }
    }
  ],
  props: {
    unread: true
  },
  decorators: [
    makeSvgDecorator(32, 128)
  ],
  propTypes: {
    unread: 'boolean',
    count: 'number'
  },
} as ComponentStory<typeof Unreads, ComponentProps<typeof Unreads>>;
