import { BiSolidFile } from "solid-icons/bi";
import { Match, Switch } from "solid-js";
import { Show } from "solid-js";
import { styled } from "styled-system/jsx";

import { type Message, RE_SPOILER } from "revolt.js";

import { useClient } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { TextWithEmoji } from "@revolt/markdown";

import {
  Avatar,
  ColouredText,
  NonBreakingText,
  OverflowingText,
} from "../../design";
import { Typography } from "../../design/atoms/display/Typography";

interface Props {
  /**
   * Message that was replied to
   */
  message?: Message;

  /**
   * Whether it was mentioned
   */
  mention?: boolean;

  /**
   * Whether to hide the left side reply indicator
   */
  noDecorations?: boolean;
}

export const Base = styled("div", {
  base: {
    minWidth: 0,
    flexGrow: 1,
    display: "flex",
    userSelect: "none",
    alignItems: "center",
    gap: "var(--gap-sm)",
    "& a:link": {
      textDecoration: "none",
    },
    "&::before": {
      width: "22px",
      height: "12px",
      flexShrink: 0,
      alignSelf: "flex-end",
      borderStartStartRadius: "4px",
      borderInlineStart:
        "2px solid var(--colours-messaging-component-message-reply-hook)",
      borderTop:
        "2px solid var(--colours-messaging-component-message-reply-hook)",
    },
  },
  variants: {
    noDecorations: {
      true: {},
      false: {
        "&::before": {
          content: '""',
          display: "block",
          marginInlineEnd: "12px",
          marginInlineStart: "30px",
        },
      },
    },
  },
  defaultVariants: {
    noDecorations: false,
  },
});

const Attachments = styled("em", {
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--gap-sm)",
    whiteSpace: "nowrap",
  },
});

/**
 * Link styling
 */
const Link = styled("a", {
  base: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-md)",
  },
});

/**
 * Message being replied to
 */
export function MessageReply(props: Props) {
  const t = useTranslation();
  const client = useClient();

  return (
    <Base noDecorations={props.noDecorations}>
      <Switch fallback={<span>{t("app.main.channel.misc.not_loaded")}</span>}>
        <Match when={props.message?.author?.relationship === "Blocked"}>
          {t("app.main.channel.misc.blocked_user")}
        </Match>
        <Match when={props.message}>
          <Avatar src={props.message!.avatarURL} size={14} />
          <NonBreakingText>
            <ColouredText
              colour={props.message!.roleColour!}
              clip={props.message!.roleColour?.includes("gradient")}
            >
              <Typography variant="username">
                {props.mention && "@"}
                {props.message!.username}
              </Typography>
            </ColouredText>
          </NonBreakingText>
          <Link href={props.message!.path}>
            <Show when={props.message!.attachments}>
              <Attachments>
                <BiSolidFile size={16} />
                {props.message!.attachments!.length > 1
                  ? t("app.main.channel.misc.sent_multiple_files")
                  : t("app.main.channel.misc.sent_file")}
              </Attachments>
            </Show>
            <Show when={props.message!.content}>
              <OverflowingText>
                <TextWithEmoji
                  content={client().markdownToText(props.message!.content!)}
                />
              </OverflowingText>
            </Show>
          </Link>
        </Match>
      </Switch>
    </Base>
  );
}
