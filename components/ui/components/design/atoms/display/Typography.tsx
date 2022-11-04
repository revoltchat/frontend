import { splitProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { styled } from "solid-styled-components";

const H1 = styled("h1")`
  /* legacy: SETTINGS TITLE */

  margin: 0;
  line-height: 1rem;

  font-weight: 600;
  font-size: 1.2rem;
  color: ${({ theme }) => theme!.colours["foreground"]};
`;

const H2 = styled("h2")`
  /* legacy: MODAL TITLE */

  margin: 0;
  font-weight: 700;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme!.colours["foreground"]};
`;

const H3 = styled("h3")`
  /* legacy: SETTINGS SECTION TITLE */

  margin: 0;
  font-weight: 700;
  font-size: 0.75rem;
  color: ${({ theme }) => theme!.colours["foreground-100"]};
`;

const H4 = styled("h4")`
  /* legacy: MODAL TITLE */

  margin: 0;
  font-weight: 500;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme!.colours["foreground-100"]};
`;

const Subtitle = styled("h5")`
  /* legacy: SETTINGS DESCRIPTION */

  margin: 0;
  font-weight: 500;
  font-size: 0.75rem;
`;

const InputLabel = styled("label")`
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme!.colours["foreground"]};
`;

const SmallText = styled("span")`
  font-size: 0.7rem;
`;

const Username = styled("span")`
  font-weight: 600;
`;

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "subtitle"
  | "label"
  | "small"
  | "username";

type TypographyProps = {
  variant: Variant;
} & JSX.HTMLAttributes<any>;

/**
 * Typography component for displaying text around the app
 * @param props Text rendering options
 */
export const Typography = (props: TypographyProps) => {
  const [local, others] = splitProps(props, ["variant"]);

  switch (local.variant) {
    case "h1":
      return <H1 {...others} />;
    case "h2":
      return <H2 {...others} />;
    case "h3":
      return <H3 {...others} />;
    case "h4":
      return <H4 {...others} />;
    case "subtitle":
      return <Subtitle {...others} />;
    case "label":
      return <InputLabel {...others} />;
    case "small":
      return <SmallText {...others} />;
    case "username":
      return <Username {...others} />;
  }
};
