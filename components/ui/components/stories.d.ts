import type { Component, ComponentProps } from "solid-js";
import type { JSX } from "solid-js";

type Decorator<T extends Component<P>, P = {}> = Component<{
  children: JSX.Element;
  childProps: ComponentProps<T>;
}>;

declare type Story<T extends Component<P>, P = {}> = {
  title: string;
  props?: ComponentProps<T>;
  decorators?: Decorator<T, P>[];
  component?: T;
  skipRegressionTests?: boolean;
};

declare type ComponentStory<T extends Component<P>, P = {}> = {
  category?: string;
  component: T;
  stories: Story<T, P>[];
  props?: ComponentProps<T>;
  decorators?: any[]; //Decorator<T, P>[]; TODO: fix typings here
  propTypes?: Record<
    keyof ComponentProps<T>,
    | "string"
    | "boolean"
    | "number"
    | "function"
    | "component"
    | (string | boolean)[]
  >;
  effects?: Record<
    keyof ComponentProps<T>,
    (props: ComponentProps<T>, ...args: any[]) => Partial<ComponentProps<T>>
  >;
};
