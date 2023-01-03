import { splitProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import {
  css,
  DefaultTheme,
  StylesArg,
  useTheme,
} from "solid-styled-components";

type TypographyProps = {
  variant: keyof DefaultTheme["typography"];
} & JSX.HTMLAttributes<any>;

/**
 * Generate typography CSS styles from theme and variant
 * @param theme Theme
 * @param variant Variant
 * @returns CSS styles
 */
export function generateTypography(
  theme: DefaultTheme,
  variant: keyof DefaultTheme["typography"]
) {
  const { fontSize, fontWeight, lineHeight, margin, textTransform, colour } =
    theme.typography[variant];

  let styles = {
    fontSize,
    fontWeight,
    lineHeight,
    margin,
    textTransform,
  } as Record<string, string>;

  if (colour) {
    styles.color = theme.colours[colour];
  }

  return styles as StylesArg<{}>;
}

/**
 * Typography component for displaying text around the app
 * @param props Text rendering options
 */
export const Typography = (props: TypographyProps) => {
  const [local, others] = splitProps(props, ["variant"]);

  const theme = useTheme();
  const className = css(generateTypography(theme, local.variant));

  switch (theme.typography[local.variant].element) {
    case "h1":
      return <h1 class={className} {...others} />;
    case "h2":
      return <h2 class={className} {...others} />;
    case "h3":
      return <h3 class={className} {...others} />;
    case "h4":
      return <h4 class={className} {...others} />;
    case "label":
      return <label class={className} {...others} />;
    default:
      return <span class={className} {...others} />;
  }
};
