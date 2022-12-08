import { Initials } from "./Initials";
import type { ComponentProps } from "solid-js";
import type { ComponentStory } from "../../../stories";
import TextColourDecorator from "../../../../decorators/TextColourDecorator";

export default {
  category: "Design System/Atoms/Display",
  component: Initials,
  stories: [
    {
      title: "Default",
      props: {
        input: "this is a long string",
        maxLength: 3,
      },
    },
  ],
  propTypes: {
    input: "string",
    maxLength: "number",
  },
  decorators: [TextColourDecorator],
} as ComponentStory<typeof Initials, ComponentProps<typeof Initials>>;
