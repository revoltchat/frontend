import { For, Show } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";

import { styled } from "styled-system/jsx";

import { Button } from "../inputs";

import { typography } from "./Typography";

export interface Modal2Props {
  show: boolean;
  onClose: () => void;
}

type Props = Modal2Props & {
  icon?: JSX.Element;
  title: JSX.Element;
  children: JSX.Element;
  actions: {
    text: JSX.Element;
    onClick?: () => void;
  }[];
  isDisabled?: boolean;
};

/**
 * Dialog container made according to the M3 specifications
 *
 * https://m3.material.io/components/dialogs/specs
 */
export function Modal2(props: Props) {
  return (
    <Portal mount={document.getElementById("floating")!}>
      <Scrim show={props.show} onClick={props.onClose}>
        <Presence>
          <Show when={props.show}>
            <Motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              // todo: update easing
              transition={{ duration: 0.3, easing: [0.22, 0.54, 0.41, 1.46] }}
            >
              <Container onClick={(e) => e.stopPropagation()}>
                <Show when={props.icon}>
                  <Icon>{props.icon}</Icon>
                </Show>
                <Title withIcon={typeof props.icon !== "undefined"}>
                  {props.title}
                </Title>
                <Content class={typography()}>{props.children}</Content>
                <Actions>
                  <For each={props.actions}>
                    {(action) => (
                      <Button
                        variant="text"
                        size="small"
                        onPress={() => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const value = action.onClick?.() as any;
                          if (value instanceof Promise) {
                            value.then(props.onClose);
                          } else {
                            props.onClose();
                          }
                        }}
                        isDisabled={props.isDisabled}
                      >
                        {action.text}
                      </Button>
                    )}
                  </For>
                </Actions>
              </Container>
            </Motion.div>
          </Show>
        </Presence>
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
    zIndex: "var(--layout-zIndex-modal)",

    maxHeight: "100%",
    overflowY: "auto",

    display: "grid",
    userSelect: "none",
    placeItems: "center",

    pointerEvents: "all",
    background: "rgba(0, 0, 0, 0.6)",

    animationName: "scrimFadeIn",
    animationDuration: "0.1s",
    animationFillMode: "forwards",
    transition: "var(--transitions-medium) all",
  },
  variants: {
    show: {
      false: {
        animationName: "unset",
        pointerEvents: "none",
        background: "transparent",
      },
    },
  },
  defaultVariants: {
    show: true,
  },
});

const Container = styled("div", {
  base: {
    padding: "24px",
    minWidth: "280px",
    maxWidth: "560px",
    borderRadius: "28px",

    display: "flex",
    flexDirection: "column",

    color: "var(--md-sys-color-on-surface)",
    background: "var(--md-sys-color-surface-container-high)",
  },
});

const Icon = styled("div", {
  base: {
    alignSelf: "center",
    marginBottom: "16px",
  },
});

const Title = styled("span", {
  base: {
    ...typography.raw({ class: "headline", size: "small" }),
  },
  variants: {
    withIcon: {
      true: {
        textAlign: "center",
      },
    },
  },
  defaultVariants: {
    withIcon: false,
  },
});

const Content = styled("div", {
  base: {
    marginBlockStart: "16px",
    marginBlockEnd: "24px",

    color: "var(--md-sys-color-on-surface-variant)",
  },
});

const Actions = styled("div", {
  base: {
    gap: "8px",
    display: "flex",
    justifyContent: "end",
  },
});
