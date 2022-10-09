import { useClient } from "@revolt/client";
import { dayjs } from "@revolt/i18n";
import { styled, Message, ScrollContainer, MessageDivider } from "@revolt/ui";
import { API, Channel, Message as MessageInterface, Nullable } from "revolt.js";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  splitProps,
} from "solid-js";
import isEqual from "lodash.isequal";

/**
 * Base list container
 */
const Base = styled(ScrollContainer)`
  flex-grow: 1;

  display: flex;
  overflow: auto;
  flex-direction: column-reverse;

  > div {
    display: flex;
    padding-bottom: 24px;
    flex-direction: column-reverse;
  }
`;

/**
 * List entries
 */
type ListEntry =
  | {
      // Message
      t: 0;
      message: MessageInterface;
      tail: boolean;
    }
  | {
      // Message Divider
      t: 1;
      date: string;
      unread: boolean;
    };

/**
 * Render individual list entry
 */
function Entry(props: ListEntry) {
  const [local, other] = splitProps(props, ["t"]);
  switch (local.t) {
    case 0:
      return <Message {...(other as ListEntry & { t: 0 })} />;
    case 1:
      return <MessageDivider {...(other as ListEntry & { t: 1 })} />;
    default:
      return null;
  }
  /*return (
    <Switch>
      <Match when={local.t === 0}>
        <Message {...(other as ListEntry & { t: 0 })} />
      </Match>
      <Match when={local.t === 1}>
        <MessageDivider {...(other as ListEntry & { t: 1 })} />
      </Match>
    </Switch>
  );*/
}

/**
 * Render messages in a Channel
 */
export function Messages({ channel }: { channel: Accessor<Channel> }) {
  const client = useClient();

  const [messages, setMessages] = createSignal<MessageInterface[]>([]);

  createEffect(() => {
    setMessages([]);

    channel()
      .fetchMessagesWithUsers()
      .then(({ messages }) => setMessages(messages));
  });

  function onMessage(msg: MessageInterface) {
    if (msg.channel_id === channel()._id) {
      setMessages([msg, ...messages()]);
    }
  }

  client.addListener("message", onMessage);
  onCleanup(() => client.removeListener("message", onMessage));

  const messagesWithTail = createMemo<ListEntry[]>(() => {
    const messagesWithTail: ListEntry[] = [];

    const arr = messages();
    arr.forEach((message, index) => {
      const next = arr[index + 1];
      let tail = true;

      let date = null;
      if (next) {
        const atime = message.createdAt,
          btime = next.createdAt,
          adate = new Date(atime),
          bdate = new Date(btime);

        if (
          adate.getFullYear() !== bdate.getFullYear() ||
          adate.getMonth() !== bdate.getMonth() ||
          adate.getDate() !== bdate.getDate()
        ) {
          date = adate;
        }

        if (
          message.author_id !== next.author_id ||
          Math.abs(btime - atime) >= 420000 ||
          !isEqual(message.masquerade, next.masquerade)
        ) {
          tail = false;
        }
      } else {
        tail = false;
      }

      messagesWithTail.push({
        t: 0,
        message,
        tail,
      });

      if (date) {
        messagesWithTail.push({
          t: 1,
          date: dayjs(date).format("LL"),
          unread: false,
        });
      }
    });

    return messagesWithTail;
  });

  return (
    <Base offsetTop={48}>
      <div>
        <For each={messagesWithTail()}>{(props) => <Entry {...props} />}</For>
      </div>
    </Base>
  );
}
