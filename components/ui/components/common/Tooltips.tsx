import { JSXElement } from "solid-js";
import { tippy, TippyOptions } from 'solid-tippy';
import 'tippy.js/dist/tippy.css';

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      tippy: TippyOptions;
    }
  }
}

// prevent import to be cleaned if dettected as not used
tippy;

export type Props = {
  content: string;
  children: JSXElement;
}

export default function Tooltip({ content, children }: Props) {
  return (
    <div use:tippy={{ props: { content: content, animation: 'shift-away', theme: 'revolt' } }}>
      <div style={`display: flex;`}>{children}</div>
    </div>
  );
}