import { JSX, Show } from "solid-js";
import { styled, css } from "solid-styled-components";
import { FiChevronRight } from "solid-icons/fi";
import { BiRegularLinkExternal } from "solid-icons/bi";

interface BaseProps {
  readonly account?: boolean;
  readonly disabled?: boolean;
  readonly largeDescription?: boolean;
}

const Base = styled.a<BaseProps>`
  padding: 9.8px 12px;
  border-radius: var(--border-radius);
  margin-bottom: 10px;
  color: var(--foreground);
  background: var(--secondary-header);
  gap: 12px;
  display: flex;
  align-items: center;
  flex-direction: row;

  > svg {
    flex-shrink: 0;
  }

  .content {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    font-weight: 600;
    font-size: 0.875rem;

    .title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .description {
      ${(props) =>
        props.largeDescription
          ? css`
              font-size: 0.875rem;
            `
          : css`
              font-size: 0.6875rem;
            `}

      font-weight: 400;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      color: var(--secondary-foreground);

      a:hover {
        text-decoration: underline;
      }
    }
  }

  ${(props) =>
    props.disabled
      ? css`
          opacity: 0.4;
          /*.content,
            .action {
                color: var(--tertiary-foreground);
            }*/

          .action {
            font-size: 0.875rem;
          }
        `
      : css`
          cursor: pointer;
          opacity: 1;
          transition: 0.1s ease background-color;

          &:hover {
            background: var(--secondary-background);
          }
        `}

  ${(props) =>
    props.account
      ? css`
          height: 54px;

          .content {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            .title {
              text-transform: uppercase;
              font-size: 0.75rem;
              color: var(--secondary-foreground);
            }

            .description {
              font-size: 0.9375rem;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        `
      : undefined}
`;

export interface Props extends BaseProps {
  readonly icon?: JSX.Element;
  readonly children?: JSX.Element;
  readonly description?: JSX.Element;

  readonly onClick?: () => void;
  readonly action?: "chevron" | "external" | JSX.Element;
}

export function CategoryButton(props: Props) {
  return (
    <Base
      onClick={props.onClick}
      disabled={props.disabled}
      account={props.account}
    >
      {props.icon}
      <div class="content">
        <div class="title">{props.children}</div>

        <div class="description">{props.description}</div>
      </div>
      <div class="action">
        <Show when={typeof props.action === "string"} fallback={props.action}>
          <Show
            when={props.action === "chevron"}
            fallback={<BiRegularLinkExternal size={20} />}
          >
            <FiChevronRight size={24} />
          </Show>
        </Show>
      </div>
    </Base>
  );
}
