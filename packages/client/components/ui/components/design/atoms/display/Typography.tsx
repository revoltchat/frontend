import type { JSX } from "solid-js/jsx-runtime";

type TypographyProps = {
  /**
   * Which variant to use
   */
  readonly variant: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & JSX.HTMLAttributes<any>;

/**
 * Generate typography (JS-mapped) CSS styles from theme and variant
 * @param theme Theme
 * @param variant Variant
 * @returns (JS-mapped) CSS styles
 */
export function generateTypography(theme: any, variant: any) {
  return {
    color: "red",
  };
}

/**
 * Generate typography CSS styles from theme and variant
 * @param theme Theme
 * @param variant Variant
 * @returns CSS styles
 */
export function generateTypographyCSS(theme: any, variant: any) {
  return {
    color: "red",
  };
}

/**
 * Typography component for displaying text around the app
 * @param props Text rendering options
 */
export const Typography = (props: TypographyProps) => {
  return <span>Replace me! &lt;Typograhy/&gt; removed!</span>;
};
