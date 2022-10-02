import { styled } from "solid-styled-components";
import type { Message as MessageType } from "revolt.js";
import { Avatar } from "../atoms/display/Avatar";
import { Info } from "./Info";
import { Show, For } from "solid-js";

export type Props = {
    /**
     * Message
     */
    message: MessageType;

    /**
     * Whether this component is the head (first message of a group of messages from the same user)
     */
    head?: boolean;
};

const Wrapper = styled.div<Pick<Props, "head">>`
    display: flex;
    flex-direction: column;
    padding-top: ${(props) => (props.head ? "14px" : "unset")};
`;

const MessageEl = styled.div`
    display: flex;
    line-height: 18px;

    // Make time sent and edited components uniform
    time {
        font-size: 10px;
        color: ${({ theme }) => theme!.colours["foreground-400"]};
    }
`;

const Tail = styled.div`
    width: 62px;
    display: flex;
    justify-content: center;
`;

const Content = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme!.colours["foreground"]};
    display: flex;
    flex-direction: column;
`;

const Head = styled.div`
    gap: 6px;
    display: flex;

    // Username
    span {
        font-weight: 600;
    }
`;

export function Message({ message, head }: Props) {
    return (
        <Wrapper head={head}>
            <MessageEl>
                <Tail>
                    {head ? (
                        <Avatar
                            size={36}
                            src={message.author?.generateAvatarURL({
                                max_side: 256,
                            })}
                            interactive
                        />
                    ) : (
                        <Info message={message} head={head} />
                    )}
                </Tail>
                <Content>
                    {head && (
                        <Head>
                            <span>{message.author?.username}</span>
                            <Info message={message} head={head} />
                        </Head>
                    )}
                    <span>{message.content}</span>
                    <Show when={message.attachments}>
                        <For each={message.attachments}>
                            {(item) => (
                                <Show when={item.metadata.type === "Image"}>
                                    <img
                                        style={{
                                            "max-width": "420px",
                                            "max-height": "420px",
                                        }}
                                        src={`https://autumn.revolt.chat/attachments/${item._id}`}
                                    />
                                </Show>
                            )}
                        </For>
                    </Show>
                </Content>
            </MessageEl>
        </Wrapper>
    );
};