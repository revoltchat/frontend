import { BiRegularChevronLeft, BiRegularChevronRight } from "solid-icons/bi";
import { JSX, Match, Switch } from "solid-js";

import { useLingui } from "@lingui-solid/solid/macro";
import { css } from "styled-system/css";

import { useState } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";

/**
 * Wrapper for header icons which adds the chevron on the
 * correct side for toggling sidebar (if on desktop) and
 * the hamburger icon to open sidebar (if on mobile).
 */
export function HeaderIcon(props: { children: JSX.Element }) {
  const state = useState();
  const { t } = useLingui();

  return (
    <div
      class={container}
      onClick={() =>
        state.layout.toggleSectionState(LAYOUT_SECTIONS.PRIMARY_SIDEBAR, true)
      }
      use:floating={{
        tooltip: {
          placement: "bottom",
          content: t`Toggle main sidebar`,
        },
      }}
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
    </div>
  );
}

const container = css({
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
});
