import {
  BiRegularCheck,
  BiRegularCloudUpload,
  BiSolidPencil,
} from "solid-icons/bi";
import { Match, Switch } from "solid-js";

import { styled } from "styled-system/jsx";

/**
 * Text and icon styling
 */
const Base = styled("div", {
  base: {
    gap: "8px",
    padding: "4px",
    display: "flex",
    alignItems: "center",

    fontWeight: 500,
    userSelect: "none",
    textTransform: "capitalize",
    color: "var(--colours-foreground)",
  },
});

/**
 * Possible edit states
 */
export type EditStatus = "saved" | "editing" | "saving";

interface Props {
  status: EditStatus;
}

/**
 * Display a generic auto-save status
 */
export function SaveStatus(props: Props) {
  return (
    <Base>
      <Switch fallback={<BiRegularCheck size={20} />}>
        <Match when={props.status === "editing"}>
          <BiSolidPencil size={20} />
        </Match>
        <Match when={props.status === "saving"}>
          <BiRegularCloudUpload size={20} />
        </Match>
      </Switch>
      {/* FIXME: add i18n */}
      <span>{props.status}</span>
    </Base>
  );
}
