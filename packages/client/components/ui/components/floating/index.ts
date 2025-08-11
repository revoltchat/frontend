export { UserCard } from "./UserCard";
export { FloatingManager } from "./FloatingManager";
export { Tooltip } from "./Tooltip";

/**
 * Trigger a global mousedown running the floating close logic
 */
export function dismissFloatingElements() {
  document.dispatchEvent(new Event("mousedown"));
}
