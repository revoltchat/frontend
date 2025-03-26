import MdArrowForward from "@material-design-icons/svg/filled/arrow_forward.svg?component-solid";

import { iconSize, Ripple } from "../../..";

import { FloatingIndicator } from "./FloatingIndicator";
import { Trans } from "@lingui-solid/solid/macro";

interface Props {
  /**
   * Jump back to present messages
   */
  onClick: () => void;
}

/**
 * Component indicating user can jump back to present messages
 */
export function JumpToBottom(props: Props) {
  return (
    <FloatingIndicator position="bottom" onClick={props.onClick}>
      <Ripple />
      <span style={{ "flex-grow": 1 }}>
        <Trans>Viewing older messages</Trans>
      </span>
      <span>
        <Trans>Jump to present</Trans>
      </span>
      <MdArrowForward {...iconSize(16)} />
    </FloatingIndicator>
  );
}
