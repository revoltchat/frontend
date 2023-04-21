import type { ComponentStory } from "../../../stories";

import { ColourSwatches } from "./ColourSwatches";

export default {
  category: "Design System/Atoms/Inputs",
  component: ColourSwatches,
  stories: [
    {
      title: "Default",
      props: {
        value: "#FD6671",
      },
    },
  ],
  props: {
    value: "#FD6671",
  },
  propTypes: {
    value: "string",
    onChange: "function",
  },
  effects: {
    onChange: (props) => ({
      value: props.value,
    }),
  },
} as ComponentStory<typeof ColourSwatches>;
