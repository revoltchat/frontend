import type { ComponentStory } from '../../../stories';
import { Button } from './Button'

export default {
  category: 'Design System/Atoms/Inputs',
  component: Button,
  stories: [
    {
      title: 'Primary',
      props: {
        palette: 'primary'
      }
    },
    {
      title: 'Secondary',
      props: {
        palette: 'secondary'
      }
    },
    {
      title: 'Accent',
      props: {
        palette: 'accent'
      }
    }
  ],
  props: {
    children: "Hello!"
  },
  propTypes: {
    children: 'string',
    palette: 'string',
    compact: [true, false, 'icon']
  }
} as ComponentStory<typeof Button>;
