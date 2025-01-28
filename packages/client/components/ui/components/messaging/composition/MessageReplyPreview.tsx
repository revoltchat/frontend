import { BiRegularAt, BiSolidXCircle } from "solid-icons/bi";
import { Show } from "solid-js";
import { styled } from "styled-system/jsx";

import type { Message } from "revolt.js";

import { useTranslation } from "@revolt/i18n";

import { Row, typography } from "../../design";
import { MessageReply } from "../message/MessageReply";

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
  const t = useTranslation();

  return (
    <Base gap="md" align>
      <ReplyTo>{t("app.main.channel.reply.replying")}</ReplyTo>
      <MessageReply message={props.message} noDecorations />
      <Row gap="lg" align>
        <Show when={!props.self}>
          <MentionToggle mention={props.mention} onClick={props.toggle}>
            <BiRegularAt size={16} />
            {props.mention ? t("general.on") : t("general.off")}
          </MentionToggle>
        </Show>
        <Dismiss onClick={props.dismiss}>
          <BiSolidXCircle size={16} />
        </Dismiss>
      </Row>
    </Base>
  );
}
