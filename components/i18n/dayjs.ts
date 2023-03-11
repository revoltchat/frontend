import dayJS from "dayjs";
import calendar from "dayjs/plugin/calendar";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

/**
 * Export our dayjs function
 */
export const dayjs = dayJS;

dayjs.extend(calendar);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
