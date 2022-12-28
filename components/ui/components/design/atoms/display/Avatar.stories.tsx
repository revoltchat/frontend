import type { ComponentProps } from "solid-js";
import type { ComponentStory } from "../../../stories";
import { Avatar } from "./Avatar";
import { UserStatus } from "../indicators";

import TestImage from "../../../../test-images/the-halal-design-studio-ZrJpH6W-HDs-unsplash.jpg";

export default {
  category: "Design System/Atoms/Avatar",
  component: Avatar,
  stories: [
    { title: "Default" },
    {
      title: "Cut Out",
      props: {
        interactive: true,
        holepunch: "bottom-right",
        overlay: () => <UserStatus status="Online" />,
      },
    },
    {
      title: "Fallback",
      props: {
        fallback: "test fallback string",
        src: undefined,
        interactive: true,
        holepunch: "bottom-right",
        overlay: () => <UserStatus status="Focus" />,
      },
    },
  ],
  props: {
    size: 256,
    src: TestImage,
  },
  propTypes: {
    size: "number",
    src: "string",
    fallback: "string",
    interactive: "boolean",
    holepunch: ["none", "bottom-right", "top-right", "right"],
    overlay: "component",
  },
} as ComponentStory<typeof Avatar, ComponentProps<typeof Avatar>>;
