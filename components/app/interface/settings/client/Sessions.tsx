import {
  BiLogosAndroid,
  BiLogosApple,
  BiLogosWindows,
  BiRegularQuestionMark,
  BiSolidExit,
} from "solid-icons/bi";
import { FaBrandsLinux } from "solid-icons/fa";
import { For, Match, Show, Switch, createMemo, onMount } from "solid-js";

import { Session } from "revolt.js";

import { useClient } from "@revolt/client";
import { getController } from "@revolt/common";
import {
  CategoryButton,
  CategoryCollapse,
  Column,
  Preloader,
  Time,
  Typography,
  styled,
  useTheme,
} from "@revolt/ui";

/**
 * Sessions
 */
export default function Sessions() {
  const client = useClient();
  const theme = useTheme();

  onMount(() => client().sessions.fetch());

  /**
   * Resolve current session
   */
  const currentSession = () => client().sessions.get(client().sessionId!);

  /**
   * Sort the other sessions by created date
   */
  const otherSessions = createMemo(() =>
    client()
      .sessions.filter((session) => !session.current)
      .sort((a, b) => +b.createdAt - +a.createdAt)
  );

  return (
    <Column gap="xl">
      <Switch fallback={<Preloader type="ring" />}>
        <Match when={client().sessions.size()}>
          <Column>
            <CategoryCollapse
              title="Current Session"
              description={currentSession()?.name}
              icon={<SessionIcon session={currentSession()} />}
            >
              <CategoryButton
                icon="blank"
                action="chevron"
                onClick={() =>
                  currentSession() &&
                  getController("modal").push({
                    type: "rename_session",
                    session: currentSession()!,
                  })
                }
              >
                Rename
              </CategoryButton>
            </CategoryCollapse>

            <Show when={otherSessions().length}>
              <CategoryButton
                action="chevron"
                onClick={() =>
                  getController("modal").push({
                    type: "sign_out_sessions",
                    client: client(),
                  })
                }
                icon={<BiSolidExit size={24} color={theme.colours.error} />}
                description="Logs you out of all sessions except this device."
              >
                Log Out Other Sessions
              </CategoryButton>
            </Show>
          </Column>

          <Show when={otherSessions()}>
            <Column>
              <Typography variant="label">Other Sessions</Typography>
              <For each={otherSessions()}>
                {(session) => (
                  <CategoryCollapse
                    icon={<SessionIcon session={session} />}
                    title={<Capitalise>{session.name}</Capitalise>}
                    description={
                      <>
                        Created{" "}
                        <Time value={session.createdAt} format="relative" />
                      </>
                    }
                  >
                    <CategoryButton
                      icon="blank"
                      action="chevron"
                      onClick={() =>
                        getController("modal").push({
                          type: "rename_session",
                          session,
                        })
                      }
                    >
                      Rename
                    </CategoryButton>
                    <CategoryButton
                      icon="blank"
                      action="chevron"
                      onClick={() => session.delete()}
                    >
                      Log Out
                    </CategoryButton>
                  </CategoryCollapse>
                )}
              </For>
            </Column>
          </Show>
        </Match>
      </Switch>
    </Column>
  );
}

/**
 * Capitalize session titles
 */
const Capitalise = styled.div`
  text-transform: capitalize;
`;

/**
 * Show icon for session
 */
function SessionIcon(props: { session?: Session }) {
  return (
    <Switch fallback={<BiRegularQuestionMark size={24} />}>
      <Match when={/linux/i.test(props.session?.name ?? "")}>
        <FaBrandsLinux size={24} />
      </Match>
      <Match when={/windows/i.test(props.session?.name ?? "")}>
        <BiLogosWindows size={24} />
      </Match>
      <Match when={/android/i.test(props.session?.name ?? "")}>
        <BiLogosAndroid size={24} />
      </Match>
      <Match when={/mac.*os|i(Pad)?os/i.test(props.session?.name ?? "")}>
        <BiLogosApple size={24} />
      </Match>
    </Switch>
  );
}
