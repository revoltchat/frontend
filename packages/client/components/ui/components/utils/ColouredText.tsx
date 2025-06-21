import { JSX, Match, Switch } from "solid-js";

import { css } from "styled-system/css";

/**
 * Coloured text
 */
export function ColouredText(props: {
  colour?: string;
  children?: string | JSX.Element;
}) {
  return (
    <Switch
      fallback={
        <span style={{ color: props.colour }} children={props.children} />
      }
    >
      <Match when={props.colour?.includes("gradient")}>
        <span
          style={{
            background: props.colour!,
          }}
          class={css({
            backgroundClip: "text !important",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
          })}
          children={props.children}
        />
      </Match>
    </Switch>
  );
}
