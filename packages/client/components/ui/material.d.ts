import type { ComponentProps } from "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "md-tabs": ComponentProps<"div">;
      "md-primary-tab": ComponentProps<"div">;
      "md-ripple": ComponentProps<"div">;

      "mdui-tabs": ComponentProps<"div"> & {
        value: string;
        "full-width": boolean;
      };
      "mdui-tab": ComponentProps<"div"> & { value: string };
      "mdui-tab-panel": ComponentProps<"div"> & { value: string };
      "mdui-badge": ComponentProps<"div">;
      "mdui-navigation-rail": ComponentProps<"div"> & {
        contained: boolean;
        value: string;
      };
      "mdui-navigation-rail-item": ComponentProps<"div"> & { value: string };
    }
  }
}
