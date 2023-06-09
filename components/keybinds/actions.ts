import { KeySequence } from ".";

export enum KeybindAction {
  NavigateChannelUp = "navigate_channel_up",
  NavigateChannelDown = "navigate_channel_down",
  NavigateServerUp = "navigate_server_up",
  NavigateServerDown = "navigate_server_down",
}

export type KeybindActions = Record<KeybindAction, KeySequence[]>;
