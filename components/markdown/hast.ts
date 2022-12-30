import { passThroughComponents } from "./plugins/remarkRegexComponent";
import { timestampHandler } from "./plugins/timestamps";

export const handlers = {
  ...passThroughComponents("uemoji", "spoiler", "mention", "channel"),
  timestamp: timestampHandler,
};
