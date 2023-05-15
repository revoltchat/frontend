import {
  RenderClientSettings,
  clientSettingsList,
  clientSettingsTitle,
} from "./client";

export { Settings } from "./Settings";

export const SettingsConfigurations = {
  client: {
    title: clientSettingsTitle,
    listing: clientSettingsList,
    render: RenderClientSettings,
  },
};
