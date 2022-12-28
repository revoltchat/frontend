import type { ComponentProps } from "solid-js";
import type { ComponentStory } from "../../stories";
import { MessageContainer } from "./Container";

import TestImage from "../../../test-images/the-halal-design-studio-ZrJpH6W-HDs-unsplash.jpg";

export default {
  category: "Messaging/Message/Container",
  component: MessageContainer,
  stories: [
    { title: "Default" },
    {
      title: "Tail",
      props: {
        tail: true,
      },
    },
    {
      title: "Edited Message",
      props: {
        children: "hello this is an edit",
        edited: +new Date(),
      },
    },
    {
      title: "Edited Tail",
      props: {
        tail: true,
        children: "hello this is an edit",
        edited: +new Date(),
      },
    },
    {
      title: "Coloured Username",
      props: {
        colour: "linear-gradient(30deg, purple, orange)",
      },
    },
  ],
  props: {
    children: "I love rolt!!!!!",
    timestamp: +new Date(),
    avatar: TestImage,
    username: "rolt user",
  },
  propTypes: {
    children: "string",
    avatar: "string",
    colour: "string",
    username: "string",
    timestamp: "number",
    edited: "number",
    header: "component",
    tail: "boolean",
  },
} as ComponentStory<
  typeof MessageContainer,
  ComponentProps<typeof MessageContainer>
>;
