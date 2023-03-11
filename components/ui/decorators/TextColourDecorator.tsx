import type { JSX } from "solid-js";

export default function TextColourDecorator({
  children,
}: {
  children: JSX.Element;
}) {
  return <div style="color: white">{children}</div>;
}
