import { useClient } from "@revolt/client";
import { dayjs } from "@revolt/i18n";
import { styled, Message, ScrollContainer, MessageDivider } from "@revolt/ui";
import { Channel, Message as MessageInterface } from "revolt.js";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  on,
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

  // note: we use a switch instead of <Switch /> as we know `t` will never change
  switch (local.t) {
    case 0:
      return <Message {...(other as ListEntry & { t: 0 })} />;
    case 1:
      return <MessageDivider {...(other as ListEntry & { t: 1 })} />;
    default:
      return null;
  }
}

/**
 * Render messages in a Channel
 */
export function Messages(props: { channel: Channel }) {
  const client = useClient();

  // Keep track of rendered messages
  const [messages, setMessages] = createSignal<MessageInterface[]>([]);

  // Fetch messages on channel mount
  createEffect(
    on(
      () => props.channel,
      (channel) => {
        setMessages([]);

        channel
          .fetchMessagesWithUsers()
          .then(({ messages }) => setMessages(messages));
      }
    )
  );

  /**
   * Handle incoming messages
   * @param msg Message object
   */
  function onMessage(msg: MessageInterface) {
    if (msg.channel_id === props.channel._id) {
      setMessages([msg, ...messages()]);
    }
  }

  // Add listener for messages
  client.addListener("message", onMessage);
  onCleanup(() => client.removeListener("message", onMessage));

  // We need to cache created objects to prevent needless re-rendering
  let objectCache = new Map();

  // Determine which messages have a tail and add message dividers
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
          !isEqual(message.masquerade, next.masquerade) ||
          message.system ||
          next.system ||
          (message.reply_ids && message.reply_ids.length)
        ) {
          tail = false;
        }
      } else {
        tail = false;
      }

      messagesWithTail.push(
        objectCache.get(`${message._id}:${tail}`) ?? {
          t: 0,
          message,
          tail,
        }
      );

      if (date) {
        messagesWithTail.push(
          objectCache.get(date) ?? {
            t: 1,
            date: dayjs(date).format("LL"),
            unread: false,
          }
        );
      }
    });

    // Flush cache
    objectCache.clear();

    // Populate cache with current objects
    for (const object of messagesWithTail) {
      if (object.t === 0) {
        objectCache.set(`${object.message._id}:${object.tail}`, object);
      } else {
        objectCache.set(object.date, object);
      }
    }

    return messagesWithTail;
  });

  return (
    <Base offsetTop={48} scrollDirection="y">
      <div>
        <For each={messagesWithTail()}>{(props) => <Entry {...props} />}</For>
      </div>
    </Base>
  );
}
