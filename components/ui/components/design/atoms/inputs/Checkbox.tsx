import { JSX, Show, splitProps } from "solid-js";
import { styled } from "solid-styled-components";
import { BiRegularCheck } from 'solid-icons/bi'

const Base = styled("label")`
  gap: 10px;
  padding: 4px;
  display: flex;
  cursor: pointer;
  user-select: none;
  align-items: center;
  border-radius: ${(props) => props.theme!.borderRadius["md"]};
  transition: 0.1s ease background-color;

  input {
    display: none;
  }

  &:hover {
    background: ${(props) => props.theme!.colours["background-100"]};
    
    .check {
      visibility: visible;
      opacity: 1;
    }
  }

  &[disabled] {
    opacity: 0.8;
    cursor: not-allowed;
  }
`;

const Content = styled.div`
  flex-direction: column;
  display: flex;
  flex-grow: 1;
  gap: 3px;
`;

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => props.theme!.colours["foreground"]};
`;

const Title = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const Description = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => props.theme!.colours["foreground-200"]};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;

const Checkmark = styled.div<Pick<Props, "value">>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid ${(props) => props.theme!.colours["foreground-400"]};
  border-radius: ${(props) => props.theme!.borderRadius["md"]};
  background: ${(props) => props.theme!.colours["background-100"]};
  flex-shrink: 0;
  margin: 4px;
  transition: 0.1s ease-in-out all;

  .check {
    transition: inherit;
    color: ${(props) => props.theme!.colours["foreground-400"]};
    visibility: hidden;
    opacity: 0;
  }

  ${(props) => props.value ?
    `
    border-color: ${props.theme!.colours["accent"]};
    background: ${props.theme!.colours["accent"]};

    .check {
      visibility: visible;
      opacity: 1;
      color: var(--accent-contrast);
    }
  `: ''}
`;

export type Props = {
  readonly disabled?: boolean;

  readonly title?: JSX.Element;
  readonly description?: JSX.Element;

  readonly value?: boolean;
  readonly onChange?: (state: boolean) => void;
} & Omit<
  JSX.LabelHTMLAttributes<HTMLLabelElement>,
  "value" | "children" | "onChange" | "title"
>;

export function Checkbox(props: Props) {
  const [local, others] = splitProps(
    props,
    ["disabled", "title", "description", "value", "onChange"]
  );

  return (
    <Base {...others}>
      <Content>
        <Show when={local.title}>
          <TitleContent>
            <Title>{local.title}</Title>
          </TitleContent>
        </Show>
        <Show when={local.description}>
          <Description>{local.description}</Description>
        </Show>
      </Content>
      <input
        type="checkbox"
        checked={local.value}
        onChange={() => !local.disabled && local.onChange?.(!local.value)}
      />
      <Checkmark value={local.value} class="checkmark">
        <BiRegularCheck size={20} class="check" />
      </Checkmark>
    </Base>
  );
}