export { UserCard } from "./UserCard";
export { FloatingManager } from "./FloatingManager";
export { Tooltip } from "./Tooltip";
export { CompositionPicker } from "./CompositionPicker";

/**
 * Trigger a global mousedown running the floating close logic
 */
export function dismissFloatingElements() {
  document.dispatchEvent(new Event("mousedown"));
}
