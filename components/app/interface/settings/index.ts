import { RenderClientSettings, clientSettingsList } from "./client";

export { Settings } from "./Settings";

export const SettingsConfigurations = {
  client: {
    listing: clientSettingsList,
    render: RenderClientSettings,
  },
};
