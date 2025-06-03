import type { ComponentProps, JSX } from "solid-js";

import {
  API,
  Bot,
  Channel,
  Client,
  File,
  MFA,
  MFATicket,
  Message,
  Server,
  ServerMember,
  Session,
  User,
} from "revolt.js";

import type { SettingsConfigurations } from "@revolt/app";
import type { KeyComboSequence, KeybindAction } from "@revolt/keybinds";
import type { Modal } from "@revolt/ui";

import { ChangelogPost } from "./modals/Changelog";

export type Modals =
  | {
      type: "add_friend";
      client: Client;
    }
  | {
      type: "ban_member";
      member: ServerMember;
    }
  | {
      type: "changelog";
      initial?: number;
      posts: ChangelogPost[];
    }
  | {
      type: "channel_info";
      channel: Channel;
    }
  | {
      type: "channel_toggle_mature";
      channel: Channel;
    }
  | {
      type: "create_bot";
      client: Client;
      onCreate: (bot: Bot) => void;
    }
  | {
      type: "create_category";
      server: Server;
    }
  | {
      type: "create_channel";
      server: Server;
      cb?: (channel: Channel) => void;
    }
  | {
      type: "create_group";
      client: Client;
    }
  | {
      type: "create_invite";
      channel: Channel;
    }
  | {
      type: "create_role";
      server: Server;
      callback: (id: string) => void;
    }
  | {
      type: "create_server";
      client: Client;
    }
  | {
      type: "create_or_join_server";
      client: Client;
    }
  | {
      type: "custom_status";
      client: Client;
    }
  | {
      type: "delete_bot";
      bot: Bot;
    }
  | {
      type: "delete_channel";
      channel: Channel;
    }
  | {
      type: "delete_message";
      message: Message;
    }
  | {
      type: "delete_server";
      server: Server;
    }
  | {
      type: "edit_display_name";
      user: User;
    }
  | {
      type: "edit_email";
      client: Client;
    }
  | {
      type: "edit_password";
      client: Client;
    }
  | {
      type: "edit_username";
      client: Client;
    }
  | {
      /**
       * @deprecated build proper error handling!
       */
      type: "error";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any;
    }
  | {
      type: "error2";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any;
    }
  | {
      type: "image_viewer";
      embed?: API.Image;
      file?: File;
    }
  | {
      type: "join_server";
      client: Client;
    }
  | {
      type: "edit_keybind";
      action: KeybindAction;
      onSubmit: (sequence: KeyComboSequence) => void;
    }
  | {
      type: "kick_member";
      member: ServerMember;
    }
  | {
      type: "leave_server";
      server: Server;
    }
  | {
      type: "mfa_enable_totp";
      identifier: string;
      secret: string;
      callback: (code?: string) => void;
    }
  | ({
      type: "mfa_flow";
    } & (
      | {
          mfa: MFA;
          state: "known";
          callback: (ticket?: MFATicket) => void;
        }
      | {
          state: "unknown";
          available_methods: API.MFAMethod[];
          callback: (response?: API.MFAResponse) => void;
        }
    ))
  | { type: "mfa_recovery"; codes: string[]; mfa: MFA }
  | {
      type: "onboarding";
      callback: (username: string, loginAfterSuccess?: true) => Promise<void>;
    }
  | {
      type: "rename_session";
      session: Session;
    }
  | {
      type: "report_content";
      client: Client;
      target: Server | User | Message;
      contextMessage?: Message;
    }
  | {
      type: "server_identity";
      member: ServerMember;
    }
  | {
      type: "server_info";
      server: Server;
    }
  | {
      type: "settings";
      config: keyof typeof SettingsConfigurations;
      // eslint-disable-next-line
      context?: any;
    }
  | {
      type: "signed_out";
    }
  | {
      type: "sign_out_sessions";
      client: Client;
    }
  // unimplemented: (modals.tsx#L58)
  | {
      type: "report_success";
      user?: User;
    }
  | {
      type: "out_of_date";
      version: string;
    }
  | {
      type: "show_token";
      name: string;
      token: string;
    }
  | {
      type: "link_warning";
      link: string;
      callback: () => true;
    }
  // | {
  //     type: "pending_friend_requests";
  //     users: User[];
  //   }
  | {
      type: "user_picker";
      omit?: string[];
      callback: (users: string[]) => Promise<void>;
    }
  | {
      type: "user_profile";
      user: User;
      isPlaceholder?: boolean;
      placeholderProfile?: API.UserProfile;
    }
    | {
      type: 'user_profile_roles';
      member: ServerMember;
    }
  | {
      type: "leave_group";
      channel: Channel;
    }
  | {
      type: "close_dm";
      channel: Channel;
    }
  | {
      type: "unfriend_user";
      user: User;
    }
  | {
      type: "block_user";
      user: User;
    }
  | {
      type: "import_theme";
    };

export type ModalProps<T extends Modals["type"]> = Modals & { type: T };
export type ReturnType =
  | ComponentProps<typeof Modal>
  | {
      _children: (props: { show: boolean; onClose: () => void }) => JSX.Element;
    };
export type PropGenerator<T extends Modals["type"]> = (
  props: ModalProps<T>,
  onClose: () => void,
) => ReturnType;
