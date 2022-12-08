import { Header, HeaderWithTransparency } from "./Header";
import type { ComponentProps } from "solid-js";
import type { ComponentStory } from "../../../stories";
import TextColourDecorator from "../../../../decorators/TextColourDecorator";
import { Column } from "../../layout";

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
        ({ children }) => (
          <Column>
            <Column>
              {new Array(5).fill(0).map(() => (
                <span>background content</span>
              ))}
            </Column>
            {children}
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
} as ComponentStory<typeof Header, ComponentProps<typeof Header>>;
