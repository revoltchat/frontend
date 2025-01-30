import { BiRegularCheck, BiRegularX } from "solid-icons/bi";
import { createSignal, splitProps } from "solid-js";
import { styled } from "styled-system/jsx";

type State = "Allow" | "Neutral" | "Deny";

interface Props {
  readonly state?: State;
  readonly disabled?: boolean;
  readonly onChange?: (state: State) => void;
}

const SwitchContainer = styled("div", {
  base: {
    flexShrink: 0,
    width: "fit-content",

    display: "flex",
    margin: "4px 0",
    overflow: "hidden",
    borderRadius: "var(--borderRadius-md)",

    "&[aria-disabled]": {
      pointerEvents: "none",
      opacity: 0.6,
    },

    transition: "var(--transitions-fast) all",
    background: "var(--unset-bg)",
  },
});

const Switch = styled("div", {
  base: {
    padding: "4px",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    transition: "var(--transitions-fast) all",

    color: "var(--unset-fg)",
    fill: "var(--unset-fg)",

    "&:hover": {
      filter: "brightness(0.8)",
    },

    "& svg": {
      stroke: "5px solid white",
    },
  },
});

/**
 * Override Switch
 */
export function OverrideSwitch(props: Props) {
  const [local, others] = splitProps(props, ["disabled", "onChange", "state"]);

  const [controlledValue, setControlledValue] = createSignal<State>(
    local.state || "Neutral"
  );

  const currentState = () => local.state ?? controlledValue();
  return (
    <SwitchContainer
      role="radiogroup"
      aria-orientiation="horizontal"
      aria-disabled={local.disabled}
      {...others}
    >
      <Switch
        onClick={() =>
          typeof local.state !== "undefined"
            ? !local.disabled && local.onChange?.("Allow")
            : setControlledValue("Allow")
        }
        role="radio"
      >
        <BiRegularCheck size={24} />
      </Switch>
      <Switch
        onClick={() =>
          typeof local.state !== "undefined"
            ? !local.disabled && local.onChange?.("Neutral")
            : setControlledValue("Neutral")
        }
        role="radio"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          width="24"
          viewBox="0 96 960 960"
        >
          <path d="M120 936v-60h60v60h-60Zm0-148v-83h60v83h-60Zm0-171v-83h60v83h-60Zm0-170v-83h60v83h-60Zm0-171v-60h60v60h-60Zm148 660v-60h83v60h-83Zm0-660v-60h83v60h-83Zm171 660v-60h83v60h-83Zm0-660v-60h83v60h-83Zm170 660v-60h83v60h-83Zm0-660v-60h83v60h-83Zm171 660v-60h60v60h-60Zm0-148v-83h60v83h-60Zm0-171v-83h60v83h-60Zm0-170v-83h60v83h-60Zm0-171v-60h60v60h-60Z" />
        </svg>
      </Switch>
      <Switch
        onClick={() =>
          typeof local.state !== "undefined"
            ? !local.disabled && local.onChange?.("Deny")
            : setControlledValue("Deny")
        }
        role="radio"
      >
        <BiRegularX size={24} />
      </Switch>
    </SwitchContainer>
  );
}
