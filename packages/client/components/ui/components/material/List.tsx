import { JSXElement } from "solid-js";

import "mdui/components/list-item.js";
import "mdui/components/list-subheader.js";
import "mdui/components/list.js";
import { cva } from "styled-system/css";

export function List(props: { children: JSXElement }) {
  return <mdui-list>{props.children}</mdui-list>;
}

export function ListSubheader(props: { children: JSXElement }) {
  return (
    <mdui-list-subheader class={subheader()}>
      {props.children}
    </mdui-list-subheader>
  );
}

const subheader = cva({
  base: {
    paddingInline: "var(--gap-lg)",
  },
});

export function ListItem(props: {
  children: JSXElement;
  rounded?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return <mdui-list-item class={listitem()} {...props} />;
}

const listitem = cva({
  base: {
    minHeight: 0,
  },
});
