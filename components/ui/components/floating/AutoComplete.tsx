import { For, JSX, Match, Switch } from "solid-js";
import { styled } from "solid-styled-components";

import { CustomEmoji, UnicodeEmoji } from "@revolt/markdown/emoji";

import { AutoCompleteState } from "../../directives";
import { Column, Row } from "../design";

/**
 * Auto complete popup
 */
export function AutoComplete(
  props: Exclude<JSX.Directives["floating"]["autoComplete"], undefined>
) {
  return (
    <Base>
      <For
        each={
          (props.state() as AutoCompleteState & { matched: "emoji" }).matches
        }
      >
        {(match, index) => (
          <Entry align selected={index() === props.selection()}>
            <Switch
              fallback={
                <>
                  <UnicodeEmoji
                    emoji={(match as { codepoint: string }).codepoint}
                  />{" "}
                  <Name>:{match.shortcode}:</Name>
                </>
              }
            >
              <Match when={match.type === "custom"}>
                <CustomEmoji id={(match as { id: string }).id} />{" "}
                <Name>:{match.shortcode}:</Name>
              </Match>
            </Switch>
          </Entry>
        )}
      </For>
    </Base>
  );
}

/**
 * Individual auto complete entry
 */
const Entry = styled(Row)<{ selected: boolean }>`
  cursor: pointer;
  background: ${(props) =>
    props.selected ? props.theme!.colours["background-300"] : "transparent"};
`;

/**
 * Entry name
 */
const Name = styled.div`
  font-size: 0.9em;
  color: ${(props) => props.theme!.colours["foreground-200"]};
`;

/**
 * Auto complete container
 */
const Base = styled(Column)`
  --emoji-size: 1.4em;

  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) => props.theme!.colours["background-100"]};
`;
