import { createSignal, onCleanup } from "solid-js";

import { dayjs } from "@revolt/i18n";

interface Props {
  value: number | Date | string;
  format:
    | "calendar"
    | "date"
    | "dateNormal"
    | "dateAmerican"
    | "iso8601"
    | "relative"
    | "time"
    | "time24"
    | "time12";
  referenceTime?: number | Date | string;
}

export function formatTime(props: Props) {
  switch (props.format) {
    case "calendar":
      return dayjs(props.value).calendar(props.referenceTime);
    case "date":
    case "dateNormal":
      return dayjs(props.value).format("DD/MM/YYYY");
    case "dateAmerican":
      return dayjs(props.value).format("MM/DD/YYYY");
    case "iso8601":
      return dayjs(props.value).format("YYYY-MM-DD");
    case "relative":
      return dayjs(props.value).fromNow();
    case "time12":
      return dayjs(props.value).format("h:mm A");
    case "time24":
    default:
      return dayjs(props.value).format("HH:mm");
  }
}

export function Time(props: Props) {
  const [time, setTime] = createSignal(formatTime(props));

  const timer = setInterval(() => {
    const value = formatTime(props);
    if (value !== time()) {
      setTime(value);
    }
  }, 1000);

  onCleanup(() => clearInterval(timer));

  return <>{time}</>;
}
