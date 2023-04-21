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
  propTypes: {
    value: "string",
    onChange: "function",
  },
} as ComponentStory<typeof ColourSwatches>;
