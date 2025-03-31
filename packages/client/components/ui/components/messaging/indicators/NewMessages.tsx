import { Accessor, Show } from "solid-js";

import { decodeTime } from "ulid";

import { Ripple } from "../../..";

import { FloatingIndicator } from "./FloatingIndicator";
import { styled } from "styled-system/jsx";
import { Trans } from "@lingui-solid/solid/macro";
import { useTime } from "@revolt/i18n";

interface Props {
  /**
   * The last Id of the message the user read
   */
  lastId: Accessor<string | undefined>;

  /**
   * Jump back to the last message
   */
  jumpBack: () => void;

  /**
   * Dismiss the message
   */
  dismiss: () => void;
}

/**
 * Component indicating to user there were new messages in chat
 */
export function NewMessages(props: Props) {
  // TODO: hook escape button

  const dayjs = useTime();

  /**
   * Remove the message
   */
  function onCancel(e: MouseEvent) {
    e.stopPropagation();
    props.dismiss();
  }

  return (
    <Show when={props.lastId()}>
      <FloatingIndicator position="top" onClick={props.jumpBack}>
        <Ripple />
        <span style={{ "flex-grow": 1 }}>
          <Trans>
            New messages since {dayjs(decodeTime(props.lastId()!)).fromNow()}
          </Trans>
        </span>
        <span>
          <Trans>Jump to the beginning</Trans>
        </span>
        {/* <CancelIcon onClick={onCancel}>
          <MdClose {...iconSize(16)} />
        </CancelIcon> */}
      </FloatingIndicator>
    </Show>
  );
}

const CancelIcon = styled("div", {
  base: {
    height: "16px",
  },
});
