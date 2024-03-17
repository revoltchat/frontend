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
  color: ${(props) =>
    props.theme!.colours["messaging-component-code-block-foreground"]};
  background: ${(props) =>
    props.theme!.colours["messaging-component-code-block-background"]};

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
    cursor: pointer;
    padding: 2px 6px;
    font-weight: 600;
    user-select: none;
    display: inline-block;
    background: ${(props) =>
      props.theme!.colours[
        "messaging-component-code-block-language-background"
      ]};

    font-size: 10px;
    text-transform: uppercase;
    box-shadow: 0 2px
      ${(props) =>
        props.theme!.colours["messaging-component-code-block-background"]};
    border-radius: ${(props) => props.theme!.borderRadius.md};

    &:active {
      transform: translateY(1px);
      box-shadow: 0 1px
        ${(props) =>
          props.theme!.colours["messaging-component-code-block-background"]};
    }
  }

  a,
  a:link,
  a:active,
  a:hover {
    text-decoration: none;
    color: ${(props) =>
      props.theme!.colours[
        "messaging-component-code-block-language-foreground"
      ]};
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
            navigator.clipboard.writeText(text!);
            // TODO: modal fallback
          }}
        >
          {lang()}
        </a>
      </Lang>
      {props.children}
    </Base>
  );
}
