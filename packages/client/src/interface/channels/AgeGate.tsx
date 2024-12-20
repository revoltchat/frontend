import { JSXElement, Match, Switch, createEffect } from "solid-js";

import { styled } from "styled-system/jsx";

import { useTranslation } from "@revolt/i18n";
import { state } from "@revolt/state";
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
  const t = useTranslation();
  const confirmed = state.layout.getSectionState(LAYOUT_SECTIONS.MATURE, false);
  const allowed = state.layout.getSectionState(
    props.contentId + "-nsfw",
    false
  );

  return (
    <Switch fallback={props.children}>
      <Match when={props.enabled && (!confirmed || !allowed)}>
        <Base>
          <MdWarning {...iconSize("8em")} />
          <Title>{props.contentName}</Title>
          <SubText>
            {t(`app.main.channel.nsfw.${props.contentType}.marked`)}
          </SubText>

          <Confirmation>
            <Checkbox
              value={state.layout.getSectionState(
                LAYOUT_SECTIONS.MATURE,
                false
              )}
              onChange={() =>
                state.layout.toggleSectionState(LAYOUT_SECTIONS.MATURE, false)
              }
            />

            {t("app.main.channel.nsfw.confirm")}
          </Confirmation>

          <Actions>
            <Button variant="secondary" onPress={() => history.back()}>
              {t("app.special.modals.actions.back")}
            </Button>
            <Button
              variant="primary"
              onPress={() =>
                state.layout.getSectionState(LAYOUT_SECTIONS.MATURE) &&
                state.layout.setSectionState(props.contentId + "-nsfw", true)
              }
            >
              {t(`app.main.channel.nsfw.${props.contentType}.confirm`)}
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
