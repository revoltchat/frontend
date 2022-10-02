import { createGlobalStyles } from "solid-styled-components";
import 'tippy.js/dist/svg-arrow.css';

// TODO: theming
export const GlobalStyles = () => {
  const Styles = createGlobalStyles`
    :root {
      --tooltip-bg: rgba(0,0,0,.9);
    }
    .tippy-box[data-theme~='revolt'] {
      background-color: var(--tooltip-bg);
    }

    .tippy-box[data-theme~=revolt]>.tippy-arrow {
      width: 14px;
      height: 14px;
    }

    .tippy-box[data-theme~=revolt][data-placement^=top]>.tippy-arrow:before {
      border-width: 7px 7px 0;
      border-top-color: var(--tooltip-bg);
    }

    .tippy-box[data-theme~=revolt][data-placement^=bottom]>.tippy-arrow:before {
      border-width: 0 7px 7px;
      border-bottom-color: var(--tooltip-bg);
    }

    .tippy-box[data-theme~=revolt][data-placement^=left]>.tippy-arrow:before {
      border-width: 7px 0 7px 7px;
      border-left-color: var(--tooltip-bg);
    }

    .tippy-box[data-theme~=revolt][data-placement^=right]>.tippy-arrow:before {
      border-width: 7px 7px 7px 0;
      border-right-color: var(--tooltip-bg);
    }

    .tippy-box[data-theme~=revolt]>.tippy-backdrop {
      background-color: var(--tooltip-bg);
    }

    .tippy-box[data-theme~=revolt]>.tippy-svg-arrow {
      fill: var(--tooltip-bg);
    }
  `;
  return <Styles />;
};