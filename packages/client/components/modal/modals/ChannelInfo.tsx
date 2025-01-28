import { BiRegularX } from "solid-icons/bi";

import { Markdown } from "@revolt/markdown";
import { Button, Column, Row, Text, Typography } from "@revolt/ui";

import { PropGenerator } from "../types";

/**
 * Modal to display channel information
 */
const ChannelInfo: PropGenerator<"channel_info"> = (props, onClose) => {
  return {
    title: (
      <Row align>
        <Column grow>
          <Text class="title">{`#${props.channel.name}`}</Text>
        </Column>
        <Button size="icon" variant="plain" onPress={onClose}>
          <BiRegularX size={36} />
        </Button>
      </Row>
    ),
    children: <Markdown content={props.channel.description!} />,
  };
};

export default ChannelInfo;
