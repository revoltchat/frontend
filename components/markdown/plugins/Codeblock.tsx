import { JSX } from "solid-js";
import { styled } from "solid-styled-components";

/**
 * Base codeblock styles
 */
const Base = styled.pre`
  padding: 1em;
  overflow-x: scroll;
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) => props.theme!.colours["background-300"]};
`;

/**
 * Copy codeblock contents button styles
 */
const Lang = styled.div`
  width: fit-content;
  padding-bottom: 8px;
  font-family: var(--monospace-font);

  a {
    color: #111;
    cursor: pointer;
    padding: 2px 6px;
    font-weight: 600;
    user-select: none;
    display: inline-block;
    background: ${(props) => props.theme!.colours.accent};

    font-size: 10px;
    text-transform: uppercase;
    box-shadow: 0 2px #787676;
    border-radius: ${(props) => props.theme!.borderRadius.sm};

    &:active {
      transform: translateY(1px);
      box-shadow: 0 1px #787676;
    }
  }
`;

/**
 * Render a codeblock with copy text button
 */
export function RenderCodeblock(props: {
  children: JSX.Element;
  class?: string;
}) {
  let lang = "text";
  if (props.class) {
    lang = props.class.split("-")[1];
  }

  let ref: HTMLPreElement | undefined;

  return (
    <Base ref={ref}>
      <Lang>
        <a
          onClick={() => {
            const text = ref?.querySelector("code")?.innerText;
            //text && modalController.writeText(text);
            alert(text);
          }}
        >
          {lang}
        </a>
      </Lang>
      {props.children}
    </Base>
  );
}

/* export const RenderCodeblock: React.FC<{ class: string }> = ({
    children,
    ...props
}) => {
    const ref = useRef<HTMLPreElement>(null);

    let text = "text";
    if (props.class) {
        text = props.class.split("-")[1];
    }

    const onCopy = useCallback(() => {
        const text = ref.current?.querySelector("code")?.innerText;
        text && modalController.writeText(text);
    }, [ref]);

    return (
        <Base ref={ref}>
            <Lang>
                <Tooltip content="Copy to Clipboard" placement="top">
                    
                    // @ts-expect-error Preact-React
                    <a onClick={onCopy}>{text}</a>
                </Tooltip>
            </Lang>
            {children}
        </Base>
    );
}; */
