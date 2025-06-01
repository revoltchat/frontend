import { JSXElement, Match, Switch, createEffect } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { useState } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";
import { Button, Checkbox, iconSize } from "@revolt/ui";

import MdWarning from "@material-design-icons/svg/round/warning.svg?component-solid";

/**
 * Age gate filter for any content
 */
export function AgeGate(props: {
  enabled: boolean;
  contentId: string;
  contentName: string;
  contentType: "channel";
  children: JSXElement;
}) {
  const state = useState();

  const confirmed = state.layout.getSectionState(LAYOUT_SECTIONS.MATURE, false);
  const allowed = state.layout.getSectionState(
    props.contentId + "-nsfw",
    false,
  );

  return (
    <Switch fallback={props.children}>
      <Match when={props.enabled && (!confirmed || !allowed)}>
        <Base>
          <MdWarning {...iconSize("8em")} />
          <Title>{props.contentName}</Title>
          <SubText>
            <Trans>This channel is marked as mature.</Trans>
          </SubText>

          <Confirmation>
            <Checkbox
              value={state.layout.getSectionState(
                LAYOUT_SECTIONS.MATURE,
                false,
              )}
              onChange={() =>
                state.layout.toggleSectionState(LAYOUT_SECTIONS.MATURE, false)
              }
            />

            <Trans>I confirm that I am at least 18 years old.</Trans>
          </Confirmation>

          <Actions>
            <Button variant="secondary" onPress={() => history.back()}>
              <Trans>Back</Trans>
            </Button>
            <Button
              variant="primary"
              onPress={() =>
                state.layout.getSectionState(LAYOUT_SECTIONS.MATURE) &&
                state.layout.setSectionState(props.contentId + "-nsfw", true)
              }
            >
              <Trans>Enter Channel</Trans>
            </Button>
          </Actions>
        </Base>
      </Match>
    </Switch>
  );
}

const Base = styled("div", {
  base: {
    height: "100%",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--gap-lg)",
    userSelect: "none",
    overflowY: "auto",

    "& svg": {
      fill: "var(--customColours-warning-color)",
    },

    gap: "var(--gap-sm)",
  },
});

const Title = styled("h2", {
  base: {
    fontSize: "2em",
    fontWeight: "black",
  },
});

const SubText = styled("span", {
  base: {},
});

const Confirmation = styled("label", {
  base: {
    display: "flex",
    gap: "var(--gap-sm)",
    alignItems: "center",
  },
});

const Actions = styled("div", {
  base: {
    display: "flex",
    marginTop: "var(--gap-lg)",
    gap: "var(--gap-lg)",
  },
});
