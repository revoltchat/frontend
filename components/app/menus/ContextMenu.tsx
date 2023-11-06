import { Component, ComponentProps, JSX } from "solid-js";

import { iconSize, styled } from "@revolt/ui";

export const ContextMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme!.gap.md} 0;

  overflow: hidden;
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) =>
    props.theme!.colours["component-context-menu-background"]};
  color: ${(props) =>
    props.theme!.colours["component-context-menu-foreground"]};

  box-shadow: 0 0 3px
    ${(props) => props.theme!.colours["component-context-menu-shadow"]};
`;

export const ContextMenuDivider = styled.div`
  height: 1px;
  margin: ${(props) => props.theme!.gap.sm} 0;
  background: ${(props) =>
    props.theme!.colours["component-context-menu-divider"]};
`;

export const ContextMenuItem = styled("a", "MenuItem")`
  display: block;
  padding: ${(props) => props.theme!.gap.md} ${(props) => props.theme!.gap.lg};

  &:hover {
    background: ${(props) =>
      props.theme!.colours["component-context-menu-item-hover-background"]};
  }
`;

const ButtonBase = styled(ContextMenuItem)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme!.gap.md};

  > span {
    margin-top: 1px;
  }
`;

type ButtonProps = ComponentProps<typeof ContextMenuItem> & {
  icon?: Component<JSX.SvgSVGAttributes<SVGSVGElement>>;
};

export function ContextMenuButton(props: ButtonProps) {
  return (
    <ButtonBase>
      {props.icon?.(iconSize("1.2em"))}
      <span>{props.children}</span>
    </ButtonBase>
  );
}
