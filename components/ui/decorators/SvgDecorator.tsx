import type { JSX } from "solid-js";

export default function makeSvgDecorator(viewSize: number, domSize: number) {
  return ({ children }: { children: JSX.Element }) => (
    <svg
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      width={domSize}
      height={domSize}
    >
      {children}
    </svg>
  );
}
