import { JSXElement } from "solid-js";

import "mdui/components/navigation-rail-item.js";

interface Props {
  value: string;
  icon: JSXElement;
  children: JSXElement;
}

export function NavigationRailItem(props: Props) {
  return (
    <mdui-navigation-rail-item value={props.value}>
      {props.children} <div slot="icon">{props.icon}</div>
    </mdui-navigation-rail-item>
  );
}
