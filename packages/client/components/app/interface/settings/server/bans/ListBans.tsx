import { For, Match, Switch } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { t } from "@lingui/core/macro";
import { useQuery, useQueryClient } from "@tanstack/solid-query";
import { Server, ServerBan } from "revolt.js";

import { useModals } from "@revolt/modal";
import { Avatar, Button, CircularProgress, DataTable, Row } from "@revolt/ui";

import MdDelete from "@material-design-icons/svg/outlined/delete.svg?component-solid";

/**
 * List and invalidate server bans
 */
export function ListServerBans(props: { server: Server }) {
  const client = useQueryClient();
  const { showError } = useModals();
  const query = useQuery(() => ({
    queryKey: ["bans", props.server.id],
    queryFn: () => props.server.fetchBans() as Promise<ServerBan[]>,
  }));

  function pardon(ban: ServerBan) {
    ban
      .pardon()
      .then(() =>
        client.setQueryData(
          ["bans", props.server.id],
          query.data!.filter((entry) => entry.id.user !== ban.id.user),
        ),
      )
      .catch(showError);
  }

  return (
    <DataTable
      columns={[<Trans>User</Trans>, <Trans>Reason</Trans>, <></>]}
      itemCount={query.data?.length}
    >
      {(page, itemsPerPage) => (
        <Switch>
          <Match when={query.isLoading}>
            <DataTable.Row>
              <DataTable.Cell colspan={3}>
                <CircularProgress />
              </DataTable.Cell>
            </DataTable.Row>
          </Match>
          <Match when={query.data}>
            <For
              each={query.data!.slice(
                page * itemsPerPage,
                page * itemsPerPage + itemsPerPage,
              )}
            >
              {(item) => (
                <DataTable.Row>
                  <DataTable.Cell>
                    <Row align>
                      <Avatar
                        src={item.user?.avatar?.url}
                        fallback={item.user?.username}
                        size={32}
                      />
                      <span>
                        {item.user?.username}#{item.user?.discriminator}
                      </span>
                    </Row>
                  </DataTable.Cell>
                  <DataTable.Cell>{item.reason}</DataTable.Cell>
                  <DataTable.Cell width="40px">
                    <Button
                      size="icon"
                      variant="secondary"
                      use:floating={{
                        tooltip: {
                          placement: "bottom",
                          content: t`Pardon User`,
                        },
                      }}
                      onPress={() => pardon(item)}
                    >
                      <MdDelete />
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
              )}
            </For>
          </Match>
        </Switch>
      )}
    </DataTable>
  );
}
