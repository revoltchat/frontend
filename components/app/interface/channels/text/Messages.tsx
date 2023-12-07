import {
  Accessor,
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
  splitProps,
} from "solid-js";

import isEqual from "lodash.isequal";
import { Channel, Message as MessageInterface } from "revolt.js";

import { useClient } from "@revolt/client";
import { dayjs } from "@revolt/i18n";
import {
  BlockedMessage,
  ConversationStart,
  JumpToBottom,
  ListView,
  MessageDivider,
  ripple,
  styled,
} from "@revolt/ui";

import { Message } from "./Message";

void ripple;

/**
 * Default fetch limit
 */
const DEFAULT_FETCH_LIMIT = 50;

interface Props {
  /**
   * Channel to fetch messages from
   */
  channel: Channel;

  /**
   * Limit to number of messages to fetch at a time
   */
  fetchLimit?: number;

  /**
   * Limit to number of messages to display at one time
   */
  limit?: number;

  /**
   * Last read message id
   */
  lastReadId: Accessor<string | undefined>;

  /**
   * Bind the initial messages function to the parent component
   * @param fn Function
   */
  loadInitialMessagesRef?: (fn: (nearby?: string) => void) => void;

  /**
   * Bind the atEnd signal to the parent component
   * @param fn Function
   */
  atEndRef?: (fn: () => boolean) => void;
}

/**
 * Render messages in a Channel
 */
export function Messages(props: Props) {
  const client = useClient();

  // Keep track of messages and whether we are at the start or end (or both) of the conversation
  const [messages, setMessages] = createSignal<MessageInterface[]>([]);
  const [atStart, setStart] = createSignal(false);
  const [atEnd, setEnd] = createSignal(true);

  /**
   * Load latest messages or at a specific point in history
   * @param nearby Target message to fetch around
   */
  function loadInitialMessages(nearby?: string, initial?: boolean) {
    if (!nearby && !initial && atEnd()) return;

    setMessages([]);
    setStart(false);
    setEnd(true);

    /**
     * Handle result from request
     */
    function handleResult({ messages }: { messages: MessageInterface[] }) {
      // If it's less than we expected, we are at the start already
      if (messages.length < (props.fetchLimit ?? DEFAULT_FETCH_LIMIT)) {
        setStart(true);
      }

      setMessages((latest) => {
        // Try to account for any messages sent while we are loading the channel
        const knownIds = new Set(latest.map((x) => x.id));
        return [...latest, ...messages.filter((x) => !knownIds.has(x.id))];
      });
    }

    props.channel
      .fetchMessagesWithUsers({ limit: props.fetchLimit })
      .then(handleResult);
  }

  // Setup references if they exists
  onMount(() => {
    props.loadInitialMessagesRef?.(loadInitialMessages);
    props.atEndRef?.(atEnd);
  });

  /**
   * Fetch messages on channel mount
   */
  createEffect(
    on(
      () => props.channel,
      () => loadInitialMessages(undefined, true)
    )
  );

  /**
   * Handle incoming messages
   * @param message Message object
   */
  function onMessage(message: MessageInterface) {
    if (message.channelId === props.channel.id && atEnd()) {
      setMessages([message, ...messages()]);
    }
  }

  /**
   * Handle deleted messages
   */
  function onMessageDelete(message: { id: string; channelId: string }) {
    console.error("delete", message);
    if (
      message.channelId === props.channel.id &&
      messages().find((msg) => msg.id === message.id)
    ) {
      setMessages((messages) =>
        messages.filter((msg) => msg.id !== message.id)
      );
    }
  }

  // Add listener for messages
  onMount(() => {
    const c = client();
    c.addListener("messageCreate", onMessage);
    c.addListener("messageDelete", onMessageDelete);
  });

  onCleanup(() => {
    const c = client();
    c.removeListener("messageCreate", onMessage);
    c.removeListener("messageDelete", onMessageDelete);
  });

  // We need to cache created objects to prevent needless re-rendering
  const objectCache = new Map();

  // Determine which messages have a tail and add message dividers
  const messagesWithTail = createMemo<ListEntry[]>(() => {
    const messagesWithTail: ListEntry[] = [];
    const lastReadId = props.lastReadId() ?? "0";

    let blockedMessages = 0;
    let insertedUnreadDivider = false;

    /**
     * Create blocked message divider
     */
    const createBlockedMessageCount = () => {
      if (blockedMessages) {
        messagesWithTail.push({
          t: 2,
          count: blockedMessages,
        });

        blockedMessages = 0;
      }
    };

    const arr = messages();
    arr.forEach((message, index) => {
      const next = arr[index + 1];
      let tail = true;

      // If there is a next message, compare it to the current message
      let date = null;
      if (next) {
        // Compare dates between messages
        const adate = message.createdAt,
          bdate = next.createdAt,
          atime = +adate,
          btime = +bdate;

        if (
          adate.getFullYear() !== bdate.getFullYear() ||
          adate.getMonth() !== bdate.getMonth() ||
          adate.getDate() !== bdate.getDate()
        ) {
          date = adate;
        }

        // Compare time and properties of messages
        if (
          message.authorId !== next.authorId ||
          Math.abs(btime - atime) >= 420000 ||
          !isEqual(message.masquerade, next.masquerade) ||
          message.systemMessage ||
          next.systemMessage ||
          message.replyIds?.length
        ) {
          tail = false;
        }
      } else {
        tail = false;
      }

      // Try to add the unread divider
      if (
        !insertedUnreadDivider &&
        message.id.localeCompare(lastReadId) === -1
      ) {
        insertedUnreadDivider = true;

        messagesWithTail.push(
          objectCache.get(true) ?? {
            t: 1,
            unread: true,
          }
        );
      }

      if (message.author?.relationship === "Blocked") {
        blockedMessages++;
      } else {
        // Push any blocked messages if they haven't been yet
        createBlockedMessageCount();

        // Add message to list, retrieve if it exists in the cache
        messagesWithTail.push(
          objectCache.get(`${message.id}:${tail}`) ?? {
            t: 0,
            message,
            tail,
          }
        );
      }

      // Add date to list, retrieve if it exists in the cache
      if (date) {
        messagesWithTail.push(
          objectCache.get(date) ?? {
            t: 1,
            date: dayjs(date).format("LL"),
          }
        );
      }
    });

    // Push remainder of blocked messages
    createBlockedMessageCount();

    // Flush cache
    objectCache.clear();

    // Populate cache with current objects
    for (const object of messagesWithTail) {
      if (object.t === 0) {
        objectCache.set(`${object.message.id}:${object.tail}`, object);
      } else if (object.t === 1) {
        objectCache.set(object.unread ?? object.date, object);
      }
    }

    return messagesWithTail.reverse();
  });

  /**
   * Check if we are already fetching somewhere
   */
  function fetchGuard() {
    return false;
  }

  /**
   * Fetch messages in past
   * @param reposition Scroll guard callback
   */
  async function fetchTop(reposition: (cb: () => void) => void) {
    if (atStart()) return;
    if (fetchGuard()) return;

    // Fetch messages before the oldest message we have
    const result = await props.channel.fetchMessagesWithUsers({
      limit: props.fetchLimit,
      before: messages().slice(-1)[0].id,
    });

    // If it's less than we expected, we are at the start
    if (result.messages.length < (props.fetchLimit ?? DEFAULT_FETCH_LIMIT)) {
      setStart(true);
    }

    // If we received any messages at all, append them to the top
    if (result.messages.length) {
      // Calculate how much we need to cut off the other end
      const tooManyBy = Math.max(
        0,
        result.messages.length + messages().length - (props.limit ?? 0)
      );

      // If it's at least one element, we are no longer at the end
      if (tooManyBy > 0) {
        setEnd(false);
      }

      // Append messages to the top
      setMessages((prev) => [...prev, ...result.messages]);

      // If we removed any messages, guard the scroll position as we remove them
      if (tooManyBy) {
        reposition(() => {
          setMessages((prev) => {
            return prev.slice(tooManyBy);
          });
        });
      }
    }
  }

  /**
   * Fetch messages in future
   * @param reposition Scroll guard callback
   */
  async function fetchBottom(reposition: (cb: () => void) => void) {
    if (atEnd()) return;
    if (fetchGuard()) return;

    // Fetch messages after the newest message we have
    const result = await props.channel.fetchMessagesWithUsers({
      limit: props.fetchLimit,
      after: messages()[0].id,
      sort: "Oldest",
    });

    // If it's less than we expected, we are at the end
    if (result.messages.length < (props.fetchLimit ?? DEFAULT_FETCH_LIMIT)) {
      setEnd(true);
    }

    // If we received any messages at all, append them to the bottom
    if (result.messages.length) {
      // Calculate how much we need to cut off the other end
      const tooManyBy = Math.max(
        0,
        result.messages.length + messages().length - (props.limit ?? 0)
      );

      // If it's at least one element, we are no longer at the start
      if (tooManyBy > 0) {
        setStart(false);
      }

      // Append messages to the bottom
      setMessages((prev) => {
        return [...result.messages.reverse(), ...prev];
      });

      // If we removed any messages, guard the scroll position as we remove them
      if (tooManyBy) {
        reposition(() => setMessages((prev) => prev.slice(0, -tooManyBy)));
      }
    }
  }

  /**
   * Jump to the bottom of the chat
   */
  function jumpToBottom() {
    loadInitialMessages();
  }

  return (
    <>
      <ListView offsetTop={48} fetchTop={fetchTop} fetchBottom={fetchBottom}>
        <div>
          <div>
            <Show when={atStart()}>
              <ConversationStart channel={props.channel} />
            </Show>
            {/* TODO: else show (loading icon) OR (load more) */}
            <For each={messagesWithTail()}>
              {(props) => <Entry {...props} />}
            </For>
            {/* TODO: show (loading icon) OR (load more) */}
          </div>
        </div>
      </ListView>
      <Show when={!atEnd()}>
        <AnchorToEnd>
          <JumpToBottom onClick={jumpToBottom} />
        </AnchorToEnd>
      </Show>
    </>
  );
}

/**
 * Anchor to the end of the messages list
 */
const AnchorToEnd = styled.div`
  z-index: 30;
  position: relative;

  div {
    bottom: 0;
    width: 100%;
    position: absolute;
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
      date?: string;
      unread?: boolean;
    }
  | {
      // Blocked messages
      t: 2;
      count: number;
    };

/**
 * Render individual list entry
 */
function Entry(props: ListEntry) {
  const [local, other] = splitProps(props, ["t"]);

  return (
    <Switch>
      <Match when={local.t === 0}>
        <Message {...(other as ListEntry & { t: 0 })} />
      </Match>
      <Match when={local.t === 1}>
        <MessageDivider {...(other as ListEntry & { t: 1 })} />
      </Match>
      <Match when={local.t === 2}>
        <BlockedMessage count={(other as ListEntry & { t: 2 }).count} />
      </Match>
    </Switch>
  );
}
