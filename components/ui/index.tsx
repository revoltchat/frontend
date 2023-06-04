import { Component, createEffect } from "solid-js";
import type { JSX } from "solid-js";
import { useTheme } from "solid-styled-components";
import { DirectiveProvider } from "solid-styled-components";

import { Placement } from "@floating-ui/dom";
import { Channel, Client, ServerMember, User } from "revolt.js";

import {
  AutoCompleteState,
  autoComplete,
  floating,
  scrollable,
} from "./directives";

export * from "./components";
export * from "./directives";
export { darkTheme } from "./themes/darkTheme";

export { ThemeProvider, styled, useTheme } from "solid-styled-components";
export type { DefaultTheme } from "solid-styled-components";

/**
 * Provide directives
 */
export function ProvideDirectives(props: { children: JSX.Element }) {
  return (
    <DirectiveProvider
      directives={{
        "use:floating": floating,
        "use:scrollable": scrollable,
        "use:autoComplete": autoComplete,
      }}
    >
      {props.children}
    </DirectiveProvider>
  );
}

/**
 * Apply theme to document body
 */
export function ApplyGlobalStyles() {
  const theme = useTheme();

  createEffect(() => {
    // Inject common theme styles
    Object.assign(document.body.style, {
      "font-family": theme.fonts.primary,
      background: theme.scheme.background,
      color: theme.scheme.onBackground,
    });

    // Set default emoji size
    document.body.style.setProperty("--emoji-size", theme.layout.emoji.small);
  });

  return <></>;
}

/**
 * Export directive typing
 */
declare module "solid-js" {
  // eslint-disable-next-line
  namespace JSX {
    interface Directives {
      scrollable:
        | true
        | {
            /**
             * Scroll direction
             */
            direction?: "x" | "y";

            /**
             * Offset to apply to top of scroll container
             */
            offsetTop?: number;

            /**
             * Whether to only show scrollbar on hover
             */
            showOnHover?: boolean;
          };
      invisibleScrollable:
        | true
        | {
            /**
             * Scroll direction
             */
            direction?: "x" | "y";
          };
      floating: {
        tooltip?: {
          /**
           * Where the tooltip should be placed
           */
          placement: Placement;
        } & (
          | {
              /**
               * Tooltip content
               */
              content: Component;

              /**
               * Aria label fallback
               */
              aria: string;
            }
          | {
              /**
               * Tooltip content
               */
              content: string | undefined;

              /**
               * Content is used as aria fallback
               */
              aria?: undefined;
            }
        );
        userCard?: {
          /**
           * User to display
           */
          user: User;

          /**
           * Member to display
           */
          member?: ServerMember;
        };
        contextMenu?: Component;
        autoComplete?: {
          state: Accessor<AutoCompleteState>;
          selection: Accessor<number>;
          select: (index: number) => void;
        };
      };
      autoComplete:
        | true
        | {
            client?: Client;
            onKeyDown?: (
              event: KeyboardEvent & { currentTarget: HTMLTextAreaElement }
            ) => void;
            searchSpace?: {
              users?: User[];
              members?: ServerMember[];
              channels?: Channel[];
            };
          };
    }
  }
}
