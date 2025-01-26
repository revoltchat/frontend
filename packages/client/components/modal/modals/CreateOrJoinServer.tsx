import { useTranslation } from "@revolt/i18n";
import { iconSize } from "@revolt/ui";

import MdAdd from "@material-design-icons/svg/outlined/add.svg?component-solid";
import MdLink from "@material-design-icons/svg/outlined/link.svg?component-solid";

import { modalController } from "..";
import { PropGenerator } from "../types";

import { styled } from "styled-system/jsx";

/**
 * Modal to create or join a server
 */
const CreateOrJoinServer: PropGenerator<"create_or_join_server"> = (props) => {
  const t = useTranslation();

  return {
    title: "Create or join a server",
    description: (
      <Base>
        <a
          onClick={() => {
            modalController.pop();
            modalController.push({
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
            modalController.pop();
            modalController.push({ type: "join_server", client: props.client });
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
