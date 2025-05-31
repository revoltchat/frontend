import "mdui/components/segmented-button-group.js";
import "mdui/components/segmented-button.js";
import { cva } from "styled-system/css";

export function SingleSelectSegmentedButton() {
  return (
    <mdui-segmented-button-group
      selects="single"
      value="allow"
      onChange={() => {}}
    >
      <mdui-segmented-button class={styles()} value="allow">
        Allow
      </mdui-segmented-button>
      <mdui-segmented-button class={styles()} value="inherit">
        Inherit
      </mdui-segmented-button>
      <mdui-segmented-button class={styles()} value="disallow">
        Disallow
      </mdui-segmented-button>
    </mdui-segmented-button-group>
  );
}

const styles = cva({
  base: {
    border: "1px solid var(--md-sys-color-on-surface)",

    "&:nth-child(1)": {
      borderLeft: "1px solid var(--md-sys-color-on-surface)",
    },

    "&:not(:nth-child(1))": {
      borderLeft: "none",
    },

    "&[selected]": {
      color: "rgb(var(--mdui-color-on-secondary-container))",
      background: "rgb(var(--mdui-color-secondary-container))",
    },
  },
});
