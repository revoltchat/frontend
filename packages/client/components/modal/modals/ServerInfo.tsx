import { BiRegularX } from "solid-icons/bi";
import { Show } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";

import { Markdown } from "@revolt/markdown";
import { Button, Column, Row, Text } from "@revolt/ui";

import { modalController } from "..";
import { PropGenerator } from "../types";

/**
 * Modal to display server information
 */
const ServerInfo: PropGenerator<"server_info"> = (props, onClose) => {
  return {
    title: (
      <Row align>
        <Column grow>
          <Text class="title">{props.server.name}</Text>
        </Column>
        <Button size="icon" variant="plain" onPress={onClose}>
          <BiRegularX size={36} />
        </Button>
      </Row>
    ),
    children: (
      <Show when={props.server.description}>
        <Markdown content={props.server.description!} />
      </Show>
    ),
    actions: [
      {
        // TODO: report server
        onClick: () => true, //report(server),
        children: <Trans>Report</Trans>,
        palette: "error",
      },
      {
        onClick: () => {
          modalController.push({
            type: "server_identity",
            member: props.server.member!,
          });
          return true;
        },
        children: <Trans>Edit Identity</Trans>,
        palette: "secondary",
      },
      {
        onClick: () => {
          modalController.push({
            type: "settings",
            config: "server",
            context: props.server,
          });
          return true;
        },
        children: <Trans>Settings</Trans>,
        palette: "secondary",
      },
    ],
  };
};

export default ServerInfo;
