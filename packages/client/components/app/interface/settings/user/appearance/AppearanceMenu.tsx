import { For, Show } from "solid-js";

import { css } from "styled-system/css";

import { useState } from "@revolt/state";
import {
  Column,
  Row,
  SegmentedButton,
  SingleSelectSegmentedButtonGroup,
} from "@revolt/ui";

import MdColorize from "@material-design-icons/svg/filled/colorize.svg?component-solid";

/**
 * All appearance options for the client
 */
export function AppearanceMenu() {
  const state = useState();

  return (
    <Column>
      <SingleSelectSegmentedButtonGroup
        value={state.theme.mode}
        onSelect={(e) =>
          e.currentTarget.value &&
          state.theme.setMode(e.currentTarget.value as never)
        }
      >
        <SegmentedButton value="light">Light</SegmentedButton>
        <SegmentedButton value="dark">Dark</SegmentedButton>
        <SegmentedButton value="system">System</SegmentedButton>
      </SingleSelectSegmentedButtonGroup>
      <SingleSelectSegmentedButtonGroup
        value={state.theme.preset}
        onSelect={(e) =>
          e.currentTarget.value &&
          state.theme.setPreset(e.currentTarget.value as never)
        }
      >
        <SegmentedButton value="neutral">Revolt</SegmentedButton>
        <SegmentedButton value="you">Material You</SegmentedButton>
      </SingleSelectSegmentedButtonGroup>

      <Show when={state.theme.preset === "you"}>
        <Row justify>
          <For
            each={[
              "#FF5733",
              "#ffdc2f",
              "#9bf088",
              "#54ecc1",
              "#549bec",
              "#5470ec",
              "#8C5FD3",
            ]}
          >
            {(colour) => (
              <div
                class={css({
                  borderRadius: "var(--borderRadius-full)",
                  width: "48px",
                  height: "48px",
                  cursor: "pointer",
                })}
                style={{ "background-color": colour }}
                onClick={() => state.theme.setM3Accent(colour)}
              />
            )}
          </For>
          {/* <div
            class={css({
              borderRadius: "var(--borderRadius-full)",
              width: "48px",
              height: "48px",
              cursor: "pointer",
            })}
          >
            <MdColorize />
          </div> */}
        </Row>

        <SingleSelectSegmentedButtonGroup
          value={state.theme.m3Contrast.toFixed(1)}
          onSelect={(e) =>
            e.currentTarget.value &&
            state.theme.setM3Contrast(
              parseFloat(e.currentTarget.value as never),
            )
          }
        >
          <SegmentedButton value="-1.0">Reduced</SegmentedButton>
          <SegmentedButton value="0.0">Normal</SegmentedButton>
          <SegmentedButton value="0.5">High</SegmentedButton>
          <SegmentedButton value="1.0">Highest</SegmentedButton>
        </SingleSelectSegmentedButtonGroup>
      </Show>
    </Column>
  );
}
