import { JSX, Match, Show, Switch } from "solid-js";

import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Ripple, typography } from "@revolt/ui/components/design";
import { Column, Row } from "@revolt/ui/components/layout";
import {
  NonBreakingText,
  OverflowingText,
  Time,
} from "@revolt/ui/components/utils";

interface CommonProps {
  /**
   * Whether this is the tail of another message
   */
  tail?: boolean;

  /**
   * Whether to move the username and related to the left
   *
   * If you want to hide it completely, add a <Match when={true} /> to infoMatch
   */
  compact?: boolean;

  /**
   * Whether this message should be treated as a link
   */
  isLink?: boolean;
}

type Props = CommonProps & {
  /**
   * Avatar URL
   */
  avatar: JSX.Element;

  /**
   * Username element
   */
  username: JSX.Element;

  /**
   * Message content
   */
  children: JSX.Element;

  /**
   * Message header
   */
  header?: JSX.Element;

  /**
   * Message info line
   */
  info?: JSX.Element;

  /**
   * Timestamp message was sent at
   */
  timestamp: Date | JSX.Element;

  /**
   * Date message was edited at
   */
  edited?: Date;

  /**
   * Whether this message mentions the user
   */
  mentioned?: boolean;

  /**
   * Whether this message should be highlighted
   */
  highlight?: boolean;

  /**
   * Whether this message is being edited
   */
  editing?: boolean;

  /**
   * Send status of this message
   */
  sendStatus?: "sending" | "failed";

  /**
   * Component to render message context menu
   */
  contextMenu?: () => JSX.Element;

  /**
   * Additional match cases for the inline-start information element
   */
  infoMatch?: JSX.Element;

  /**
   * Reference time to render timestamps from
   */
  _referenceTime?: number;
};

/**
 * Message container layout
 */
const base = cva({
  base: {
    display: "flex",
    gap: "var(--gap-md)",
    flexDirection: "column",

    padding: "2px 0",
    background: "transparent",
    marginTop: "12px !important",
    borderRadius: "var(--borderRadius-md)",
    minHeight: "1em",

    transition: "background-color var(--transitions-fast)",

    "& a:hover": {
      textDecoration: "underline",
    },

    ...typography.raw({ class: "_messages" }),
  },
  variants: {
    tail: {
      true: {
        marginTop: 0,
      },
    },
    mentioned: {
      true: {
        background: "var(--md-sys-color-primary-container)",
      },
    },
    highlight: {
      true: {
        animation: "highlightMessage 3s",
      },
    },
    sendStatus: {
      failed: {
        color: "var(--customColours-error-color)",
      },
      sending: {},
    },
    isLink: {
      true: {
        cursor: "pointer",
        userSelect: "none",
        position: "relative",

        "& *": {
          pointerEvents: "none",
        },
      },
      false: {
        "&:hover": {
          background: "var(--md-sys-color-surface-container)",
        },
      },
    },
  },
  defaultVariants: {
    isLink: false,
  },
});

/**
 * Left-side information or avatar
 */
const Info = styled("div", {
  base: {
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    padding: "2px var(--gap-sm)",
  },
  variants: {
    tail: {
      true: {
        padding: 0,
      },
    },
    compact: {
      true: {},
      false: {
        width: "62px",
      },
    },
  },
});

/**
 * Right-side message content
 */
const Content = styled(Column, {
  base: {
    gap: "3px",
    minWidth: 0,
    overflow: "hidden",
    maxHeight: "200vh",
    paddingInlineEnd: "var(--gap-lg)",
  },
  variants: {
    editing: {
      true: {
        flexGrow: 1,
      },
    },
  },
});

/**
 * Information text
 */
const InfoText = styled(Row, {
  base: {
    color: "var(--colours-messaging-message-info-text)",

    ...typography.raw({ class: "body", size: "small" }),
  },
  variants: {
    prefix: {
      true: {
        width: "calc(36px + 2 * var(--gap-sm))",
        fontSize: "0.7em",

        display: "block",
        textAlign: "right",
        marginTop: "0.15em",
      },
    },
    hidden: {
      true: {
        opacity: 0,
        transition: "var(--transitions-fast) opacity",

        _groupHover: {
          opacity: 1,
        },
      },
    },
  },
});

/**
 * Additional styles for compact mode
 */
const CompactInfo = styled(Row, {
  base: {
    flexShrink: 0,
    marginTop: "-2px",
    height: "fit-content",
    paddingInline: "var(--gap-lg) 0",
  },
});

/**
 * Component to show avatar, username, timestamp and content
 */
export function MessageContainer(props: Props) {
  return (
    <div
      class={
        "group " +
        base({
          tail: props.tail,
          mentioned: props.mentioned,
          highlight: props.highlight,
          sendStatus: props.sendStatus,
          isLink: props.isLink,
        })
      }
      use:floating={{ contextMenu: props.contextMenu }}
    >
      <Show when={props.isLink}>
        <Ripple />
      </Show>

      {props.header}
      <Row>
        <Info tail={props.tail} compact={props.compact}>
          <Switch fallback={props.avatar}>
            {props.infoMatch ?? <Match when={false} children={null} />}
            <Match when={props.compact}>
              <CompactInfo gap="sm" align>
                <InfoText gap="sm">
                  <Time
                    format="time"
                    value={props.timestamp}
                    referenceTime={props._referenceTime}
                  />
                </InfoText>
                {props.username}
                {props.info}
              </CompactInfo>
            </Match>
            <Match when={props.tail}>
              <InfoText hidden={!props.edited} prefix>
                <Show when={props.edited}>(edited)</Show>
                <Show when={!props.edited}>
                  <Time
                    value={props.timestamp}
                    format="time"
                    referenceTime={props._referenceTime}
                  />
                </Show>
              </InfoText>
            </Match>
          </Switch>
        </Info>
        <Content editing={props.editing}>
          <Show when={!props.tail && !props.compact}>
            <Row gap="sm" align>
              <OverflowingText>{props.username}</OverflowingText>
              <NonBreakingText>
                <InfoText gap="sm" align>
                  {props.info}
                  <Switch fallback={props.timestamp as string}>
                    <Match when={props.timestamp instanceof Date}>
                      <Time
                        format="calendar"
                        value={props.timestamp}
                        referenceTime={props._referenceTime}
                      />
                    </Match>
                  </Switch>
                  <Show when={props.edited}>
                    <span>(edited)</span>
                  </Show>
                </InfoText>
              </NonBreakingText>
            </Row>
          </Show>
          {props.children}
        </Content>
      </Row>
    </div>
  );
}
