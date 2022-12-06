import { Checkbox } from './Checkbox'
import type { ComponentStory } from '../../../stories';

export default {
  category: 'Design System/Atoms/Inputs',
  component: Checkbox,
  stories: [
    {
      title: 'Default'
    },
    {
      title: 'Checked',
      props: {
        value: true
      }
    }
  ],
  props: {
    title: "Do you want this enabled?",
    description: "This will enable this specific thing for you."
  },
  propTypes: {
    title: 'string',
    description: 'string',
    disabled: 'boolean',
    value: 'boolean',
    onChange: 'function'
  },
  effects: {
    onChange: (props) => ({
      value: !props.value
    })
  }
} as ComponentStory<typeof Checkbox>;
