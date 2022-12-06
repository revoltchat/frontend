import { Button } from './Button'
import { BiSolidBatteryLow, BiSolidUser } from 'solid-icons/bi';
import type { ComponentStory } from '../../../stories';

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
    },
    {
      title: 'Plain',
      props: {
        palette: 'plain'
      }
    },
    {
      title: 'Plain (Secondary)',
      props: {
        palette: 'plain-secondary'
      }
    },
    {
      title: 'Success',
      props: {
        palette: 'success'
      }
    },
    {
      title: 'Warning',
      props: {
        palette: 'warning'
      }
    },
    {
      title: 'Error',
      props: {
        palette: 'error'
      }
    },
    {
      title: 'Icon',
      props: {
        compact: 'icon',
        children: <BiSolidUser size={16} />
      }
    },
    {
      title: 'Icon (Accent)',
      props: {
        compact: 'icon',
        palette: 'accent',
        children: <BiSolidBatteryLow size={16} />
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
