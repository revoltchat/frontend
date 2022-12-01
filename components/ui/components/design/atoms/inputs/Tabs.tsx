import { styled } from "solid-styled-components";
import { For, JSX } from "solid-js";
import { Row } from "../../layout";

interface Props {
  /**
   * Tabs to display in element
   */
  readonly tabs: () => Record<string, { label: JSX.Element }>;

  /**
   * Current tab
   */
  readonly tab: () => string;

  /**
   * Select a new tab
   */
  readonly onSelect: (tab: string) => void;
}

/**
 * Base container of rows
 */
const Base = styled(Row)`
  flex-wrap: wrap;
  background: ${(props) => props.theme!.colours["background-100"]};
`;

/**
 * Single tab entry
 */
const Tab = styled.a<{ active: boolean }>`
  cursor: pointer;
  user-select: none;
  padding: 0.4em 1em;
  border-bottom: 4px solid
    ${(props) =>
      props.active ? props.theme!.colours["accent"] : "transparent"};
  color: ${(props) => props.theme!.colours["foreground"]};
  background: ${(props) => props.theme!.colours["background-100"]};
  transition: ${(props) => props.theme!.transitions.fast};

  &:hover {
    filter: brightness(1.2);
  }
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
          return (
            <Tab
              role="tab"
              aria-selected={active()}
              active={active()}
              onClick={() => props.onSelect(tab)}
            >
              {props.tabs()[tab].label}
            </Tab>
          );
        }}
      </For>
    </Base>
  );
}
