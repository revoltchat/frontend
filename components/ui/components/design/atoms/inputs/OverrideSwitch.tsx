import { BiRegularCheck, BiRegularSquare, BiRegularX } from "solid-icons/bi";
import { createSignal, splitProps } from "solid-js";
import { styled } from "solid-styled-components";

type State = "Allow" | "Neutral" | "Deny";

interface Props {
  readonly state?: State;
  readonly disabled?: boolean;
  readonly onChange?: (state: State) => void;
}

const SwitchContainer = styled.div`
  flex-shrink: 0;
  width: fit-content;

  display: flex;
  margin: 4px 0;
  overflow: hidden;
  border-radius: ${(props) => props.theme?.borderRadius.md};
  background: ${(props) => props.theme?.colours["background-200"]};
  border: 1px solid ${(props) => props.theme?.colours["background-400"]};

  &[aria-disabled] {
    pointer-events: none;
    opacity: 0.6;
  }
`;

const Switch = styled.div<{ state: State; selected: boolean }>`
  padding: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.2s ease all;

  color: ${(props) =>
    props.state === "Allow"
      ? props.theme?.colours.success
      : props.state === "Deny"
      ? props.theme?.colours.error
      : props.theme?.colours["foreground-400"]};

  ${(props) =>
    props.selected
      ? `
      color: white;

      background: ${
        props.state === "Allow"
          ? props.theme?.colours.success
          : props.state === "Deny"
          ? props.theme?.colours.error
          : props.theme?.colours["background-300"]
      };
    `
      : ""}

  &:hover {
    filter: brightness(0.8);
  }
`;

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
            ? !local.disabled && local.onChange?.("Deny")
            : setControlledValue("Deny")
        }
        state="Deny"
        role="radio"
        selected={currentState() === "Deny"}
      >
        <BiRegularX size={24} />
      </Switch>
      <Switch
        onClick={() =>
          typeof local.state !== "undefined"
            ? !local.disabled && local.onChange?.("Neutral")
            : setControlledValue("Neutral")
        }
        state="Neutral"
        role="radio"
        selected={currentState() === "Neutral"}
      >
        <BiRegularSquare size={24} />
      </Switch>
      <Switch
        onClick={() =>
          typeof local.state !== "undefined"
            ? !local.disabled && local.onChange?.("Allow")
            : setControlledValue("Allow")
        }
        state="Allow"
        role="radio"
        selected={currentState() === "Allow"}
      >
        <BiRegularCheck size={24} />
      </Switch>
    </SwitchContainer>
  );
}
