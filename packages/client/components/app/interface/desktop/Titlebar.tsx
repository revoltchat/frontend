import { Show, createMemo, createSignal, onCleanup, onMount } from "solid-js";

import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { styled } from "styled-system/jsx";

import { Ripple, symbolSize, typography } from "@revolt/ui";

import MdBuild from "@material-symbols/svg-400/outlined/build.svg?component-solid";
import MdClose from "@material-symbols/svg-400/outlined/close.svg?component-solid";
import MdCollapseContent from "@material-symbols/svg-400/outlined/collapse_content.svg?component-solid";
import MdExpandContent from "@material-symbols/svg-400/outlined/expand_content.svg?component-solid";
import MdMinimize from "@material-symbols/svg-400/outlined/minimize.svg?component-solid";

export function Titlebar() {
  const window = isTauri() ? getCurrentWindow() : null!;
  const [isMaximised, setIsMaximised] = createSignal(false);

  async function onResize() {
    setIsMaximised(await window.isMaximized());
  }

  onMount(async () => {
    setIsMaximised(await window.isMaximized());

    const unlisten = await window?.onResized(onResize);

    if (unlisten) {
      onCleanup(unlisten);
    }
  });

  return (
    <Base>
      <Title>
        My Cool Chat App{" "}
        <Show when={import.meta.env.DEV}>
          <MdBuild {...symbolSize(16)} />
        </Show>
      </Title>
      <DragHandle data-tauri-drag-region />
      <Show when={isTauri()}>
        <Action onClick={() => window.minimize()}>
          <Ripple />
          <MdMinimize {...symbolSize(20)} />
        </Action>
        <Action onClick={() => window.toggleMaximize()}>
          <Ripple />
          <Show
            when={isMaximised()}
            fallback={<MdExpandContent {...symbolSize(20)} />}
          >
            <MdCollapseContent {...symbolSize(20)} />
          </Show>
        </Action>
        <Action onClick={() => window.close()}>
          <Ripple />
          <MdClose {...symbolSize(20)} />
        </Action>
      </Show>
    </Base>
  );
}

const Base = styled("div", {
  base: {
    flexShrink: 0,
    height: "29px",
    userSelect: "none",

    display: "flex",
    alignItems: "center",

    color: "var(--md-sys-color-outline)",
    background: "var(--md-sys-color-surface-container-high)",
  },
});

const Title = styled("div", {
  base: {
    display: "flex",
    gap: "var(--gap-md)",
    alignItems: "center",
    paddingInlineStart: "var(--gap-md)",

    color: "var(--md-sys-color-on-surface)",
    ...typography.raw({ class: "title", size: "small" }),
  },
});

const DragHandle = styled("div", {
  base: {
    flexGrow: 1,
    height: "100%",
  },
});

const Action = styled("a", {
  base: {
    cursor: "pointer",
    position: "relative",

    display: "grid",
    placeItems: "center",

    height: "100%",
    aspectRatio: "3/2",
  },
});
