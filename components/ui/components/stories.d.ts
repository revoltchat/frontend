import type { Component, ComponentProps } from 'solid-js';

declare type Story<T extends Component> = {
  title: string;
  props?: ComponentProps<T>
}

declare type ComponentStory<T extends Component> = {
  category?: string;
  component: T;
  stories: Story<T>[];
  props?: ComponentProps<T>;
  propTypes?: Record<keyof ComponentProps<T>, 'string' | (string | boolean)[]>
}