import ClientController from "./Controller";

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
