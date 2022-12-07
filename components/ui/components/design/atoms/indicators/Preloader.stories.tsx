import { Preloader } from "./Preloader";
import type { ComponentProps } from "solid-js";
import type { ComponentStory } from "../../../stories";

export default {
  category: "Design System/Atoms/Indicators",
  component: Preloader,
  stories: [
    {
      title: "Ring",
      props: {
        type: 'ring'
      }
    },
    {
      title: "Spinner",
      props: {
        type: 'spinner'
      }
    }
  ],
  propTypes: {
    type: ['ring', 'spinner'],
    grow: 'boolean'
  },
} as ComponentStory<typeof Preloader, ComponentProps<typeof Preloader>>;
