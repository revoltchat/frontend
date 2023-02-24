// ! TODO: #5 implement dnd

import { Server } from "revolt.js/dist/maps/Servers";
import { Component, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { Link } from "@revolt/routing";
import { Avatar } from "../../design/atoms/display/Avatar";
import {
  UnreadsGraphic,
  UserStatusGraphic,
} from "../../design/atoms/indicators";
import { InvisibleScrollContainer } from "../../common/ScrollContainers";
import { User } from "revolt.js";
import { Draggable } from "../../common/Draggable";
import { Tooltip } from "../../floating";
import { Button, Column, Typography } from "../../design";
import { BiSolidCheckShield } from "solid-icons/bi";

/**
 * Server list container
 */
const ServerListBase = styled(
  InvisibleScrollContainer as Component,
  "ServerList"
)`
  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme!.colours["background"]};
`;

/**
 * Server entries
 */
const EntryContainer = styled("div", "Entry")`
  width: 52px;
  height: 52px;
  display: grid;
  flex-shrink: 0;
  place-items: center;
`;

interface Props {
  orderedServers: Server[];
  user: User;
}

export const ServerList = (props: Props) => {
  return (
    <ServerListBase>
      <Tooltip
        placement="right"
        content={
          <Column gap="none">
            <span>{props.user.username}</span>
            <Typography variant="small">
              {props.user.status?.presence}
            </Typography>
          </Column>
        }
      >
        {(triggerProps) => (
          <EntryContainer {...triggerProps}>
            <Link href="/">
              <Avatar
                size={42}
                src={
                  props.user.generateAvatarURL({ max_side: 256 }) ??
                  props.user.defaultAvatarURL
                }
                holepunch={"bottom-right"}
                overlay={
                  <UserStatusGraphic
                    status={props.user.status?.presence ?? "Invisible"}
                  />
                }
                interactive
              />
            </Link>
          </EntryContainer>
        )}
      </Tooltip>
      <EntryContainer>
        <Link href="/admin">
          <Button compact="icon">
            <BiSolidCheckShield size={32} />
          </Button>
        </Link>
      </EntryContainer>
      <Draggable
        items={props.orderedServers}
        onChange={(ids) => {
          // Handle here.
        }}
      >
        {(item) => (
          <Tooltip placement="right" content={item.name}>
            {(triggerProps) => (
              <EntryContainer {...triggerProps}>
                <Link href={`/server/${item._id}`}>
                  <Avatar
                    size={42}
                    src={item.generateIconURL({ max_side: 256 })}
                    holepunch={item.isUnread() ? "top-right" : "none"}
                    overlay={
                      <>
                        <Show when={item.isUnread()}>
                          <UnreadsGraphic
                            count={item.getMentions().length}
                            unread
                          />
                        </Show>
                      </>
                    }
                    fallback={item.name}
                    interactive
                  />
                </Link>
              </EntryContainer>
            )}
          </Tooltip>
        )}
      </Draggable>
    </ServerListBase>
  );
};
