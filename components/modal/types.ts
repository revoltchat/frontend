import { API, Client, User, Member, Channel, Server, Message } from "revolt.js";
import { ChangelogPost } from "./modals/Changelog";
import type { ComponentProps } from "solid-js";
import type { Modal } from "@revolt/ui";

export type Modals =
  | {
      type: "add_friend" | "create_group" | "create_server" | "custom_status";
      client: Client;
    }
  | {
      type: "signed_out";
    }
  | ({
      type: "mfa_flow";
    } & (
      | {
          state: "known";
          client: Client;
          callback: (ticket?: API.MFATicket) => void;
        }
      | {
          state: "unknown";
          available_methods: API.MFAMethod[];
          callback: (response?: API.MFAResponse) => void;
        }
    ))
  | { type: "mfa_recovery"; codes: string[]; client: Client }
  | {
      type: "mfa_enable_totp";
      identifier: string;
      secret: string;
      callback: (code?: string) => void;
    }
  | {
      type: "out_of_date";
      version: string;
    }
  | {
      type: "changelog";
      initial?: number;
      posts: ChangelogPost[];
    }
  | {
      type: "sign_out_sessions";
      client: Client;
      onDelete: () => void;
      onDeleting: () => void;
    }
  | {
      type: "show_token";
      name: string;
      token: string;
    }
  | {
      type: "error";
      error: string;
    }
  | {
      type: "clipboard";
      text: string;
    }
  | {
      type: "link_warning";
      link: string;
      callback: () => true;
    }
  | {
      type: "pending_friend_requests";
      users: User[];
    }
  | {
      type: "modify_account";
      client: Client;
      field: "username" | "email" | "password";
    }
  | {
      type: "server_identity";
      member: Member;
    }
  | {
      type: "channel_info";
      channel: Channel;
    }
  | {
      type: "server_info";
      server: Server;
    }
  | {
      type: "image_viewer";
      embed?: API.Image;
      attachment?: API.File;
    }
  | {
      type: "user_picker";
      omit?: string[];
      callback: (users: string[]) => Promise<void>;
    }
  | {
      type: "user_profile";
      user_id: string;
      isPlaceholder?: boolean;
      placeholderProfile?: API.UserProfile;
    }
  | {
      type: "create_bot";
      client: Client;
      onCreate: (bot: API.Bot) => void;
    }
  | {
      type: "onboarding";
      callback: (username: string, loginAfterSuccess?: true) => Promise<void>;
    }
  | {
      type: "create_role";
      server: Server;
      callback: (id: string) => void;
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
      type: "delete_channel";
      channel: Channel;
    }
  | {
      type: "create_invite";
      channel: Channel;
    }
  | {
      type: "leave_server";
      server: Server;
    }
  | {
      type: "delete_server";
      server: Server;
    }
  | {
      type: "delete_bot";
      bot: string;
      name: string;
      cb?: () => void;
    }
  | {
      type: "delete_message";
      message: Message;
    }
  | {
      type: "kick_member";
      member: Member;
    }
  | {
      type: "ban_member";
      member: Member;
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
      type: "create_channel";
      server: Server;
      cb?: (channel: Channel) => void;
    }
  | {
      type: "create_category";
      server: Server;
    }
  | {
      type: "import_theme";
    };

export type ModalProps<T extends Modals["type"]> = Modals & { type: T };
export type ReturnType = ComponentProps<typeof Modal>;
export type PropGenerator<T extends Modals["type"]> = (
  props: ModalProps<T>,
  onClose: () => void
) => ReturnType;
