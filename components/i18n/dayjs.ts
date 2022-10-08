import dayJS from "dayjs";

import calendar from "dayjs/plugin/calendar";
import localizedFormat from "dayjs/plugin/localizedFormat";

/**
 * Export our dayjs function
 */
export const dayjs = dayJS;

dayjs.extend(calendar);
dayjs.extend(localizedFormat);
