/**
 * Coloured text
 */
export function ColouredText(props: {
  colour?: string;
  clip?: boolean;
  children?: string | Element;
}) {
  return (
    <span
      style={{
        color: props.colour ?? "inherit",
        background: props.clip ? props.colour! : "none",
        "-webkit-text-fill-color": props.clip ? "transparent" : "unset",
        "background-clip": props.clip ? "text" : "unset",
        "-webkit-background-clip": props.clip ? "text" : "unset",
        "text-decoration": (props.clip ? "none" : "unset") + " !important",
      }}
    >
      {props.children}
    </span>
  );
}
