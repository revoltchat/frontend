import { FaSolidCircle as CircleIcon } from "solid-icons/fa";
import { JSX, Show, createSignal, splitProps } from "solid-js";
import { styled } from "solid-styled-components";

interface Props {
  title?: JSX.Element;
  description?: JSX.Element;
  disabled?: boolean;
  value?: boolean;
  onSelect?: (state: boolean) => void;
}

interface BaseProps {
  selected: boolean;
}

const Base = styled.label<BaseProps>`
  border: 2px solid ${(props) => props.theme?.colours["background-400"]};
  padding: 10px;
  gap: 10px;
  display: flex;
  cursor: pointer;
  user-select: none;
  transition: ${(props) => props.theme?.transitions.fast};
  border-radius: ${(props) => props.theme?.borderRadius.md};

  input {
    display: none;
  }

  ${(props) =>
    props.selected
      ? `
          color: ${props.theme?.colours["background-100"]};
          cursor: default;
          background: ${props.theme?.colours.accent};
          border: 2px solid ${props.theme?.colours.accent};

          div {
            border-color:  ${props.theme?.colours["background-100"]};

            svg {
              color:  ${props.theme?.colours["background-100"]};
              visibility: visible;
              opacity: 1;
            }
          }
        `
      : undefined}

  ${(props) =>
    !props.selected
      ? `
          &:hover {
            background: ${props.theme?.colours["background-100"]};

            svg {
              visibility: visible;
              opacity: 1;
            }
          }
        `
      : undefined}
`;

const RadioCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid ${(props) => props.theme?.colours["background-400"]};
  border-radius: ${(props) => props.theme?.borderRadius.lg};
  height: 20px;
  width: 20px;
  transition: inherit;

  svg {
    transition: inherit;
    color: ${(props) => props.theme?.colours["background-400"]};
    flex-shrink: 0;
    visibility: hidden;
    opacity: 0;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  word-break: break-word;
  transition: inherit;
`;

const Title = styled.div<BaseProps>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme?.colours.foreground};
  transition: inherit;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  ${(props) =>
    props.selected
      ? `
          color: ${props.theme?.colours["background-100"]};
        `
      : undefined}
`;

const Description = styled.div<BaseProps>`
  font-size: 0.6875rem;
  font-weight: 500;
  color: ${(props) => props.theme?.colours["foreground-200"]};
  transition: inherit;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;

  ${(props) =>
    props.selected
      ? `
          color: ${props.theme?.colours["background-100"]};
        `
      : undefined}
`;

export function Radio(props: Props) {
  const [local, others] = splitProps(props, [
    "disabled",
    "title",
    "description",
    "value",
    "onSelect",
  ]);

  const [controlledValue, setControlledValue] = createSignal(false);
  const selected = () => local.value ?? controlledValue();

  return (
    <Base {...others} selected={selected()}>
      <RadioCircle>
        <CircleIcon size={12} />
      </RadioCircle>
      <input
        type="radio"
        checked={selected()}
        onChange={() =>
          typeof local.value !== "undefined"
            ? !local.disabled && local.onSelect?.(!local.value)
            : setControlledValue((v) => !v)
        }
      />
      <Content>
        <Show when={props.title}>
          <Title selected={selected()}>{props.title}</Title>
        </Show>
        <Show when={props.description}>
          <Description selected={selected()}>{props.description}</Description>
        </Show>
      </Content>
    </Base>
  );
}
