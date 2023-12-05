import { Accessor, Show } from "solid-js";

import { dayjs, useTranslation } from "@revolt/i18n";

import { ripple } from "../../../directives";

import { FloatingIndicator } from "./FloatingIndicator";

void ripple;

interface Props {
  /**
   * The last Id of the message the user read
   */
  lastId: Accessor<string | undefined>;

  /**
   * Jump back to the last message
   */
  // jumpBack: () => void;

  /**
   * Dismiss the message
   */
  // dismiss: () => void;
}

/**
 * Component indicating to user there were new messages in chat
 */
export function NewMessages(props: Props) {
  const t = useTranslation();

  return (
    <Show when={props.lastId() || true}>
      <FloatingIndicator use:ripple position="top">
        {t("app.main.channel.misc.new_messages", {
          time_ago: dayjs(/*decodeTime(props.lastId())*/).fromNow(),
        })}
      </FloatingIndicator>
    </Show>
  );
}
