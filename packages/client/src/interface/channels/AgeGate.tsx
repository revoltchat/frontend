import { JSXElement, Match, Switch, onMount, createSignal } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { useState } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";
import { Button, Checkbox, iconSize, Text } from "@revolt/ui";

import MdWarning from "@material-design-icons/svg/round/warning.svg?component-solid";

type GeoBlock = {
  countryCode: string;
  isAgeRestrictedGeo: boolean;
};

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

  const confirmed = () => state.layout.getSectionState(LAYOUT_SECTIONS.MATURE, false);
  const allowed = () => state.layout.getSectionState(
    props.contentId + "-nsfw",
    false,
  );

  const [geoBlock, setGeoBlock] = createSignal<GeoBlock | null>(null);

  onMount(() => {
    fetch("https://geo.revolt.chat")
      .then((res) => res.json())
      .then((data) => setGeoBlock(data))
      .catch(() => setGeoBlock(null));
  });

  return (
    <Switch fallback={props.children}>
      <Match when={geoBlock() && geoBlock()!.isAgeRestrictedGeo && props.enabled}>
        <Base>
          <MdWarning {...iconSize("8em")} />
          <Text class="headline" size="large">
            {props.contentName}
          </Text>

          <Text class="body" size="large">
            {geoBlock()!.countryCode === "GB" ? (
            <Trans>
              This channel is not available in your region while we review options on legalcompliance.
            </Trans>
            ) : (
              <Trans>This content is not available in your region.</Trans>
            )}
          </Text>

          <Button variant="text" onPress={() => history.back()}>
            <Trans>Back</Trans>
          </Button>
        </Base>
      </Match>
      <Match when={props.enabled && (!confirmed() || !allowed())}>
        <Base>
          <MdWarning {...iconSize("8em")} />
          <Text class="headline" size="large">
            {props.contentName}
          </Text>

          <Text class="body" size="large">
            <Trans>This channel is marked as mature.</Trans>
          </Text>

          <Confirmation>
            <Checkbox
              checked={state.layout.getSectionState(
                LAYOUT_SECTIONS.MATURE,
                false,
              )}
              onChange={() =>
                state.layout.toggleSectionState(LAYOUT_SECTIONS.MATURE, false)
              }
            />
            <Text class="body" size="large">
              <Trans>I confirm that I am at least 18 years old.</Trans>
            </Text>
          </Confirmation>

          <Actions>
            <Button variant="text" onPress={() => history.back()}>
              <Trans>Back</Trans>
            </Button>
            <Button
              variant="filled"
              onPress={() =>
                confirmed() &&
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
    color: "var(--md-sys-color-on-surface)",

    "& svg": {
      // TODO
      fill: "orange",
    },

    gap: "var(--gap-md)",
  },
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
