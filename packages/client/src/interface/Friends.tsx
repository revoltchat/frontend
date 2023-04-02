import { BiSolidUserDetail } from "solid-icons/bi";

import { useClient } from "@revolt/client";
import { Header, styled } from "@revolt/ui";

import { HeaderIcon } from "./common/CommonHeader";

/**
 * Base layout of the friends page
 */
const Base = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme!.colours["background-200"]};
`;

export function Friends() {
  const client = useClient();

  return (
    // TODO: i18n
    <Base>
      <Header palette="primary">
        <HeaderIcon>
          <BiSolidUserDetail size={24} />
        </HeaderIcon>
        Friends
      </Header>
      <span>
        {
          [...client.users.values()].filter(
            (user) => user.relationship === "Incoming"
          ).length
        }{" "}
        pending
      </span>
      <span>
        {
          [...client.users.values()].filter(
            (user) => user.relationship === "Outgoing"
          ).length
        }{" "}
        outgoing
      </span>
      <span>
        {
          [...client.users.values()].filter(
            (user) => user.relationship === "Friend"
          ).length
        }{" "}
        friends
      </span>
      <span>
        {
          [...client.users.values()].filter(
            (user) => user.relationship === "Blocked"
          ).length
        }{" "}
        blocked
      </span>
    </Base>
  );
}
