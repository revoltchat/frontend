import { Accessor, Setter, createSignal } from "solid-js";

import { ReactiveMap } from "@solid-primitives/map";
import { detect } from "detect-browser";
import { API, Client } from "revolt.js";
import type { PrivateSession } from "revolt.js";

import {
  CONFIGURATION,
  getController,
  registerController,
} from "@revolt/common";
import { state } from "@revolt/state";

/**
 * Controls lifecycle of clients
 */
export default class ClientController {
  /**
   * API Client
   */
  readonly api: API.API;

  /**
   * Clients
   */
  #clients: ReactiveMap<string, Client>;

  /**
   * Currently active user ID
   */
  readonly activeId: Accessor<string | undefined>;

  /**
   * Set the currently active user ID
   */
  #setActiveId: Setter<string>;

  /**
   * Construct new client controller
   */
  constructor() {
    this.api = new API.API({
      baseURL: CONFIGURATION.DEFAULT_API_URL,
    });

    this.#clients = new ReactiveMap();

    const [active, setActive] = createSignal<string>();
    this.activeId = active;
    this.#setActiveId = setActive;

    registerController("client", this);
  }

  /**
   * Get the currently in-use client
   * @returns Client
   */
  getCurrentClient() {
    return this.activeId() ? this.#clients.get(this.activeId()!) : undefined;
  }

  /**
   * Check whether we are logged in right now
   * @returns Whether we are logged in
   */
  isLoggedIn() {
    return typeof this.activeId() === "string";
  }

  /**
   * Check whether we are currently ready
   * @returns Whether we are ready to render
   */
  isReady() {
    return this.#clients.get(this.activeId()!)?.ready();
  }

  /**
   * Create a new client with the given credentials
   * @param session Session
   */
  createClient(session: PrivateSession) {
    if (typeof session === "string") throw "Bot login not supported";
    if (this.#clients.get(session.user_id)) throw "User client already exists";

    const client = new Client({
      baseURL: CONFIGURATION.DEFAULT_API_URL,
      debug: import.meta.env.DEV,
      syncUnreads: true,
      /**
       * Check whether a channel is muted
       * @param channel Channel
       * @returns Whether it is muted
       */
      channelIsMuted(channel) {
        return getController("state").notifications.isMuted(channel);
      },
    });

    client.useExistingSession(session);

    this.#clients.set(session.user_id, client);
    this.#setActiveId(session.user_id);
  }

  /**
   * Switch to another user session
   * @param userId Target User ID
   */
  switchAccount(userId: string) {
    if (!this.#clients.has(userId)) throw "Invalid session.";
    this.#setActiveId(userId);
  }

  /**
   * Login given a set of credentials
   * @param credentials Credentials
   */
  async login(credentials: API.DataLogin) {
    const browser = detect();

    // Generate a friendly name for this browser
    let friendly_name;
    if (browser) {
      let { name, os } = browser as { name: string; os: string };
      if (name === "ios") {
        name = "safari";
      } else if (name === "fxios") {
        name = "firefox";
      } else if (name === "crios") {
        name = "chrome";
      } else if (os === "Mac OS" && navigator.maxTouchPoints > 0) {
        os = "iPadOS";
      }

      friendly_name = `Revolt Web (${name} on ${os})`;
    } else {
      friendly_name = "Revolt Web (Unknown Device)";
    }

    // Try to login with given credentials
    let session = await this.api.post("/auth/session/login", {
      ...credentials,
      friendly_name,
    });

    // Prompt for MFA verification if necessary
    if (session.result === "MFA") {
      const { allowed_methods } = session;
      while (session.result === "MFA") {
        const mfa_response: API.MFAResponse | undefined = await new Promise(
          (callback) =>
            getController("modal").push({
              type: "mfa_flow",
              state: "unknown",
              available_methods: allowed_methods,
              callback,
            })
        );

        if (typeof mfa_response === "undefined") {
          break;
        }

        try {
          session = await this.api.post("/auth/session/login", {
            mfa_response,
            mfa_ticket: session.ticket,
            friendly_name,
          });
        } catch (err) {
          console.error("Failed login:", err);
        }
      }

      if (session.result === "MFA") {
        throw "Cancelled";
      }
    }

    if (session.result === "Disabled") {
      // TODO
      alert("Account is disabled, run special logic here.");
      return;
    }

    state.auth.setSession(session);
    this.createClient(session);
  }
}
