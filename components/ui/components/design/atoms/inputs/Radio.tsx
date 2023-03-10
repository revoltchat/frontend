import { FaSolidCircle as CircleIcon } from "solid-icons/fa";
import { JSX, Show } from "solid-js";
import { styled } from "solid-styled-components";

interface Props {
  title?: JSX.Element;
  description?: JSX.Element;
  disabled?: boolean;
  value?: boolean;
  onSelect?: () => void;
}

interface BaseProps {
  selected: boolean;
}

const Base = styled.label<BaseProps>`
  border: 2px solid var(--tertiary-foreground);
  padding: 10px;
  gap: 10px;
  display: flex;
  cursor: pointer;
  user-select: none;
  transition: 0.1s ease-in-out all;
  border-radius: var(--border-radius);

  input {
    display: none;
  }

  ${(props) =>
    props.selected
      ? `
          color: var(--accent-contrast);
          cursor: default;
          background: var(--accent);
          border: 2px solid var(--accent);

          div {
            border-color: var(--accent-contrast);

            svg {
              color: var(--accent-contrast);
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
            background: var(--hover);

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
  border: 2px solid var(--tertiary-foreground);
  border-radius: var(--border-radius-half);
  height: 20px;
  width: 20px;
  transition: inherit;

  svg {
    transition: inherit;
    color: var(--tertiary-foreground);
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
  color: var(--foreground);
  transition: inherit;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  ${(props) =>
    props.selected
      ? `
          color: var(--accent-contrast);
        `
      : undefined}
`;

const Description = styled.div<BaseProps>`
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--secondary-foreground);
  transition: inherit;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;

  ${(props) =>
    props.selected
      ? `
          color: var(--accent-contrast);
        `
      : undefined}
`;

export function Radio(props: Props) {
  const selected = props.value ?? false;
  return (
    <Base selected={selected}>
      <RadioCircle>
        <CircleIcon size={12} />
      </RadioCircle>
      <input
        type="radio"
        checked={selected}
        onChange={(e) =>
          e.currentTarget.value === "on" &&
          !props.disabled &&
          props.onSelect?.()
        }
      />
      <Content>
        <Show when={props.title}>
          <Title selected={selected}>{props.title}</Title>
        </Show>
        <Show when={props.description}>
          <Description selected={selected}>{props.description}</Description>
        </Show>
      </Content>
    </Base>
  );
}
