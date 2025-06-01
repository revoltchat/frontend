import type { ComponentStory } from "../../../stories";

import { OverrideSwitch } from "./OverrideSwitch";

export default {
  category: "Design System/Atoms/Inputs",
  component: OverrideSwitch,
  stories: [
    {
      title: "Default"
    },
    {
      title: "Disabled",
      props: {
        disabled: true,
      },
    },
  ],
  propTypes: {
    disabled: "boolean",
    value: ["allow", "neutral", "deny"],
    onChange: "function",
  },
  props: {
    value: "neutral",
  },
  effects: {
    onChange: (_, value) => ({
      value,
    }),
  },
} as ComponentStory<any>;
// } as ComponentStory<typeof OverrideSwitch>;
