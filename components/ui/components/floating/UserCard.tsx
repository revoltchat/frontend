import type { JSX } from "solid-js";
import { For, Show } from "solid-js";
import { styled } from "solid-styled-components";

import { ColouredText } from "../design";

/**
 * Base element for the card
 */
const Base = styled("div", "Tooltip")`
  color: white;
  background: black;
  width: 400px;
  height: 400px;
`;

/**
 * User Card
 */
export function UserCard(
  props: JSX.Directives["floating"]["userCard"] & object
) {
  return (
    <Base>
      {props.user.username}
      <br />
      <Show when={props.member}>
        <For each={props.member!.orderedRoles}>
          {(role) => (
            <div>
              <ColouredText
                colour={role.colour!}
                clip={role.colour?.includes("gradient")}
              >
                {role.name}
              </ColouredText>
            </div>
          )}
        </For>
      </Show>
    </Base>
  );
}
