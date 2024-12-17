import { Match, Show, Switch } from "solid-js";
import { styled as styledLegacy } from "solid-styled-components";

import { TextEmbed as TextEmbedClass, WebsiteEmbed } from "revolt.js";
import { styled } from "styled-system/jsx";

import { Markdown } from "@revolt/markdown";

import {
  Column,
  OverflowingText,
  SizedContent,
  Typography,
} from "../../design";

import { Attachment } from "./Attachment";
import { SpecialEmbed } from "./SpecialEmbed";

const Base = styledLegacy("div", "TextEmbed")<{ borderColour?: string }>`
  display: flex;
  max-width: 480px; /* TODO: theme this */
  flex-direction: row;
  gap: ${(props) => props.theme!.gap.md};

  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};

  color: ${(props) =>
    props.theme!.colours["messaging-component-text-embed-foreground"]};
  background: ${(props) =>
    props.theme!.colours["messaging-component-text-embed-background"]};

  border-inline-start: var(--gap-sm) solid
    ${(props) =>
      props.borderColour ??
      props.theme!.colours["messaging-component-text-embed-foreground"]};
`;

const SiteInformation = styledLegacy("div", "SiteInfo")`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.theme!.gap.md};
`;

const Favicon = styledLegacy("img", "Favicon")`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
`;

const PreviewImage = styledLegacy("img", "PreviewImage")`
  max-width: 120px;
  max-height: 120px;
  border-radius: ${(props) => props.theme!.borderRadius.md};
`;

const Title = styled("a", {
  base: {
    fontSize: "16px",
    color: "var(--colours-link) !important",
  },
});

const Content = styledLegacy(Column)`
  min-width: 0;
`;

const Description = styledLegacy("div", "Description")`
  font-size: 12px;
  overflow: hidden;
  word-wrap: break-word;
`;

/**
 * Text Embed
 */
export function TextEmbed(props: { embed: TextEmbedClass | WebsiteEmbed }) {
  return (
    <Base borderColour={props.embed.colour!}>
      <Content gap="md" grow>
        <Show
          when={
            props.embed.type === "Website" &&
            (props.embed as WebsiteEmbed).siteName
          }
        >
          <SiteInformation>
            <Show when={props.embed.iconUrl}>
              <Favicon
                loading="lazy"
                draggable={false}
                src={props.embed.proxiedIconURL}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </Show>
            <OverflowingText>
              <Typography variant="small">
                {(props.embed as WebsiteEmbed).siteName}
              </Typography>
            </OverflowingText>
          </SiteInformation>
        </Show>

        <Show when={props.embed.title}>
          <Title href={props.embed.url}>
            <OverflowingText>{props.embed.title}</OverflowingText>
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

        <Show
          when={
            props.embed.type === "Text" && (props.embed as TextEmbedClass).media
          }
        >
          <Attachment file={(props.embed as TextEmbedClass).media!} />
        </Show>

        <Show when={props.embed.type === "Website"}>
          <Switch>
            <Match
              when={
                (props.embed as WebsiteEmbed).specialContent?.type &&
                (props.embed as WebsiteEmbed).specialContent?.type !== "None"
              }
            >
              <SpecialEmbed embed={props.embed as WebsiteEmbed} />
            </Match>
            <Match when={(props.embed as WebsiteEmbed).video}>
              <SizedContent
                width={(props.embed as WebsiteEmbed).video!.width}
                height={(props.embed as WebsiteEmbed).video!.height}
              >
                <video
                  controls
                  preload="metadata"
                  src={(props.embed as WebsiteEmbed).video!.proxiedURL}
                />
              </SizedContent>
            </Match>
            <Match when={(props.embed as WebsiteEmbed).image?.size === "Large"}>
              <SizedContent
                width={(props.embed as WebsiteEmbed).image!.width}
                height={(props.embed as WebsiteEmbed).image!.height}
              >
                <img
                  src={(props.embed as WebsiteEmbed).image!.proxiedURL}
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
          (props.embed as WebsiteEmbed).image?.size === "Preview" &&
          !(props.embed as WebsiteEmbed).video
        }
      >
        <PreviewImage
          src={(props.embed as WebsiteEmbed).image!.proxiedURL}
          loading="lazy"
        />
      </Show>
    </Base>
  );
}
