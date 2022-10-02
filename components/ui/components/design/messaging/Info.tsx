import { Props } from "./Message";

export function Info({ message, head }: Props) {
    if (head) {
        return (
            <>
                <time>Today at 19:00</time>
                {message.edited && <time>(edited)</time>}
            </>
        );
    } else {
        if (message.edited) {
            return <time>(edited)</time>;
        } else {
            return <time>format</time>;
        }
    }
};