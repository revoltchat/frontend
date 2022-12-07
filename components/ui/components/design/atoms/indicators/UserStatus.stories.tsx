import { UserStatus } from "./UserStatus";
import type { ComponentProps } from "solid-js";
import type { ComponentStory } from "../../../stories";
import makeSvgDecorator from "../../../../decorators/SvgDecorator";

export default {
  category: "Design System/Atoms/Indicators",
  component: UserStatus,
  stories: [
    {
      title: "Online"
    },
    {
      title: "Idle",
      props: {
        status: 'Idle'
      }
    },
    {
      title: "Busy",
      props: {
        status: 'Busy'
      }
    },
    {
      title: "Focus",
      props: {
        status: 'Focus'
      }
    },
    {
      title: "Invisible",
      props: {
        status: 'Invisible'
      }
    }
  ],
  props: {
    status: 'Online'
  },
  decorators: [
    makeSvgDecorator(32, 128)
  ],
  propTypes: {
    status: 'string'
  },
} as ComponentStory<typeof UserStatus, ComponentProps<typeof UserStatus>>;
