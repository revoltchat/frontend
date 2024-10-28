import { type ComponentProps, Index } from "solid-js";

import TextColourDecorator from "../../../../decorators/TextColourDecorator";
import type { ComponentStory } from "../../../stories";
import { Column } from "../../layout";

import { Header, HeaderWithTransparency } from "./Header";

export default {
  category: "Design System/Atoms/Display",
  component: Header,
  stories: [
    {
      title: "Default",
    },
    {
      title: "With Transparency",
      component: HeaderWithTransparency,
      decorators: [
        (props: any) => (
          <Column>
            <Column>
              <Index each={new Array(5).fill(0)}>
                {() => <span>background content</span>}
              </Index>
            </Column>
            {props.children}
          </Column>
        ),
      ],
    },
  ],
  props: {
    children: "My Cool Server",
  },
  decorators: [TextColourDecorator],
  propTypes: {
    children: "string",
  },
} as never as ComponentStory<typeof Header, ComponentProps<typeof Header>>;
