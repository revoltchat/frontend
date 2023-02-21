import ClientController from "./Controller";

export { mapAnyError } from "./error";

/**
 * Global client controller
 */
export const clientController = new ClientController();

/**
 * Get the currently active session.
 * @returns Session
 */
export function useSession() {
  return clientController.getActiveSession();
}

/**
 * Get the currently active client or an unauthorised
 * client for API requests, whichever is available.
 * @returns Revolt.js Client
 */
export function useClient() {
  return clientController.getAvailableClient();
}

/**
 * Get unauthorised client for API requests.
 * @returns Revolt.js Client
 */
export function useApi() {
  return clientController.getAnonymousClient().api;
}

export const IS_REVOLT =
  import.meta.env.VITE_API_URL === "https://api.revolt.chat" ||
  // future proofing
  import.meta.env.VITE_API_URL === "https://app.revolt.chat/api" ||
  import.meta.env.VITE_API_URL === "https://revolt.chat/api";

export const IS_DEV = import.meta.env.DEV;
