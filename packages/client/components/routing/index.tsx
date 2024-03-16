import { Accessor } from "solid-js";

import { useLocation } from "@solidjs/router";

/**
 * We re-export everything to prevent us importing @solidjs/router
 * more than once in the project, this can cause some weird behaviour
 * where it can't find the context. This is a side-effect of working
 * in a monorepo. Ideally, this should be done any time we import
 * a new library that is used in multiple components.
 */
export {
  Link,
  Navigate,
  Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
  useBeforeLeave,
  hashIntegration,
  memoryIntegration,
} from "@solidjs/router";

const RE_SERVER = /\/server\/([A-Z0-9]{26})/;
const RE_CHANNEL = /\/channel\/([A-Z0-9]{26})/;
const RE_MESSAGE_ID = /\/channel\/[A-Z0-9]{26}\/([A-Z0-9]{26})/;

/**
 * Route parameters available globally
 */
type GlobalParams = {
  /**
   * Server ID
   */
  serverId?: string;

  /**
   * Channel ID
   */
  channelId?: string;

  /**
   * Message ID
   */
  messageId?: string;
};

/**
 * Generate global params from path
 * @param pathname Path
 * @returns Params
 */
export function paramsFromPathname(pathname: string): GlobalParams {
  const params: GlobalParams = {};

  // Check for server ID
  const server = pathname.match(RE_SERVER);
  if (server) {
    params.serverId = server[1];
  }

  // Check for channel ID
  const channel = pathname.match(RE_CHANNEL);
  if (channel) {
    params.channelId = channel[1];
  }

  // Check for message ID
  const message = pathname.match(RE_MESSAGE_ID);
  if (message) {
    params.messageId = message[1];
  }

  return params;
}

/**
 * Try to resolve route parameters regardless of the current position within component tree
 */
export function useSmartParams(): Accessor<GlobalParams> {
  const location = useLocation();
  return () => paramsFromPathname(location.pathname);
}
