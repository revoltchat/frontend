import { For, createEffect, createSignal } from "solid-js";

import { API } from "revolt.js";

import { useClient } from "@revolt/client";
import { state } from "@revolt/state";
import { Avatar, Column, Typography } from "@revolt/ui";

export function Reports() {
  const client = useClient();
  const [reports, setReports] = createSignal<API.Report[]>([]);

  createEffect(() => {
    client.api.get("/safety/reports").then((reports) => {
      for (let report of reports) {
        state.admin.cacheReport(report);
      }

      setReports(reports);
    });
  });

  const createdReports = () =>
    reports().filter((report) => report.status === "Created");

  return (
    <Column>
      <Typography variant="legacy-settings-title">Reports</Typography>
      <For each={createdReports()}>
        {(report) => {
          const user = () => client.users.get(report.author_id);

          return (
            <span
              style="color: white;"
              onClick={() => {
                state.admin.addTab({
                  title: `Report: ${report._id.substring(20, 26)}`,
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
