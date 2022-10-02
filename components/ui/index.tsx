/* components > common */
export { Masks } from "./components/common/Masks";
export * from "./components/common/ScrollContainers";

/* components > design > atoms */
export { Avatar } from "./components/design/atoms/display/Avatar";
export { Typography } from "./components/design/atoms/display/Typography";
export { UserStatus } from "./components/design/atoms/indicators/UserStatus";
export { FormGroup } from "./components/design/atoms/display/FormGroup";
export * from "./components/design/atoms/inputs";
export * from "./components/design/atoms/indicators";

/* components > design > messaging */
export { Info } from "./components/design/messaging/Info";
export { Message } from "./components/design/messaging/Message";

/* components > design > layout */
export { Column } from "./components/design/layout/Column";
export { Row } from "./components/design/layout/Row";

/* components > poppers */
export * from "./components/poppers/Tooltip";

/* components > navigation */
export { ServerList } from "./components/navigation/servers/ServerList";
export { ServerSidebar } from "./components/navigation/channels/ServerSidebar";

/* solid-styled-components exports */
export { ThemeProvider, styled } from "solid-styled-components";

/* themes */
export { revoltDark } from "./themes/RevoltDark";
export { GlobalStyles } from "./themes/GlobalStyles";

/* solid.js custom directives */
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      customTooltip: string;
    }
  }
}


/* TODO: temporary */
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import format from "dayjs/plugin/localizedFormat";
import update from "dayjs/plugin/updateLocale";

dayjs.extend(calendar);
dayjs.extend(format);
dayjs.extend(update);

export { dayjs };