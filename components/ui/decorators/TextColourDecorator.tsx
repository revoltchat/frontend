import type { JSX } from "solid-js";

export default function TextColourDecorator(props: {
  children: JSX.Element;
}) {
  return <div style={{"color":"white"}}>{props.children}</div>;
}
