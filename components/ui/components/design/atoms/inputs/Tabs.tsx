import { styled } from "solid-styled-components";
import { Accessor, For, JSX } from "solid-js";
import { Row } from "../../layout";
import { BiSolidXCircle } from "solid-icons/bi";

interface Props {
  /**
   * Tabs to display in element
   */
  readonly tabs: () => Record<
    string,
    { label: JSX.Element; dismissable?: boolean }
  >;

  /**
   * Current tab
   */
  readonly tab: Accessor<string>;

  /**
   * Select a new tab
   * @param tab Tab
   */
  readonly onSelect: (tab: string) => void;

  /**
   * Dismiss a tab
   * @param tab Tab
   */
  readonly onDismiss?: (tab: string) => void;
}

/**
 * Base container of rows
 */
const Base = styled(Row)`
  flex-wrap: wrap;
  background: ${(props) => props.theme!.colours["background-200"]};
`;

/**
 * Single tab entry
 */
const Tab = styled.a<{ active: boolean }>`
  gap: 4px;
  display: flex;
  align-items: center;

  cursor: pointer;
  user-select: none;
  padding: 0.4em 1em;
  border-top: 4px solid transparent;
  border-bottom: 4px solid
    ${(props) =>
      props.active ? props.theme!.colours["accent"] : "transparent"};
  color: ${(props) => props.theme!.colours["foreground"]};
  background: ${(props) => props.theme!.colours["background-200"]};
  transition: ${(props) => props.theme!.transitions.fast};

  &:hover {
    filter: brightness(1.2);
    color: ${(props) => props.theme!.colours["foreground"]};
  }
`;

/**
 * Dismiss tab button
 */
const Dismiss = styled.a`
  height: 16px;
  display: block;
`;

/**
 * Component for displaying an interactive list of tabs
 */
export function Tabs(props: Props) {
  return (
    <Base role="tablist" gap="none">
      <For each={Object.keys(props.tabs())}>
        {(tab) => {
          const active = () => props.tab() === tab;
          const entry = () => props.tabs()[tab];
          return (
            <Tab
              role="tab"
              aria-selected={active()}
              active={active()}
              onClick={() => props.onSelect(tab)}
            >
              {entry().label}
              {entry().dismissable && (
                <Dismiss
                  onClick={(ev) => {
                    ev.stopPropagation();
                    props.onDismiss?.(tab);
                  }}
                >
                  <BiSolidXCircle size={16} />
                </Dismiss>
              )}
            </Tab>
          );
        }}
      </For>
    </Base>
  );
}
