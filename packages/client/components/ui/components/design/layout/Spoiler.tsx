import { Trans } from "@lingui-solid/solid/macro";
import { Show, createSignal } from "solid-js";
import { styled } from "styled-system/jsx";

interface Props {
  contentType?: "Image" | "Video";
}

const Base = styled("div", {
  base: {
    zIndex: 1,
    position: "relative",

    "& .Spoiler": {
      cursor: "pointer",
      position: "absolute",
      backdropFilter: "var(--effects-spoiler)",

      display: "grid",
      placeItems: "center",

      "& span": {
        padding: "0.6em",
        fontWeight: 600,
        userSelect: "none",
        textTransform: "uppercase",
        boxShadow: "0 0 8px #00000044",
        color: "var(--colours-foreground)",
        borderRadius: "var(--borderRadius-lg)",
        background: "var(--colours-background)",
      },
    },
  },
});

/**
 * Spoiler Element
 */
export function Spoiler(props: Props) {
  const [shown, setShown] = createSignal(true);

  return (
    <Show when={shown()}>
      <Base class="container">
        <div
          class={`Spoiler ${props.contentType}`}
          onClick={() => setShown(false)}
        >
          <span>
            <Trans>Spoiler</Trans>
          </span>
        </div>
      </Base>
    </Show>
  );
}
