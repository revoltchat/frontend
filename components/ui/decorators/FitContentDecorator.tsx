import type { JSX } from "solid-js";

export default function FitContentDecorator({
  children,
}: {
  children: JSX.Element;
}) {
  return <div style="width: fit-content;">{children}</div>;
}
