import { Tabs } from "./Tabs";
import { ComponentProps, createSignal } from "solid-js";
import type { ComponentStory } from "../../../stories";

const [tab, onSelect] = createSignal("a");

export default {
  category: "Design System/Atoms/Inputs",
  component: Tabs,
  stories: [
    {
      title: "Default",
      props: {
        tabs: () => ({
          a: {
            label: "First",
          },
          b: {
            label: "Second",
          },
          c: {
            label: "Last",
          },
        }),
        tab,
        onSelect,
      },
    },
  ],
} as ComponentStory<typeof Tabs, ComponentProps<typeof Tabs>>;
