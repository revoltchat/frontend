import { useClient } from "@revolt/client";
import { state } from "@revolt/state";
import { Avatar, Column, Typography } from "@revolt/ui";
import { createEffect, createSignal, For, on } from "solid-js";

export function Reports() {
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
              onClick={() => {
                state.admin.cacheReport(report);
                state.admin.addTab({
                  title: `Report: ${report._id}`,
                  type: "report",
                  id: report._id,
                });
              }}
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
