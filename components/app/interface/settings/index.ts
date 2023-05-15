import { Accessor, JSX } from "solid-js";

import client from "./client";

export { Settings } from "./Settings";

export type SettingsConfiguration = {
  /**
   * Generate list of categories and entries
   * @returns List
   */
  list: () => SettingsList;

  /**
   * Render the title of the current breadcrumb key
   * @param key Key
   */
  title: (key: string) => string;

  /**
   * Render the current settings page
   * @param props State information
   */
  render: (props: { page: Accessor<undefined | string> }) => JSX.Element;
};

/**
 * List of categories and entries
 */
export type SettingsList = {
  title?: JSX.Element;
  entries: SettingsEntry[];
}[];

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

export const SettingsConfigurations: Record<string, SettingsConfiguration> = {
  client,
};
