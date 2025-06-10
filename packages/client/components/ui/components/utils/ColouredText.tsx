import { JSX, Match, Switch } from "solid-js";

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
            "-webkit-text-fill-color": "transparent",
            "background-clip": "text",
            "-webkit-background-clip": "text",
            "text-decoration": "none",
          }}
          children={props.children}
        />
      </Match>
    </Switch>
  );
}
