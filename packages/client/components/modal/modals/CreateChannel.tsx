import { Trans } from "@lingui-solid/solid/macro";

import { useNavigate } from "@revolt/routing";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Modal to create a new server channel
 */
const CreateChannel: PropGenerator<"create_channel"> = (props) => {
  const navigate = useNavigate();

  return createFormModal({
    modalProps: {
      title: <Trans>Create channel</Trans>,
    },
    schema: {
      name: "text",
      type: "radio",
    },
    data: {
      name: {
        field: <Trans>Channel Name</Trans>,
      },
      type: {
        field: <Trans>Channel Type</Trans>,
        choices: [
          {
            name: <Trans>Text Channel</Trans>,
            value: "Text",
          },
          {
            name: <Trans>Voice Channel</Trans>,
            value: "Voice",
          },
        ],
      },
    },
    defaults: {
      type: "Text",
    },
    callback: async ({ name, type }) => {
      const channel = await props.server.createChannel({
        type: type as "Text" | "Voice",
        name,
      });

      if (props.cb) {
        props.cb(channel);
      } else {
        navigate(`/server/${props.server.id}/channel/${channel.id}`);
      }
    },
    submit: {
      children: <Trans>Create</Trans>,
    },
  });
};

export default CreateChannel;
