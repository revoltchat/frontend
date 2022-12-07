import { OverflowingText } from "./OverflowingText";
import type { ComponentStory } from "../../stories";
import TextColourDecorator from "../../../decorators/TextColourDecorator";

export default {
  category: "Design System/Layout",
  component: OverflowingText,
  stories: [
    {
      title: "Default"
    }
  ],
  props: {
    children: "This is a long piece of text."
  },
  propTypes: {
    children: 'string'
  },
  decorators: [
    ({ children }) => <div style={{ display: 'flex', "justify-content": 'stretch', width: '120px' }}>{children}</div>,
    TextColourDecorator
  ]
} as ComponentStory<typeof OverflowingText>;
