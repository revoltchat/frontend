import type { ComponentStory } from "../stories";
import type { ComponentProps } from "solid-js";
import { Tooltip } from "./Tooltip";
import { Button } from "../design";

export default {
  category: "Floating/Tooltip",
  component: Tooltip,
  stories: [{ title: "Default" }],
  props: {
    children(fn) {
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
} as ComponentStory<typeof Tooltip, ComponentProps<typeof Tooltip>>;
