import { styled } from "styled-system/jsx";

import { iconSize } from "@revolt/ui";

import MdAdd from "@material-design-icons/svg/outlined/add.svg?component-solid";
import MdLink from "@material-design-icons/svg/outlined/link.svg?component-solid";

import { useModals } from "..";
import { PropGenerator } from "../types";

/**
 * Modal to create or join a server
 */
const CreateOrJoinServer: PropGenerator<"create_or_join_server"> = (props) => {
  const { pop, openModal } = useModals();

  return {
    title: "Create or join a server",
    description: (
      <Base>
        <a
          onClick={() => {
            pop();
            openModal({
              type: "create_server",
              client: props.client,
            });
          }}
        >
          <MdAdd {...iconSize(48)} />
          Create
        </a>
        <a
          onClick={() => {
            pop();
            openModal({ type: "join_server", client: props.client });
          }}
        >
          <MdLink {...iconSize(48)} />
          Join
        </a>
      </Base>
    ),
  };
};

// example
const Base = styled("div", {
  base: {
    gap: "8px",
    padding: "8px",
    display: "flex",
    flexDirection: "row",
    "& a": {
      width: "128px",
      height: "128px",
      display: "grid",
      placeItems: "center",
      borderRadius: "8px",
      background: "var(--colours-sidebar-channels-background)",
    },
  },
});

export default CreateOrJoinServer;
