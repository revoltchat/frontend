import { JSX } from "solid-js";
import { styled } from "solid-styled-components";

/**
 * Base code block styles
 */
const Base = styled.pre`
  margin: 0;
  overflow-x: auto;
  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) => props.theme!.colours["background-300"]};

  code {
    font-size: 90%;
    background: transparent;
  }
`;

/**
 * Copy code block contents button styles
 */
const Lang = styled.div`
  width: fit-content;
  padding-bottom: 8px;
  font-family: ${(props) => props.theme!.fonts.monospace};

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
 * Render a code block with copy text button
 */
export function RenderCodeblock(props: {
  children: JSX.Element;
  class?: string;
}) {
  const lang = () => (props.class ? props.class.split("-")[1] : "text");
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
          {lang()}
        </a>
      </Lang>
      {props.children}
    </Base>
  );
}
