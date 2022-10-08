import {
  BiSolidPencil,
  BiRegularCheck,
  BiRegularCloudUpload,
} from "solid-icons/bi";
import { styled } from "solid-styled-components";

/**
 * Text and icon styling
 */
const Base = styled("div")`
  gap: 8px;
  padding: 4px;
  display: flex;
  align-items: center;

  font-weight: 500;
  user-select: none;
  text-transform: capitalize;
  color: ${({ theme }) => theme!.colours.foreground};
`;

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
export function SaveStatus({ status }: Props) {
  return (
    <Base>
      {status === "saved" ? (
        <BiRegularCheck size={20} />
      ) : status === "editing" ? (
        <BiSolidPencil size={20} />
      ) : (
        <BiRegularCloudUpload size={20} />
      )}
      {/* FIXME: add i18n */}
      <span>{status}</span>
    </Base>
  );
}
