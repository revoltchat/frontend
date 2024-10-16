import { type SolidOptions } from "solid-dnd-directive";

export { };

declare global {
  interface Window {
    __TAURI__: Object;
  }
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      dndzone: SolidOptions
    }
  }
}