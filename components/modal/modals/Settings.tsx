import { Show } from "solid-js";
import { Portal } from "solid-js/web";

import { Motion, Presence } from "@motionone/solid";

import { Settings } from "@revolt/app";

import { PropGenerator } from "../types";

/**
 * Modal to display server information
 */
const SettingsModal: PropGenerator<"settings"> = () => {
  return {
    _children: (props) => {
      return (
        <Portal mount={document.getElementById("floating")!}>
          <div
            style={{
              position: "fixed",
              width: "100%",
              height: "100vh",
              left: 0,
              top: 0,
              "pointer-events": "none",
            }}
          >
            <Presence>
              <Show when={props?.show}>
                <Motion.div
                  style={{
                    height: "100%",
                    "pointer-events": "all",
                    display: "flex",
                  }}
                  initial={{ opacity: 0, scale: 1.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 0.2, easing: [0.87, 0, 0.13, 1] }}
                >
                  <Settings onClose={props.onClose} />
                </Motion.div>
              </Show>
            </Presence>
          </div>
        </Portal>
      );
    },
  };
};

export default SettingsModal;
