import { State } from "..";

import { AbstractStore } from ".";

/**
 * Static section IDs
 */
export enum LAYOUT_SECTIONS {
  MEMBER_SIDEBAR = "MEMBER_SIDEBAR",
}

export interface TypeLayout {
  /**
   * The current section of the program we are in
   *
   * This can currently either be:
   * - home
   * - discover
   * - a server ID
   */
  activeInterface: "home" | "discover" | string;

  /**
   * Current path within an interface
   */
  activePath: Record<TypeLayout["activeInterface"], string>;

  /**
   * Open (or closed) sections of the UI
   *
   * Only the contrary is ever stored
   */
  openSections: Record<string, boolean>;
}

/**
 * Handles layout and navigation of the app.
 */
export class Layout extends AbstractStore<"layout", TypeLayout> {
  constructor(state: State) {
    super(state, "layout");
  }

  hydrate(): void {}

  default(): TypeLayout {
    return {
      activeInterface: "home",
      activePath: {
        home: "/",
        discover: "/discover/servers",
      },
      openSections: {},
    };
  }

  clean(input: Partial<TypeLayout>): TypeLayout {
    let layout: TypeLayout = this.default();

    if (typeof input.activeInterface === "string") {
      layout.activeInterface = input.activeInterface;
    }

    if (typeof input.activePath === "object") {
      for (const interfaceId of Object.keys(input.activePath)) {
        if (typeof input.activePath[interfaceId] === "string") {
          layout.activePath[interfaceId] = input.activePath[interfaceId];
        }
      }
    }

    if (typeof input.openSections === "object") {
      for (const section of Object.keys(input.openSections)) {
        if (typeof input.openSections[section] === "boolean") {
          layout.openSections[section] = input.openSections[section];
        }
      }
    }

    return layout;
  }

  /**
   * Get state of a section
   * @param id Section ID
   * @param defaultValue Default state value
   * @returns Whether the section is open
   */
  getSectionState(id: string, defaultValue?: boolean) {
    return this.get().openSections[id] ?? defaultValue ?? false;
  }

  /**
   * Set the state of a section
   * @param id Section ID
   * @param value New state value
   * @param defaultValue Default state value
   */
  setSectionState(id: string, value: boolean, defaultValue?: boolean) {
    this.set("openSections", id, value === defaultValue ? undefined! : value);
  }

  /**
   * Toggle state of a section
   * @param id Section ID
   * @param defaultValue Default state value
   */
  toggleSectionState(id: string, defaultValue?: boolean) {
    this.setSectionState(
      id,
      !this.getSectionState(id, defaultValue),
      defaultValue
    );
  }
}
