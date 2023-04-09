import { Accessor, Setter, createSignal } from "solid-js";

import { ReactiveMap } from "@solid-primitives/map";
import { API, Client, Session } from "revolt.js";

import {
  CONFIGURATION,
  getController,
  registerController,
} from "@revolt/common";

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
    return this.isLoggedIn()
      ? this.#clients.get(this.activeId()!)!.ready()
      : false;
  }

  /**
   * Create a new client with the given credentials
   * @param session Session
   */
  createClient(session: Session) {
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
}
