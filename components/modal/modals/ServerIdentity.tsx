import { BiRegularX, BiSolidEditAlt, BiSolidSave } from "solid-icons/bi";
import { Show, createSignal } from "solid-js";

import { ServerMember } from "revolt.js";

import { clientController } from "@revolt/client";
import { useTranslation } from "@revolt/i18n";
import { userInformation } from "@revolt/markdown/users";
import {
  Avatar,
  Button,
  CategoryButton,
  Column,
  Input,
  NonBreakingText,
  OverflowingText,
  Preloader,
  Row,
  Typography,
  Username,
  styled,
  useTheme,
} from "@revolt/ui";
import { generateTypographyCSS } from "@revolt/ui/components/design/atoms/display/Typography";

import { PropGenerator } from "../types";

const [avatarId, setAvatarId] = createSignal(null);
const [uploading, setUploading] = createSignal<boolean>();

async function uploadToAutumn(file) {
  setUploading(true);
  try {
    const url = "https://autumn.revolt.chat/avatars";
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-session-token": `${clientController.getCurrentClient()?.sessionId}`,
      },
      body: formData,
    });

    const json = await response.json();
    setAvatarId(json["id"]);
    setUploading(false);

    return json;
  } catch (error) {
    console.error("POST request error:", error);
    setUploading(false);
  }
}

/**
 * Modal to display server identity
 */

const ServerIdentity: PropGenerator<"server_identity"> = (props) => {
  const t = useTranslation();
  const [nickname, setNickname] = createSignal<string>();

  setUploading(false);

  let fileInputRef: HTMLInputElement | null = null;
  const openFilePicker = () => {
    fileInputRef?.click();
  };

  const handleFileSelect = async (event: Event) => {
    const file = event.target?.files[0];
    const json = await uploadToAutumn(file);

    if (json !== undefined) {
      props.member.edit({ avatar: avatarId() });
    }
  };

  return {
    title: (
      <Column grow>
        <Typography variant="legacy-settings-title">
          {t("app.special.popovers.server_identity.title", {
            server: props.member.server?.name as string,
          })}
        </Typography>
      </Column>
    ),
    children: (
      <>
        <Column style={{ padding: "0.75em 0em" }}>
          <Typography variant="label">
            {t("app.special.popovers.server_identity.nickname")}
          </Typography>

          <Row align="center">
            <Input
              type="text"
              value={props.member.nickname ?? ""}
              placeholder={props.member.user?.displayName}
              onInput={(event) => setNickname(event.currentTarget.value)}
            />

            <Button
              compact="icon"
              palette="plain"
              disabled={nickname() === props.member.nickname || !nickname()}
              onClick={() => {
                props.member.edit({ nickname: nickname() });
              }}
            >
              <BiSolidSave size={24} />
            </Button>

            <Button
              compact="icon"
              palette="plain"
              disabled={!props.member.nickname}
              onClick={() => {
                props.member.edit({ remove: ["Nickname"] });
                setNickname("");
              }}
            >
              <BiRegularX size={24} />
            </Button>
          </Row>
        </Column>

        <Row>
          <Column>
            <Typography variant="label">
              {t("app.special.popovers.server_identity.avatar")}
            </Typography>

            <Column align="center">
              <AvatarEdit member={props.member}></AvatarEdit>

              <Show
                when={props.member.avatarURL === props.member.user?.avatarURL}
              >
                <div onclick={openFilePicker} style={{ cursor: "pointer" }}>
                  <CategoryButton onClick={() => {}}>
                    {t("app.settings.actions.upload")}
                    <input
                      ref={fileInputRef!}
                      onChange={handleFileSelect}
                      type="file"
                      accept="image/*"
                      multiple={false}
                      style={{ display: "none" }}
                      max={4_000_000}
                    />
                  </CategoryButton>
                </div>
              </Show>

              <Show
                when={props.member.avatarURL != props.member.user?.avatarURL}
              >
                <CategoryButton
                  onClick={() => {
                    props.member.edit({ remove: ["Avatar"] });
                  }}
                >
                  <label>{t("app.settings.actions.remove")}</label>
                </CategoryButton>
              </Show>

              <Typography variant="small">
                {t("app.settings.actions.max_filesize", {
                  filesize: "4.00 MB",
                })}
              </Typography>
            </Column>
          </Column>

          <Column grow style={{ "padding-left": "0.75em" }}>
            <Typography variant="label">
              {t("app.special.modals.actions.preview")}
            </Typography>

            <Preview member={props.member}></Preview>
          </Column>
        </Row>
      </>
    ),
  };
};

export default ServerIdentity;

function AvatarEdit(props: { member: ServerMember }) {
  const [isHovered, setIsHovered] = createSignal(false);

  function onMouseEnter() {
    setIsHovered(true);
  }

  function onMouseLeave() {
    setIsHovered(false);
  }

  const user = () => userInformation(props.member.user, props.member);

  let fileInputRef: HTMLInputElement | null = null;
  const openFilePicker = () => {
    fileInputRef?.click();
  };

  const handleFileSelect = async (event: Event) => {
    const file = event.target?.files[0];
    const json = await uploadToAutumn(file);

    if (json !== undefined) {
      props.member.edit({ avatar: avatarId() });
    }
  };
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onclick={openFilePicker}
      style={{
        cursor: "pointer",
        position: "relative",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        ...(props.member.avatarURL === props.member.user?.avatarURL && {
          filter: "grayscale(100%)",
        }),
        ...(isHovered() &&
          props.member.avatarURL === props.member.user?.avatarURL && {
            filter: "grayscale(100%) contrast(70%)",
          }),
        ...(isHovered() &&
          props.member.avatarURL !== props.member.user?.avatarURL && {
            filter: "contrast(70%)",
          }),
      }}
    >
      <div
        style={{
          position: "absolute",
          display: isHovered() || uploading() ? "block" : "none",
        }}
      >
        <span>
          <Show when={uploading()}>
            <Preloader type="ring"></Preloader>
          </Show>

          <Show when={!uploading()}>
            {" "}
            <BiSolidEditAlt size={42} alignment-baseline="central" />
          </Show>
        </span>
      </div>

      <Avatar src={user().avatar} size={86}></Avatar>

      <input
        ref={fileInputRef!}
        onChange={handleFileSelect}
        type="file"
        accept="image/*"
        multiple={false}
        max={4_000_000}
        style={{ display: "none" }}
      />
    </div>
  );
}

function Preview(props: { member: ServerMember }) {
  const theme = useTheme();

  /**
   * Right-side message content
   */
  const Content = styled(Column)`
    gap: 3px;
    min-width: 0;
    overflow: hidden;
    max-height: 200vh;
    padding-inline-end: ${(props) => props.theme!.gap.lg};
  `;

  /**
   * Information text
   */
  const InfoText = styled(Row)`
    color: ${(props) => props.theme!.colours["foreground-400"]};
    ${(props) => generateTypographyCSS(props.theme!, "small")}
  `;

  const user = () => userInformation(props.member.user, props.member);

  return (
    <Column
      align="center"
      justify="center"
      grow
      style={{
        background: theme.colours.background,
        "border-radius": theme.borderRadius.lg,
        padding: "2px, 0",
        "margin-top": "12px",
      }}
    >
      <Row style={{ "padding-left": "16px" }}>
        <Avatar src={user().avatar} size={32} interactive></Avatar>

        <Content align="start">
          <Row
            gap="sm"
            align
            style={{
              "max-width": "250px",
              overflow: "hidden",
              "white-space": "nowrap",
              "text-overflow": "ellipsis",
            }}
          >
            <OverflowingText>
              <Username
                username={
                  props.member.nickname ?? props.member.user?.displayName
                }
              ></Username>
            </OverflowingText>
            <NonBreakingText>
              <InfoText gap="sm" align>
                <Typography variant="small">Today at 19:00</Typography>
              </InfoText>
            </NonBreakingText>
          </Row>
          content
        </Content>
      </Row>
    </Column>
  );
}
