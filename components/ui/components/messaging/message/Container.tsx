import { Nullable } from "revolt.js";
import { JSX, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { Avatar } from "../../design/atoms/display/Avatar";
import { Time } from "../../design/atoms/display/Time";
import { Typography } from "../../design/atoms/display/Typography";
import { Column, Row } from "../../design/layout";

interface Props {
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
  edited?: Nullable<Date>;

  /**
   * Whether this is the tail of another message
   */
  tail?: boolean;
}

/**
 * Message container layout
 */
const Base = styled(Column)<{ tail?: boolean }>`
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
const Info = styled.div<{ tail?: boolean }>`
  width: 62px;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  padding: ${(props) => (props.tail ? 0 : 2)}px 0;
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
export function MessageContainer({
  avatar,
  username,
  colour,
  edited,
  header,
  children,
  timestamp,
  tail,
}: Props) {
  return (
    <Base tail={tail}>
      {header}
      <Row gap="none">
        <Info tail={tail}>
          {tail ? (
            <InfoText class={!edited ? "hidden" : undefined}>
              <Typography variant="small">
                <Time value={timestamp} format="time" />
              </Typography>
            </InfoText>
          ) : (
            <Avatar size={36} src={avatar} />
          )}
        </Info>
        <Column gap="none">
          <Show when={!tail}>
            <Row align>
              <Typography variant="username">
                <ColouredText
                  colour={colour}
                  clip={colour?.includes("gradient")}
                >
                  {username}
                </ColouredText>
              </Typography>
              <InfoText>
                <Typography variant="small">
                  <Time value={timestamp} format="calendar" />{" "}
                  <Show when={edited}>
                    <span>(edited)</span>
                  </Show>
                </Typography>
              </InfoText>
            </Row>
          </Show>
          {children}
        </Column>
      </Row>
    </Base>
  );
}
