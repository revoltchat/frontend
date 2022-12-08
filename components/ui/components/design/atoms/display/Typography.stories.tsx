import { Typography } from "./Typography";
import type { ComponentStory } from "../../../stories";

export default {
  category: "Design System/Atoms/Display",
  component: Typography,
  stories: [
    {
      title: "Heading 1",
      props: {
        variant: 'h1'
      },
    },
    {
      title: "Heading 2",
      props: {
        variant: 'h2'
      },
    },
    {
      title: "Heading 3",
      props: {
        variant: 'h3'
      },
    },
    {
      title: "Heading 4",
      props: {
        variant: 'h4'
      },
    },
    {
      title: "Subtitle",
      props: {
        variant: 'subtitle'
      },
    },
    {
      title: "Label",
      props: {
        variant: 'label'
      },
    },
    {
      title: "Small",
      props: {
        variant: 'small'
      },
    },
    {
      title: "Username",
      props: {
        variant: 'username'
      },
    }
  ],
  props: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
  propTypes: {
    children: 'string',
    variant: ['h1', 'h2', 'h3', 'h4', 'subtitle', 'label', 'small', 'username']
  }
} as ComponentStory<typeof Typography>;
