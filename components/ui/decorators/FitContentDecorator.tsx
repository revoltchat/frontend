import type { JSX } from "solid-js";

export default function FitContentDecorator(props: {
  children: JSX.Element;
}) {
  return <div style={{"width":"fit-content"}}>{props.children}</div>;
}
