import { BiRegularChevronLeft, BiRegularChevronRight } from "solid-icons/bi";
import { JSX, Match, Switch } from "solid-js";

import { styled } from "styled-system/jsx";

import { useState } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";

/**
 * Wrapper for header icons which adds the chevron on the
 * correct side for toggling sidebar (if on desktop) and
 * the hamburger icon to open sidebar (if on mobile).
 */
export function HeaderIcon(props: { children: JSX.Element }) {
  const state = useState();

  return (
    <Container
      onClick={() =>
        state.layout.toggleSectionState(LAYOUT_SECTIONS.PRIMARY_SIDEBAR, true)
      }
    >
      <Switch fallback={<BiRegularChevronRight size={20} />}>
        <Match
          when={state.layout.getSectionState(
            LAYOUT_SECTIONS.PRIMARY_SIDEBAR,
            true,
          )}
        >
          <BiRegularChevronLeft size={20} />
        </Match>
      </Switch>
      {props.children}
    </Container>
  );
}

const Container = styled("div", {
  base: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
  },
});
