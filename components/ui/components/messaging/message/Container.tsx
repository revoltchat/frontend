import { Nullable } from "revolt.js";
import { Component, JSX, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { Avatar } from "../../design/atoms/display/Avatar";
import { Time } from "../../design/atoms/display/Time";
import { Typography } from "../../design/atoms/display/Typography";
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
   * Author's username
   */
  username?: string;

  /**
   * Author's role colour
   */
  colour?: Nullable<string>;

  /**
   * Message content
   */
  children: JSX.Element;

  /**
   * Message header
   */
  header?: JSX.Element;

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
  margin-top: ${(props) => (props.tail ? 0 : "12px")};
  color: ${(props) => props.theme!.colours.foreground};

  .hidden {
    display: none;
  }

  &:hover {
    .hidden {
      display: block;
    }

    backdrop-filter: ${(props) => props.theme!.effects.hover};
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
  min-width: 0;
`;

/**
 * Information text
 */
const InfoText = styled.div`
  color: ${(props) => props.theme!.colours["foreground-400"]};
`;

/**
 * Coloured role text
 */
const ColouredText = styled.span<{ colour?: Nullable<string>; clip?: boolean }>`
  color: ${(props) => props.colour ?? props.theme?.colours["foreground-100"]};
  background: ${(props) => (props.clip ? props.colour! : "none")};
  -webkit-text-fill-color: ${(props) => (props.clip ? "transparent" : "unset")};
  background-clip: ${(props) => (props.clip ? "text" : "unset")};
  -webkit-background-clip: ${(props) => (props.clip ? "text" : "unset")};
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
        <Content gap="none">
          <Show when={!props.tail}>
            <Row align>
              <Typography variant="username">
                <ColouredText
                  colour={props.colour}
                  clip={props.colour?.includes("gradient")}
                >
                  {props.username}
                </ColouredText>
              </Typography>
              <InfoText>
                <Typography variant="small">
                  <Time
                    value={props.timestamp}
                    format="calendar"
                    referenceTime={props._referenceTime}
                  />{" "}
                  <Show when={props.edited}>
                    <span>(edited)</span>
                  </Show>
                </Typography>
              </InfoText>
            </Row>
          </Show>
          {props.children}
        </Content>
      </Row>
    </Base>
  );
}
