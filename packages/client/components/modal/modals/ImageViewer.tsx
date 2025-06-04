import { Match, Show, Switch } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";

import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Button, Column, Modal2Props, ModalScrim, Text } from "@revolt/ui";

import MdClose from "@material-design-icons/svg/outlined/close.svg?component-solid";
import MdDownload from "@material-design-icons/svg/outlined/download.svg?component-solid";

import { Modals } from "../types";

export function ImageViewerModal(
  props: Modal2Props & Modals & { type: "image_viewer" },
) {
  return (
    <Portal mount={document.getElementById("floating")!}>
      <ModalScrim
        padding={false}
        overflow={false}
        show={props.show}
        onClick={props.onClose}
      >
        <Presence>
          <Show when={props?.show}>
            <Motion.div
              class={css({
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",

                minHeight: 0,
                width: "100%",
                height: "100%",

                paddingInline: "20px",
              })}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{
                duration: 0.3,
                easing: [0.17, 0.67, 0.58, 0.98],
              }}
            >
              <Bar align="end">
                <Card onClick={(e) => e.stopPropagation()}>
                  <Show when={props.file && false}>
                    <Button size="icon">
                      <MdDownload />
                    </Button>
                  </Show>
                  <Button size="icon" onPress={props.onClose}>
                    <MdClose />
                  </Button>
                </Card>
              </Bar>
              <Switch>
                <Match when={props.file}>
                  <Image
                    style={{
                      "aspect-ratio": `${(props.file!.metadata as { width: number }).width}/${(props.file!.metadata as { height: number }).height}`,
                    }}
                    src={props.file!.url}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Match>
                <Match when={props.embed}>
                  <Image
                    style={{
                      "aspect-ratio": `${props.embed!.width}/${props.embed!.height}`,
                    }}
                    src={props.embed!.proxiedURL}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Match>
              </Switch>
              <Bar>
                <Switch>
                  <Match when={props.file}>
                    <Card onClick={(e) => e.stopPropagation()}>
                      <Column>
                        <Text class="title">{props.file!.filename}</Text>
                        <Text class="label">
                          {props.file!.humanReadableSize}
                        </Text>
                      </Column>
                    </Card>
                  </Match>
                </Switch>
              </Bar>
            </Motion.div>
          </Show>
        </Presence>
      </ModalScrim>
    </Portal>
  );
}

const Image = styled("img", {
  base: {
    minHeight: 0,
    alignSelf: "center",
    objectFit: "contain",
  },
});

const Bar = styled("div", {
  base: {
    height: "120px",
    flexShrink: 0,

    display: "flex",
    alignItems: "center",
  },
  variants: {
    align: {
      end: {
        justifyContent: "end",
      },
    },
  },
});

const Card = styled("div", {
  base: {
    display: "flex",
    gap: "var(--gap-md)",
    padding: "var(--gap-md)",
    borderRadius: "var(--borderRadius-lg)",
    background: "var(--md-sys-color-surface)",
  },
});
