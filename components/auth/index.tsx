import dayjs from "dayjs";

export function Test() {
  return <h1>now: {dayjs().toISOString()}</h1>;
}
