import { For, JSX, Match, Switch } from "solid-js";

import { ServerMember } from "revolt.js";
import { styled } from "styled-system/jsx";

import { CustomEmoji, UnicodeEmoji } from "@revolt/markdown/emoji";

import { AutoCompleteState } from "../../directives";
import { Avatar } from "../design";
import { Column } from "../layout";
import { ColouredText } from "../utils";

/**
 * Auto complete popup
 */
export function AutoComplete(
  props: Exclude<JSX.Directives["floating"]["autoComplete"], undefined>,
) {
  return (
    <Base>
      <Switch>
        <Match when={props.state().matched === "emoji"}>
          <For
            each={
              (props.state() as AutoCompleteState & { matched: "emoji" })
                .matches
            }
          >
            {(match, index) => (
              <Entry
                selected={index() === props.selection()}
                onMouseDown={() => props.select(index())}
                onMouseEnter={() => props.setSelection(index())}
              >
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
        </Match>
        <Match when={props.state().matched === "user"}>
          <For
            each={
              (
                props.state() as AutoCompleteState & {
                  matched: "user";
                }
              ).matches
            }
          >
            {(match, index) => (
              <Entry
                selected={index() === props.selection()}
                onMouseDown={() => props.select(index())}
                onMouseEnter={() => props.setSelection(index())}
              >
                <Avatar src={match.user.animatedAvatarURL} size={24} />{" "}
                <Name>{match.user.displayName}</Name>
                {match.user instanceof ServerMember &&
                  match.user.displayName !== match.user.user?.username && (
                    <>
                      {" "}
                      @{match.user.user?.username}#
                      {match.user.user?.discriminator}
                    </>
                  )}
              </Entry>
            )}
          </For>
        </Match>
        <Match when={props.state().matched === "role"}>
          <For
            each={
              (
                props.state() as AutoCompleteState & {
                  matched: "role";
                }
              ).matches
            }
          >
            {(match, index) => (
              <Entry
                selected={index() === props.selection()}
                onMouseDown={() => props.select(index())}
                onMouseEnter={() => props.setSelection(index())}
              >
                <Name>
                  <ColouredText colour={match.role.colour}>
                    {match.role.name}
                  </ColouredText>
                </Name>
              </Entry>
            )}
          </For>
        </Match>
        <Match when={props.state().matched === "channel"}>
          <For
            each={
              (
                props.state() as AutoCompleteState & {
                  matched: "channel";
                }
              ).matches
            }
          >
            {(match, index) => (
              <Entry
                selected={index() === props.selection()}
                onMouseDown={() => props.select(index())}
                onMouseEnter={() => props.setSelection(index())}
              >
                <Name>#{match.channel.name}</Name>
              </Entry>
            )}
          </For>
        </Match>
      </Switch>
    </Base>
  );
}

/**
 * Individual auto complete entry
 */
const Entry = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",

    cursor: "pointer",
    padding: "var(--gap-sm) var(--gap-md)",
    background: "transparent",
  },
  variants: {
    selected: {
      true: {
        background:
          "var(--colours-component-context-menu-item-hover-background)",
      },
    },
  },
});

/**
 * Entry name
 */
const Name = styled("div", {
  base: {
    fontSize: "0.9em",
  },
});

/**
 * Auto complete container
 */
const Base = styled(Column, {
  base: {
    "--emoji-size": "1.4em",
    padding: "var(--gap-md) 0",
    borderRadius: "var(--borderRadius-md)",
    backdropFilter: "var(--effects-blur-md)",
    color: "var(--colours-component-context-menu-foreground)",
    background: "var(--colours-component-context-menu-background)",
    boxShadow: "0 0 3px var(--colours-component-context-menu-shadow)",
  },
});
