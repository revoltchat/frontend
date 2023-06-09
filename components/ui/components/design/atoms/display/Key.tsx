import {
  BiSolidDownArrowAlt,
  BiSolidLeftArrowAlt,
  BiSolidRightArrowAlt,
  BiSolidUpArrowAlt,
} from "solid-icons/bi";
import { Component, JSXElement, createMemo } from "solid-js";
import { styled } from "solid-styled-components";

import { useTranslation } from "@revolt/i18n";

export interface Props {
  children: string;
  short?: boolean;
  /** if the key should be styled in a more simple way */
  simple?: boolean;
}

const Base = styled("kbd", "Key")<Pick<Props, "simple">>`
  display: inline-flex;
  background-color: ${(props) => props.theme?.colours["background-300"]};

  padding: 0.5ch 1ch 0.35ch;

  border-radius: 3px;
  outline: 1px solid rgb(66 66 66 / 0.5);

  font-weight: 700;
  font-family: ${(props) => props.theme?.fonts.monospace};

  text-transform: uppercase;

  svg {
    // change arrow scaling in svgs to better fit the text
    transform: scale(1.5);
  }

  ${(props) =>
    !props.simple
      ? `
          box-shadow: 0 1px 1px rgba(133, 133, 133, 0.2),
            0 2.5px 0 0 rgba(0, 0, 0, 0.5);

          &:active {
            outline: 1px solid rgb(0 0 0 / 0.3);
            color: ${props.theme?.colours["foreground-300"]};
            transform: translateY(2px);
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          }
        `
      : undefined}
`;

const REPLACEMENTS: Record<string, () => JSXElement> = {
  ArrowUp: () => <BiSolidUpArrowAlt size="1em" />,
  ArrowDown: () => <BiSolidDownArrowAlt size="1em" />,
  ArrowLeft: () => <BiSolidLeftArrowAlt size="1em" />,
  ArrowRight: () => <BiSolidRightArrowAlt size="1em" />,
};

export const Key: Component<Props> = (props) => {
  const t = useTranslation();

  const keyName = createMemo(() => {
    const key = props.children;

    return (
      REPLACEMENTS[key]?.() ??
      (props.short
        ? t(`keys.${key}.short`, {}, t(`keys.${key}.full`, {}, key))
        : t(`keys.${key}.full`, {}, key))
    );
  });

  return <Base simple={props.simple}>{keyName()}</Base>;
};
