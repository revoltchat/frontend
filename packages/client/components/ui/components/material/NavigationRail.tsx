import { Accessor, JSXElement, Setter } from "solid-js";

import "mdui/components/navigation-rail-item.js";
import "mdui/components/navigation-rail.js";
import { cva } from "styled-system/css";

interface Props {
  children: JSXElement;
  contained: boolean;
  value: Accessor<string>;
  onValue: Setter<string>;
}

export function NavigationRail(props: Props) {
  return (
    <mdui-navigation-rail
      class={rail()}
      value={props.value()}
      onChange={(e: Event) => props.onValue((e.currentTarget as any).value)}
      contained={props.contained}
    >
      {props.children}
    </mdui-navigation-rail>
  );
}

const rail = cva({
  base: {
    width: "56px",
  },
});

interface ItemProps {
  value: string;
  icon: JSXElement;
  children: JSXElement;
}

export function NavigationRailItem(props: ItemProps) {
  return (
    <mdui-navigation-rail-item value={props.value}>
      {props.children} <div slot="icon">{props.icon}</div>
    </mdui-navigation-rail-item>
  );
}
