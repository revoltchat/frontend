import { Accessor, createContext, onCleanup, useContext, type JSXElement } from "solid-js";

import type { Client, User } from "revolt.js";

import ClientController from "./Controller";
import { State } from "@revolt/state";

export type { default as ClientController } from "./Controller";

const clientContext = createContext(null! as ClientController);

/**
 * Mount the modal controller
 */
export function ClientContext(props: { state: State, children: JSXElement }) {
  const controller = new ClientController(props.state);
  onCleanup(() => controller.dispose());

  return (
    <clientContext.Provider value={controller}>
      {props.children}
    </clientContext.Provider>
  );
}

/**
 * Get various lifecycle objects
 * @returns Lifecycle information
 */
export function useClientLifecycle() {
  const { login, logout, selectUsername, lifecycle, isLoggedIn, isError } = useContext(clientContext);

  return {
    login, logout, selectUsername, lifecycle, isLoggedIn, isError
  }
}

/**
 * Get the currently active client if one is available
 * @returns Revolt.js Client
 */
export function useClient(): Accessor<Client> {
  const controller = useContext(clientContext);
  return () => controller.getCurrentClient()!;
}

/**
 * Get the currently logged in user
 * @returns User
 */
export function useUser(): Accessor<User | undefined> {
  const controller = useContext(clientContext);
  return () => controller.getCurrentClient()!.user;
}

/**
 * Plain API client with no authentication
 * @returns API Client
 */
export function useApi() {
  return useContext(clientContext).api;
}

export const IS_DEV = import.meta.env.DEV;
