import { Row } from "./Row";
import type { ComponentStory } from "../../stories";
import TextColourDecorator from "../../../decorators/TextColourDecorator";

export default {
  category: "Design System/Layout",
  component: Row,
  stories: [
    {
      title: "Default"
    },
    {
      title: "No Gap",
      props: {
        gap: 'none'
      }
    },
    {
      title: "Small Gap",
      props: {
        gap: 'sm'
      }
    },
    {
      title: "Large Gap",
      props: {
        gap: 'lg'
      }
    },
    {
      title: "Align (Center)",
      props: {
        children: <>
          <div>two<br/>lines</div>
          <div>text</div>
          <div>normal</div>
        </>,
        align: true
      }
    },
    {
      title: "Justify (End)",
      props: {
        justify: 'end',
        grow: true
      },
      decorators: [
        ({ children }) => <div style={{ width: '360px', display: 'flex' }}>
          {children}
        </div>
      ]
    }
  ],
  props: {
    children: <>
      <div>Element 1</div>
      <div>Element 2</div>
      <div>Element 3</div>
    </>,
    gap: "md",
    align: "start",
    justify: "start",
    grow: false,
  },
  decorators: [
    TextColourDecorator
  ],
  propTypes: {
    children: "component",
    gap: ["none", "sm", "md", "lg"],
    align: ["start", "end", "left", "right", "center", "stretch", true],
    justify: ["start", "end", "left", "right", "center", "stretch", true],
    grow: 'boolean'
  },
} as ComponentStory<typeof Row>;
