import { JSX, Match, Show, splitProps, Switch } from "solid-js";
import { styled } from "solid-styled-components";
import { Row } from "../../layout";

export interface Props {
  /**
   * Button size
   */
  readonly size?: "thin" | "normal";

  /**
   * Button attention
   */
  readonly attention?: "muted" | "normal" | "active" | "selected";

  /**
   * Button icon
   */
  readonly icon?: JSX.Element;

  /**
   * Button content
   */
  readonly children?: JSX.Element;

  /**
   * Alert indicator
   */
  readonly alert?: number | boolean;

  /**
   * Hover actions
   */
  readonly actions?: JSX.Element;
}

/**
 * Base menu button styles
 */
const Base = styled(Row)<Pick<Props, "size" | "attention">>`
  margin: 0 8px;
  padding: 0 8px;
  user-select: none;
  height: ${(props) => (props.size === "normal" ? 42 : 32)}px;
  gap: ${(props) => props.theme!.gap[props.size === "normal" ? "md" : "sm"]};

  flex-shrink: 0;
  border-radius: ${({ theme }) => theme!.borderRadius.md};

  color: ${(props) =>
    props.theme!.colours[
      props.attention === "active" || props.attention === "selected"
        ? "foreground"
        : "foreground-300"
    ]};

  background: ${(props) =>
    props.attention === "selected"
      ? props.theme!.colours["background-200"]
      : "transparent"};

  filter: ${(props) =>
    props.attention === "muted" ? "brightness(0.75)" : "none"};

  transition: ${(props) => props.theme!.transitions.fast} all;

  .content {
    flex-grow: 1;
    min-width: 0;
  }

  .actions {
    display: none;
  }

  &:hover {
    background: ${({ theme }) => theme!.colours["background-200"]};

    .actions {
      display: block;
    }
  }
`;

/**
 * Menu button element
 */
export function MenuButton(props: Props) {
  const [local, other] = splitProps(props, [
    "icon",
    "children",
    "alert",
    "actions",
  ]);

  // TODO: proper alert / unread styling needed
  return (
    <Base {...other} align>
      {local.icon}
      <div class="content">{local.children}</div>
      <Show when={local.alert}>
        <Switch fallback={"!"}>
          <Match when={typeof local.alert === "number" && local.alert > 0}>
            {local.alert}
          </Match>
        </Switch>
      </Show>
      {local.actions && <div class="actions">{local.actions}</div>}
    </Base>
  );
}
