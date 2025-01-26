import { JSX, Match, Show, Switch } from "solid-js";
import { styled } from "styled-system/jsx";

import { Time } from "../../design/atoms/display/Time";
import { typography } from "../../design/atoms/display/Typography";
import {
  Column,
  NonBreakingText,
  OverflowingText,
  Row,
} from "../../design/layout";
import { Ripple } from "../../material";
import { cva } from "styled-system/css";

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
  timestamp: Date | string;

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
    flexDirection: "column",

    padding: "2px 0",
    color: "var(--colours-foreground)",
    background: "transparent",
    marginTop: "12px !important",
    borderRadius: "var(--borderRadius-md)",
    minHeight: "1em",

    "& .hidden": {
      display: "none",
    },

    "&:hover .hidden": {
      display: "block",
    },

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
        background: "var(--colours-messaging-message-mentioned-background)",
      },
    },
    highlight: {
      true: {
        outline: "2px solid red",
      },
    },
    sendStatus: {
      failed: {
        color: "var(--customColours-error-color)",
      },
      sending: {},
    },
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
    padding: "2px 0",
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
});

/**
 * Information text
 */
const InfoText = styled(Row, {
  base: {
    color: "var(--colours-messaging-message-info-text)",

    ...typography.raw({ class: "label", size: "small" }),
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
      class={base({
        tail: props.tail,
        mentioned: props.mentioned,
        highlight: props.highlight,
        sendStatus: props.sendStatus,
      })}
      use:floating={{ contextMenu: props.contextMenu }}
    >
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
              <InfoText class={!props.edited ? "hidden" : undefined}>
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
        <Content>
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
