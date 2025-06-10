import { BiRegularAt, BiSolidXCircle } from "solid-icons/bi";
import { Match, Show, Switch } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import type { Message } from "revolt.js";
import { styled } from "styled-system/jsx";

import { Row } from "@revolt/ui/components/layout";

import { MessageReply } from "../elements";

interface Props {
  /**
   * Message to display
   */
  message?: Message;

  /**
   * Whether we are mentioning this message
   */
  mention: boolean;

  /**
   * Whether this is our own message and we should hide mention option
   */
  self: boolean;

  /**
   * Toggle the mention
   */
  toggle: () => void;

  /**
   * Dismiss the mention
   */
  dismiss: () => void;
}

/**
 * Left side "replying to" text
 */
const ReplyTo = styled("span", {
  base: {
    flexShrink: 0,
  },
});

/**
 * Mention toggle
 */
const MentionToggle = styled("a", {
  base: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    flexDirection: "row",
    textTransform: "uppercase",
    gap: "var(--gap-sm)",
  },
  variants: {
    mention: {
      true: {
        color: "var(--colours-messaging-indicator-reply-enabled)",
      },
      false: {
        color: "var(--colours-messaging-indicator-reply-disabled)",
      },
    },
  },
});

/**
 * Dismiss reply button
 */
const Dismiss = styled("a", {
  base: {
    display: "grid",
    placeItems: "center",
  },
});

/**
 * Preview container
 */
const Base = styled(Row, {
  base: {
    fontSize: "0.8em",
    userSelect: "none",

    padding: "var(--gap-md) var(--gap-lg)",
    borderRadius: "var(--borderRadius-lg)",

    color: "var(--colours-messaging-indicator-foreground)",
    background: "var(--colours-messaging-indicator-background)",

    "& a:hover": {
      filter: "brightness(1.2)",
    },
  },
});

/**
 * Preview of message reply
 */
export function MessageReplyPreview(props: Props) {
  return (
    <Base gap="md" align>
      <ReplyTo>
        <Trans>Replying to</Trans>
      </ReplyTo>
      <MessageReply message={props.message} noDecorations />
      <Row gap="lg" align>
        <Show when={!props.self}>
          <MentionToggle mention={props.mention} onClick={props.toggle}>
            <BiRegularAt size={16} />
            <Switch fallback={<Trans>Off</Trans>}>
              <Match when={props.mention}>
                <Trans>On</Trans>
              </Match>
            </Switch>
          </MentionToggle>
        </Show>
        <Dismiss onClick={props.dismiss}>
          <BiSolidXCircle size={16} />
        </Dismiss>
      </Row>
    </Base>
  );
}
