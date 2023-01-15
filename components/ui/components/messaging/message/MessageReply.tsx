import { Message } from "revolt.js";
import { Match, Switch } from "solid-js";
import { useTranslation } from "@revolt/i18n";
import { styled } from "solid-styled-components";
import { Avatar, ColouredText, OverflowingText } from "../../design";
import { Show } from "solid-js";
import { BiSolidFile } from "solid-icons/bi";
import { TextWithEmoji } from "@revolt/markdown";
import { generateTypographyCSS } from "../../design/atoms/display/Typography";

interface Props {
  message?: Message;
  mention?: boolean;
}

export const Base = styled("div", "Reply")`
  min-width: 0;
  display: flex;
  user-select: none;
  align-items: center;

  margin-inline-end: 12px;
  margin-inline-start: 30px;

  ${(props) => generateTypographyCSS(props.theme!, "reply")}

  gap: ${(props) => props.theme!.gap.md};

  &::before {
    content: "";
    width: 22px;
    height: 8px;

    flex-shrink: 0;
    align-self: flex-end;

    border-inline-start: 2px solid
      ${(props) => props.theme!.colours["background-300"]};
    border-top: 2px solid ${(props) => props.theme!.colours["background-300"]};
  }
`;

const Attachments = styled.em`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme!.gap.sm};
  color: ${(props) => props.theme!.colours["foreground-200"]};
`;

export function MessageReply(props: Props) {
  const t = useTranslation();

  return (
    <Base>
      <Switch fallback={t("app.main.channel.misc.failed_load")}>
        <Match when={props.message?.author?.relationship === "Blocked"}>
          {t("app.main.channel.misc.blocked_user")}
        </Match>
        <Match when={props.message}>
          <Avatar src={props.message!.avatarURL} size={14} />
          <ColouredText
            colour={props.message!.roleColour!}
            clip={props.message!.roleColour?.includes("gradient")}
          >
            {props.message!.username}
          </ColouredText>
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
              <TextWithEmoji content={props.message!.content!} />
            </OverflowingText>
          </Show>
        </Match>
      </Switch>
    </Base>
  );
}
