import { Nullable } from "revolt.js";
import { Component, JSX, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { ColouredText } from "../../design";
import { Avatar } from "../../design/atoms/display/Avatar";
import { Time } from "../../design/atoms/display/Time";
import {
  generateTypographyCSS,
  Typography,
} from "../../design/atoms/display/Typography";
import { Column, Row } from "../../design/layout";

interface CommonProps {
  /**
   * Whether this is the tail of another message
   */
  tail?: boolean;
}

type Props = CommonProps & {
  /**
   * Avatar URL
   */
  avatar?: string;

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
  timestamp: number;

  /**
   * Date message was edited at
   */
  edited?: number;

  /**
   * Reference time to render timestamps from
   */
  _referenceTime?: number;
};

/**
 * Message container layout
 */
const Base = styled(Column as Component, "Message")<CommonProps>`
  padding: 2px 0;
  font-size: 14px;
  color: ${(props) => props.theme!.colours.foreground};
  margin-top: ${(props) => (props.tail ? 0 : "12px")} !important;

  .hidden {
    display: none;
  }

  &:hover {
    .hidden {
      display: block;
    }

    backdrop-filter: ${(props) => props.theme!.effects.hover};
  }

  a:hover {
    text-decoration: underline;
  }
`;

/**
 * Left-side information or avatar
 */
const Info = styled("div", "Info")<Pick<CommonProps, "tail">>`
  width: 62px;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  padding: ${(props) => (props.tail ? 0 : 2)}px 0;
`;

/**
 * Right-side message content
 */
const Content = styled(Column)`
  gap: 3px;
  min-width: 0;
`;

/**
 * Information text
 */
const InfoText = styled(Row)`
  color: ${(props) => props.theme!.colours["foreground-400"]};
  ${(props) => generateTypographyCSS(props.theme!, "small")}
`;

/**
 * Component to show avatar, username, timestamp and content
 */
export function MessageContainer(props: Props) {
  return (
    <Base tail={props.tail}>
      {props.header}
      <Row gap="none">
        <Info tail={props.tail}>
          <Show when={props.tail}>
            <InfoText class={!props.edited ? "hidden" : undefined}>
              <Typography variant="small">
                <Show when={props.edited}>(edited)</Show>
                <Show when={!props.edited}>
                  <Time
                    value={props.timestamp}
                    format="time"
                    referenceTime={props._referenceTime}
                  />
                </Show>
              </Typography>
            </InfoText>
          </Show>
          <Show when={!props.tail}>
            <Avatar size={36} src={props.avatar} />
          </Show>
        </Info>
        <Content>
          <Show when={!props.tail}>
            <Row gap="sm" align>
              {props.username}
              <InfoText gap="sm" align>
                <Show when={props.info}>{props.info}</Show>
                <Time
                  value={props.timestamp}
                  format="calendar"
                  referenceTime={props._referenceTime}
                />
                <Show when={props.edited}>
                  <span>(edited)</span>
                </Show>
              </InfoText>
            </Row>
          </Show>
          {props.children}
        </Content>
      </Row>
    </Base>
  );
}
