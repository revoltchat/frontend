import { JSX, splitProps } from "solid-js";
import { styled } from "solid-styled-components";
import { BiRegularCheck } from 'solid-icons/bi'

const Base = styled("label")`
  gap: 10px;
  padding: 4px;
  display: flex;
  cursor: pointer;
  user-select: none;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius["md"]};
  transition: 0.1s ease background-color;
  input {
    display: none;
  }
  &:hover {
    background: ${({ theme }) => theme.colours["background-100"]};
    .playSound {
      visibility: visible;
      opacity: 1;
    }
    .check {
      visibility: visible;
      opacity: 1;
    }
  }
  &[disabled] {
    opacity: 0.8;
    cursor: not-allowed;
  }
  //TODO: When value is checked, allow me to add .hover { .checkmark { border-color:  var(--tertiary-foreground);} }
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
  color: ${({ theme }) => theme.colours["foreground"]};
`;

const Title = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const TitleAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  visibility: hidden;
  opacity: 0;
  transition: 0.1s ease-in-out all;
  border-radius: ${({ theme }) => theme.borderRadius["md"]};
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const Description = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colours["foreground-200"]};
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
  border: 2px solid ${({ theme }) => theme.colours["foreground-400"]};
  border-radius: ${({ theme }) => theme.borderRadius["md"]};
  background: ${({ theme }) => theme.colours["background-100"]};
  flex-shrink: 0;
  margin: 4px;
  transition: 0.1s ease-in-out all;
  .check {
    transition: inherit;
    color: ${({ theme }) => theme.colours["foreground-400"]};
    visibility: hidden;
    opacity: 0;
  }
  ${(props) => props.value ?
    `
    border-color: ${props.theme.colours["accent"]};
    background: ${props.theme.colours["accent"]};
    .check {
      visibility: visible;
      opacity: 1;
      color: var(--accent-contrast);
    }
  `: undefined}
`;

export type Props = {
  readonly disabled?: boolean;

  readonly title?: JSX.Element;
  readonly description?: JSX.Element;

  readonly value: boolean;
  readonly onChange: (state: boolean) => void;
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
        {local.title && (
          <TitleContent>
            <Title>{local.title}</Title>
            {/*<TitleAction className="playSound">
                            <VolumeFull size={16} />
                        </TitleAction>*/}
          </TitleContent>
        )}
        {local.description && <Description>{local.description}</Description>}
      </Content>
      <input
        type="checkbox"
        checked={local.value}
        onChange={() => !local.disabled && local.onChange(!local.value)}
      />
      <Checkmark value={local.value} class="checkmark">
        <BiRegularCheck size={20} class="check" />
      </Checkmark>
    </Base>
  );
}