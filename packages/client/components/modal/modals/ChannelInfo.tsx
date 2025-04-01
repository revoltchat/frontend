import { Markdown } from "@revolt/markdown";
import { Button, Column, Row, Text, iconSize } from "@revolt/ui";

import MdClose from "@material-design-icons/svg/filled/close.svg?component-solid";

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
          <MdClose {...iconSize(32)} />
        </Button>
      </Row>
    ),
    children: <Markdown content={props.channel.description!} />,
  };
};

export default ChannelInfo;
