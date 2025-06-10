import type { ComponentProps } from "solid-js";

import { Button } from "../design";
import type { ComponentStory } from "../../componentsOld/stories";

import { Tooltip } from "./Tooltip";

export default {
  category: "Floating/Tooltip",
  component: Tooltip,
  stories: [{ title: "Default" }],
  props: {
    /**
     * Render the children
     */
    children(fn: any) {
      return (
        <Button {...fn} type="button">
          Example
        </Button>
      );
    },
    content: "Hello, I am a tooltip!",
    initialState: true,
  },
  propTypes: {},
} as never as ComponentStory<typeof Tooltip, ComponentProps<typeof Tooltip>>;
