import type { JSX } from "solid-js";

export default function ResizeContentDecorator({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <div
      style={{
        width: "460px",
        height: "640px",
        display: "flex",
        "flex-direction": "column",
        resize: "both",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
