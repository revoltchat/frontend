import { Trans } from "@lingui-solid/solid/macro";

import { useNavigate } from "@revolt/routing";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to create a new server
 */
const CreateServer: PropGenerator<"create_server"> = (props) => {
  const navigate = useNavigate();

  return createFormModal({
    modalProps: {
      title: <Trans>Create server</Trans>,
      description: (
        <Trans>
          By creating this server, you agree to the{" "}
          <a href="https://revolt.chat/aup" target="_blank" rel="noreferrer">
            <Trans>Acceptable Use Policy</Trans>
          </a>
          .
        </Trans>
      ),
    },
    schema: {
      name: "text",
    },
    data: {
      name: {
        field: <Trans>Server Name</Trans>,
      },
    },
    callback: async ({ name }) => {
      const server = await props.client.servers.createServer({
        name,
      });

      setTimeout(() => navigate(`/server/${server.id}`));
    },
    submit: {
      children: <Trans>Create</Trans>,
    },
  });
};

export default CreateServer;
