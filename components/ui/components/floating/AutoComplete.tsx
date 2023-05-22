import { Accessor, For } from "solid-js";
import { styled } from "solid-styled-components";

import { UnicodeEmoji } from "@revolt/markdown/emoji";

import { AutoCompleteState } from "../../directives";
import { Column, OverflowingText, Row } from "../design";

interface Props {
  state: Accessor<AutoCompleteState>;
}

/**
 * Auto complete popup
 */
export function AutoComplete(props: Props) {
  return (
    <Base>
      <For
        each={
          (props.state() as AutoCompleteState & { matched: "emoji" }).matches
        }
      >
        {(match) => (
          <Row align>
            <UnicodeEmoji emoji={match.codepoint} />{" "}
            <Shortcode>:{match.shortcode}:</Shortcode>
          </Row>
        )}
      </For>
    </Base>
  );
}

const Shortcode = styled(OverflowingText)`
  font-size: 0.9em;
  color: ${(props) => props.theme!.colours["foreground-200"]};
`;

const Base = styled(Column)`
  --emoji-size: 1.4em;

  width: 340px;
  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) => props.theme!.colours["background-100"]};
`;
