import { useClient } from "@revolt/client";
import { Avatar, Column, Typography } from "@revolt/ui";
import { createEffect, createSignal, For, on } from "solid-js";
import { TabProps } from "../Admin";

export function Reports(props: Pick<TabProps<"reports">, "openTab">) {
  const client = useClient();
  const [reports, setReports] = createSignal<any>();

  createEffect(() => {
    client.api.get("/safety/reports" as any).then(setReports);
  });

  return (
    <Column>
      <Typography variant="legacy-settings-title">Reports</Typography>
      <For each={reports()}>
        {(report: any) => {
          const user = () => client.users.get(report.author_id);

          return (
            <span
              style="color: white;"
              onClick={() =>
                props.openTab({
                  title: `Report: ${report._id}`,
                  type: "report",
                  report,
                })
              }
            >
              <Avatar size={32} src={user()?.avatarURL} />
              {user()?.username}
              {JSON.stringify(report, undefined, "\t")}
            </span>
          );
        }}
      </For>
    </Column>
  );
}
