import { createSignal, onCleanup } from "solid-js";

import { dayjs } from "@revolt/i18n";

interface Props {
  value: number | Date | string;
  format: "calendar" | "relative" | "time";
  referenceTime?: number | Date | string;
}

export function formatTime(props: Props) {
  switch (props.format) {
    case "calendar":
      return dayjs(props.value).calendar(props.referenceTime);
    case "relative":
      return dayjs(props.value).fromNow();
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
