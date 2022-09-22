import { createSignal } from "solid-js";
import usePopper from "solid-popper";
import { styled } from "solid-styled-components";

const Test = styled("div")<{ show?: boolean }>`
  color: white;
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
`;

export function TooltipDemo() {
  const [anchor, setAnchor] = createSignal<HTMLButtonElement>();
  const [popper, setPopper] = createSignal<HTMLDivElement>();
  const [show, setShow] = createSignal(false);

  usePopper(anchor, popper, {
    placement: "auto",
  });

  return (
    <>
      <button
        ref={setAnchor}
        type="button"
        onmouseenter={() => setShow(true)}
        onmouseleave={() => setShow(false)}
      >
        Example
      </button>
      <Test ref={setPopper} role="tooltip" show={show()}>
        this is a tooltip!
        <div id="arrow" data-popper-arrow></div>
      </Test>
    </>
  );
}
