import type { Component, ComponentProps } from "solid-js";

declare type Story<T extends Component<P>, P = {}> = {
  title: string;
  props?: ComponentProps<T>;
};

type ComponentStory<T extends Component<P>, P = {}> = {
  category?: string;
  component: T;
  stories: Story<T, P>[];
  props?: ComponentProps<T>;
  propTypes?: Record<
    keyof ComponentProps<T>,
    "string" | "boolean" | "function" | (string | boolean)[]
  >;
  effects?: Record<
    keyof ComponentProps<T>,
    (props: ComponentProps<T>, ...args: any[]) => Partial<ComponentProps<T>>
  >;
};
