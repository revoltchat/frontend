import { createSignal } from "solid-js";
import { styled } from "solid-styled-components";

import { CustomComponentProps, createComponent } from "./remarkRegexComponent";

const Spoiler = styled("span", "Spoiler")<{ shown: boolean }>`
  padding: 0 2px;
  border-radius: ${(props) => props.theme!.borderRadius.md};

  cursor: ${(props) => (props.shown ? "auto" : "pointer")};
  user-select: ${(props) => (props.shown ? "all" : "none")};
  color: ${(props) =>
    props.shown ? props.theme!.colours.foreground : "transparent"};
  background: ${(props) =>
    props.shown ? props.theme!.colours["background-100"] : "#151515"};

  > * {
    opacity: ${(props) => (props.shown ? 1 : 0)};
    pointer-events: ${(props) => (props.shown ? "unset" : "none")};
  }
`;

export function RenderSpoiler(props: CustomComponentProps) {
  const [shown, setShown] = createSignal(false);

  return (
    <Spoiler shown={shown()} onClick={() => setShown(true)}>
      {props.match}
    </Spoiler>
  );
}

export const remarkSpoiler = createComponent("spoiler", /!!([^!]+)!!/g);
