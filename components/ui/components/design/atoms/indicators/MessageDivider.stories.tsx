import { MessageDivider } from "./MessageDivider";
import type { ComponentStory } from "../../../stories";

export default {
  category: "Design System/Atoms/Indicators",
  component: MessageDivider,
  stories: [
    {
      title: "Default"
    },
    {
      title: "Unread",
      props: {
        unread: true
      }
    }
  ],
  props: {
    date: "1st December 2022",
  },
  propTypes: {
    date: 'string',
    unread: 'boolean'
  },
} as ComponentStory<typeof MessageDivider>;
