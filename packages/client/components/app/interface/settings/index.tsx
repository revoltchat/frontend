import { Accessor, JSX } from "solid-js";

import channel from "./ChannelSettings";
import server from "./ServerSettings";
import { Settings, SettingsProps } from "./Settings";
import user from "./UserSettings";

export { Settings } from "./Settings";

export type SettingsConfiguration<T> = {
  /**
   * Generate list of categories and entries
   * @returns List
   */
  list: (context: T) => SettingsList;

  /**
   * Render the title of the current breadcrumb key
   * @param ctx Context from settings list
   * @param key Key
   */
  title: (ctx: SettingsList, key: string) => string;

  /**
   * Render the current settings page
   * @param props State information
   */
  render: (
    props: { page: Accessor<undefined | string> },
    context: T,
  ) => JSX.Element;
};

/**
 * List of categories and entries
 */
export type SettingsList = {
  prepend?: JSX.Element;
  append?: JSX.Element;
  entries: {
    hidden?: boolean;
    title?: JSX.Element;
    entries: SettingsEntry[];
  }[];
};

/**
 * Individual settings entry
 */
export type SettingsEntry = {
  id?: string;
  href?: string;
  onClick?: () => void;

  hidden?: boolean;

  icon: JSX.Element;
  title: JSX.Element;
};

export const SettingsConfigurations: Record<
  string,
  SettingsConfiguration<never>
> = {
  user,
  server,
  channel,
};
