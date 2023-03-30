import type { JSX } from "solid-js";

export default function makeContainerDecorator({
  width,
  height,
  flex,
}: {
  width?: number;
  height?: number;
  flex?: "col" | "row";
}) {
  return (props: { children: JSX.Element }) => (
    <div
      style={{
        "min-width": width ? `${width}px` : undefined,
        "min-height": height ? `${height}px` : undefined,
        display: flex ? "flex" : "block",
        "flex-direction": flex === "col" ? "column" : undefined,
      }}
    >
      {props.children}
    </div>
  );
}
