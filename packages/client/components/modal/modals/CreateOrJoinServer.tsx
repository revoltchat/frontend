import { BiRegularPlus, BiRegularShare, BiSolidShare } from "solid-icons/bi";

import { useTranslation } from "@revolt/i18n";
import { useNavigate } from "@revolt/routing";
import { styled } from "@revolt/ui";

import { modalController } from "..";
import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to create or join a server
 */
const CreateOrJoinServer: PropGenerator<"create_or_join_server"> = (props) => {
  const t = useTranslation();

  return {
    // title: "...",
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
          <BiRegularPlus size={48} />
          Create
        </a>
        <a
          onClick={() => {
            modalController.pop();
            modalController.push({ type: "join_server", client: props.client });
          }}
        >
          <BiRegularShare size={48} />
          Join
        </a>
      </Base>
    ),
    actions: [],
  };
};

// example
const Base = styled.div`
  gap: 8px;
  padding: 8px;
  display: flex;
  flex-direction: row;

  /* maybe use M3 Cards? TODO */
  a {
    width: 128px;
    height: 128px;

    display: grid;
    place-items: center;

    border-radius: 8px;
    background: ${(props) =>
      props.theme!.colours["sidebar-channels-background"]};
  }
`;

export default CreateOrJoinServer;
