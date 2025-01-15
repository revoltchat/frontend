import { BiRegularCheck, BiSolidPalette } from "solid-icons/bi";
import { For, Show, createSignal, splitProps } from "solid-js";
import { styled } from "styled-system/jsx";

interface Props {
  readonly presets?: string[][];
  readonly value?: string;
  readonly onChange?: (state: string) => void;
}

interface SwatchProps {
  type: "small" | "large";
  colour: string;
}

const DEFAULT_PRESETS = [
  [
    "#7B68EE",
    "#3498DB",
    "#1ABC9C",
    "#F1C40F",
    "#FF7F50",
    "#FD6671",
    "#E91E63",
    "#D468EE",
  ],
  [
    "#594CAD",
    "#206694",
    "#11806A",
    "#C27C0E",
    "#CD5B45",
    "#FF424F",
    "#AD1457",
    "#954AA8",
  ],
];

const Base = styled("div", {
  base: {
    display: "flex",

    "& input": {
      width: 0,
      padding: 0,
      border: 0,
      margin: 0,
      height: 0,
      top: "72px",
      opacity: 0,
      position: "relative",
      pointerEvents: "none",
    },

    "& .overlay": {
      position: "relative",
      width: 0,

      "& div": {
        width: "8px",
        height: "68px",
      },
    },
  },
});

const Swatch = styled("div", {
  base: {
    flexShrink: 0,
    cursor: "pointer",
    border: "2px solid transparent",
    borderRadius: "var(--borderRadius-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "var(--transitions-fast)",

    "& svg": {
      transition: "inherit",
      color: "var(--colours-background)",
    },

    "&:hover": {
      border: "2px solid var(--colours-foreground)",
    },
  },
  variants: {
    type: {
      small: {
        height: "30px",
        width: "30px",
      },
      large: {
        width: "68px",
        height: "68px",
      },
    },
  },
});

const Rows = styled("div", {
  base: {
    gap: "8px",
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    paddingBottom: "4px",

    "& > div": {
      gap: "8px",
      display: "flex",
      flexDirection: "row",
      paddingInlineStart: "8px",
    },
  },
});

export function ColourSwatches(props: Props) {
  const inputRef: HTMLInputElement = null!;
  const [local, others] = splitProps(props, ["onChange", "presets", "value"]);
  const [controlledValue, setControlledValue] = createSignal<string>(
    local.value || "#FD6671"
  );

  return (
    <Base {...others}>
      <input
        ref={inputRef}
        type="color"
        value={controlledValue()}
        onChange={(ev) => setControlledValue(ev.currentTarget.value)}
      />
      <Swatch
        type="large"
        onClick={() => inputRef!.click()}
        style={{
          "background-color": controlledValue(),
        }}
      >
        <BiSolidPalette size={32} />
      </Swatch>

      <div class="overlay">
        <div />
      </div>
      <Rows>
        <For each={local.presets ?? DEFAULT_PRESETS}>
          {(row) => (
            <div>
              <For each={row}>
                {(swatch) => (
                  <Swatch
                    type="small"
                    onClick={() => setControlledValue(swatch)}
                    style={{ "background-color": swatch }}
                  >
                    <Show when={swatch === controlledValue()}>
                      <BiRegularCheck size={22} />
                    </Show>
                  </Swatch>
                )}
              </For>
            </div>
          )}
        </For>
      </Rows>
    </Base>
  );
}
