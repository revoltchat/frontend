import { CONFIGURATION, getController } from "@revolt/common";

import { State } from "..";

import { AbstractStore } from ".";

interface Session {
  token: string;
  user_id: string;
}

interface Account {
  session: Session;
  apiUrl?: string;
}

export type TypeAuth = {
  /**
   * Record of user IDs to account information
   */
  sessions: Record<string, Account>;
};

/**
 * Authentication details store
 */
export class Auth extends AbstractStore<"auth", TypeAuth> {
  /**
   * Construct store
   * @param state State
   */
  constructor(state: State) {
    super(state, "auth");
  }

  /**
   * Hydrate external context
   */
  hydrate(): void {
    if (import.meta.env.VITE_TOKEN && import.meta.env.VITE_USER_ID) {
      this.setSession(
        {
          token: import.meta.env.VITE_TOKEN!,
          user_id: import.meta.env.VITE_USER_ID!,
        },
        CONFIGURATION.DEFAULT_API_URL!
      );
    }

    const clientController = getController("client");

    for (const entry of this.getAccounts()) {
      // clientController.addSession(entry, "existing");
      clientController.createClient(entry.session);
    }

    /*clientController.pickNextSession();*/
  }

  /**
   * Generate default values
   */
  default(): TypeAuth {
    return {
      sessions: {},
    };
  }

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
  clean(input: Partial<TypeAuth>): TypeAuth {
    const sessions: TypeAuth["sessions"] = {};
    const originalSessions = (input.sessions ?? {}) as TypeAuth["sessions"];

    for (const userId of Object.keys(originalSessions)) {
      const entry = originalSessions[userId];

      if (
        typeof entry.session.token === "string" &&
        ["string", "undefined"].includes(typeof entry.apiUrl)
      ) {
        sessions[userId] = {
          session: {
            user_id: userId,
            token: entry.session.token,
          },
          apiUrl: entry.apiUrl,
        };
      }
    }

    return {
      sessions,
    };
  }

  /**
   * Get all known accounts.
   * @returns Array of accounts
   */
  getAccounts() {
    const sessions = this.get().sessions;
    return Object.keys(sessions).map((key) => sessions[key]);
  }

  /**
   * Add a new session to the auth manager.
   * @param session Session
   * @param apiUrl Custom API URL
   */
  setSession(session: Session, apiUrl?: string) {
    this.set("sessions", session.user_id, { session, apiUrl });
  }

  /**
   * Remove existing session by user ID.
   * @param userId User ID tied to session
   */
  removeSession(userId: string) {
    this.set("sessions", userId, undefined!);
  }
}
