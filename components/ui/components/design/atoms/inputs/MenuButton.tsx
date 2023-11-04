import { ComponentProps, JSX, Show, splitProps } from "solid-js";
import { styled } from "solid-styled-components";

import { Row } from "../../layout";
import { generateTypographyCSS } from "../display/Typography";
import { Unreads } from "../indicators";

export interface Props {
  /**
   * Button size
   * @default thin
   */
  readonly size?: "thin" | "normal";

  /**
   * Button attention
   * @default normal
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
  flex-shrink: 0;
  user-select: none;

  border-radius: ${({ theme }) => theme!.borderRadius.md};
  height: ${(props) => (props.size === "normal" ? 42 : 32)}px;
  gap: ${(props) => props.theme!.gap[props.size === "normal" ? "md" : "sm"]};

  ${(props) => generateTypographyCSS(props.theme!, "menu-button")};

  color: ${(props) =>
    props.theme!.colours[
      props.attention === "active" || props.attention === "selected"
        ? "component-menubtn-selected-foreground"
        : props.attention === "muted"
        ? "component-menubtn-muted-foreground"
        : "component-menubtn-default-foreground"
    ]};

  background: ${(props) =>
    props.theme!.colours[
      props.attention === "selected"
        ? "component-menubtn-selected-background"
        : props.attention === "muted"
        ? "component-menubtn-muted-background"
        : "component-menubtn-default-background"
    ]};

  transition: ${(props) => props.theme!.transitions.fast} all;

  /* TODO: BAD!! > * {
    filter: ${(props) =>
    props.attention === "muted" ? props.theme!.effects.muted : "none"};
  } */

  .content {
    flex-grow: 1;
    min-width: 0;
  }

  .actions {
    display: none;
  }

  &:hover {
    color: ${({ theme }) =>
      theme!.colours["component-menubtn-hover-foreground"]};
    background: ${({ theme }) =>
      theme!.colours["component-menubtn-hover-background"]};

    .actions {
      display: block;
    }
  }

  &:active {
    filter: ${(props) => props.theme!.effects.active};
  }
`;

/**
 * Menu button element
 */
export function MenuButton(props: Props & ComponentProps<typeof Row>) {
  const [local, other] = splitProps(props, [
    "icon",
    "children",
    "alert",
    "actions",
  ]);

  return (
    <Base {...other} align>
      {local.icon}
      <div class="content">{local.children}</div>
      <Show when={local.alert}>
        <Unreads
          count={typeof local.alert === "number" ? local.alert : 0}
          size={typeof local.alert === "number" ? "0.85rem" : "0.4rem"}
          unread
        />
      </Show>
      {local.actions && <div class="actions">{local.actions}</div>}
    </Base>
  );
}
