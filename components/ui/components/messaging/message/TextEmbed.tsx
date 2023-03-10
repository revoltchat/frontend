import { ComponentProps, Match, Show, Switch } from "solid-js";
import { styled } from "solid-styled-components";

import { Markdown } from "@revolt/markdown";

import {
  Column,
  OverflowingText,
  SizedContent,
  Typography,
} from "../../design";

import { Attachment } from "./Attachment";
import type { E, Embed } from "./Embed";
import { SpecialEmbed } from "./SpecialEmbed";

const Base = styled("div", "TextEmbed")<{ borderColour?: string }>`
  display: flex;
  max-width: 480px; /* TODO: theme this */
  flex-direction: row;
  gap: ${(props) => props.theme!.gap.md};

  padding: ${(props) => props.theme!.gap.md};
  color: ${(props) => props.theme!.colours["foreground"]};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) => props.theme!.colours["background-300"]};

  border-inline-start: 4px solid
    ${(props) => props.borderColour ?? props.theme!.colours["background-200"]};
`;

const SiteInformation = styled("div", "SiteInfo")`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.theme!.gap.md};
  color: ${(props) => props.theme!.colours["foreground-100"]};
`;

const Favicon = styled("img", "Favicon")`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
`;

const PreviewImage = styled("img", "PreviewImage")`
  max-width: 120px;
  max-height: 120px;
  border-radius: ${(props) => props.theme!.borderRadius.md};
`;

// TODO: move all font sizes into typography
const Title = styled("div", "Title")`
  font-size: 16px;
`;

const Content = styled(Column)`
  min-width: 0;
`;

const Description = styled("div", "Description")`
  font-size: 12px;
  overflow: hidden;
  word-wrap: break-word;
`;

export function TextEmbed(
  props: ComponentProps<typeof Embed> & {
    embed: { type: "Text" | "Website" };
  }
) {
  return (
    <Base borderColour={props.embed.colour!}>
      <Content gap="md" grow>
        <Show when={props.embed.type === "Website" && props.embed.site_name}>
          <SiteInformation>
            <Show when={props.embed.icon_url}>
              <Favicon
                loading="lazy"
                draggable={false}
                src={props.proxyFile(props.embed.icon_url!)}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </Show>
            <Typography variant="small">
              <OverflowingText>
                {(props.embed as E<"Website">).site_name}
              </OverflowingText>
            </Typography>
          </SiteInformation>
        </Show>

        <Show when={props.embed.title}>
          <Title>
            <a>
              <OverflowingText>{props.embed.title}</OverflowingText>
            </a>
          </Title>
        </Show>

        <Show when={props.embed.description}>
          <Description>
            <Switch fallback={props.embed.description}>
              <Match when={props.embed.type === "Text"}>
                <Markdown content={props.embed.description!} />
              </Match>
            </Switch>
          </Description>
        </Show>

        <Show when={props.embed.type === "Text" && props.embed.media}>
          <Attachment
            baseUrl={props.baseUrl}
            file={(props.embed as E<"Text">).media!}
          />
        </Show>

        <Show when={props.embed.type === "Website"}>
          <Switch>
            <Match
              when={
                (props.embed as E<"Website">).special?.type &&
                (props.embed as E<"Website">).special?.type !== "None"
              }
            >
              <SpecialEmbed embed={props.embed as E<"Website">} />
            </Match>
            <Match when={(props.embed as E<"Website">).video}>
              <SizedContent
                width={(props.embed as E<"Website">).video!.width}
                height={(props.embed as E<"Website">).video!.height}
              >
                <video
                  controls
                  preload="metadata"
                  src={props.proxyFile(
                    (props.embed as E<"Website">).video!.url
                  )}
                />
              </SizedContent>
            </Match>
            <Match when={(props.embed as E<"Website">).image?.size === "Large"}>
              <SizedContent
                width={(props.embed as E<"Website">).image!.width}
                height={(props.embed as E<"Website">).image!.height}
              >
                <img
                  src={props.proxyFile(
                    (props.embed as E<"Website">).image!.url
                  )}
                  loading="lazy"
                />
              </SizedContent>
            </Match>
          </Switch>
        </Show>
      </Content>

      <Show
        when={
          props.embed.type === "Website" &&
          props.embed.image?.size === "Preview" &&
          !props.embed.video
        }
      >
        <PreviewImage
          src={props.proxyFile((props.embed as E<"Website">).image!.url)}
          loading="lazy"
        />
      </Show>
    </Base>
  );
}
