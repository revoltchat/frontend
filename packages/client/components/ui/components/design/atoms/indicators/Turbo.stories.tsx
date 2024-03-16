import type { ComponentProps } from "solid-js";

import type { ComponentStory } from "../../../stories";

import { Turbo } from "./Turbo";

export default {
  category: "Design System/Atoms/Indicators",
  component: Turbo,
  stories: [
    {
      title: "Concept 1",
      props: {
        children: "Turbo",
      },
    },
    {
      title: "Concept 2",
      props: {
        children: "Revolt+",
      },
    },
  ],
  propTypes: {
    children: "string",
  },
} as ComponentStory<typeof Turbo, ComponentProps<typeof Turbo>>;
