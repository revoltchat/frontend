import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion } from "solid-motionone";

import { styled } from "styled-system/jsx";

/**
 * Bottom sheet presentation for context menus on touch devices
 *
 * Unlike a desktop context menu (which is anchored to the pointer), an action
 * sheet slides up from the bottom of the screen and presents full-width rows
 * that are easy to tap.
 *
 * @specification https://m3.material.io/components/bottom-sheets
 */
export function ActionSheet(props: {
  onClose: () => void;
  children: JSX.Element;
}) {
  return (
    <Portal mount={document.getElementById("floating")!}>
      <Scrim onClick={props.onClose}>
        <Motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.25, easing: [0.05, 0.7, 0.1, 1.0] }}
          style={{
            width: "100%",
            display: "flex",
            "justify-content": "center",
          }}
        >
          <Sheet
            class="action_sheet"
            onClick={(e) => e.stopPropagation()}
            // stop the sheet from closing the menu before its rows handle the tap
            onPointerDown={(e) => e.stopImmediatePropagation()}
          >
            <Grabber aria-hidden="true" />
            {props.children}
          </Sheet>
        </Motion.div>
      </Scrim>
    </Portal>
  );
}

const Scrim = styled("div", {
  base: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "fixed",
    zIndex: "999",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",

    // keep the sheet clear of the home indicator and rounded display corners
    paddingInline: "max(var(--inset-left), 0px) max(var(--inset-right), 0px)",
    paddingBottom: "max(var(--inset-bottom), 0px)",

    background: "rgba(0, 0, 0, 0.4)",
    animationName: "scrimFadeIn",
    animationDuration: "0.1s",
    animationFillMode: "forwards",
  },
});

const Sheet = styled("div", {
  base: {
    width: "100%",
    maxWidth: "560px",
    maxHeight: "80vh",
    overflowY: "auto",
    overscrollBehavior: "contain",

    display: "flex",
    flexDirection: "column",
    padding: "var(--gap-sm) 0 var(--gap-lg) 0",

    borderRadius: "var(--borderRadius-lg) var(--borderRadius-lg) 0 0",
    background: "var(--md-sys-color-surface-container-high)",
    color: "var(--md-sys-color-on-surface)",
    fill: "var(--md-sys-color-on-surface)",
    boxShadow: "0 -2px 8px var(--md-sys-color-shadow)",

    userSelect: "none",

    // The context menu renders its own surface; flatten it into the sheet
    "& > div": {
      padding: 0,
      borderRadius: 0,
      background: "transparent",
      boxShadow: "none",
      overflow: "visible",
    },

    // Give every row in the sheet a comfortable touch target
    "& a": {
      padding: "var(--gap-lg) var(--gap-xl)",
    },
    "& a span:not([aria-hidden='true'])": {
      flexGrow: 1,
    },
  },
});

const Grabber = styled("div", {
  base: {
    width: "32px",
    height: "4px",
    flexShrink: 0,
    alignSelf: "center",
    marginBottom: "var(--gap-md)",
    borderRadius: "var(--borderRadius-full)",
    background: "var(--md-sys-color-outline-variant)",
  },
});
