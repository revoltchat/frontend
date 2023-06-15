import {
  BiLogosAndroid,
  BiLogosApple,
  BiLogosWindows,
  BiRegularQuestionMark,
} from "solid-icons/bi";
import MdLogout from "@material-design-icons/svg/outlined/logout.svg?component-solid";
import { FaBrandsLinux } from "solid-icons/fa";
import {
  Accessor,
  For,
  Match,
  Show,
  Switch,
  createMemo,
  onMount,
} from "solid-js";

import { Session } from "revolt.js";

import { useClient } from "@revolt/client";
import { getController } from "@revolt/common";
import {
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  Column,
  Preloader,
  Time,
  styled,
  useTheme,
  iconSize,
} from "@revolt/ui";

/**
 * Sessions
 */
export default function Sessions() {
  const client = useClient();
  onMount(() => client().sessions.fetch());

  /**
   * Sort the other sessions by created date
   */
  const otherSessions = createMemo(() =>
    client()
      .sessions.filter((session) => !session.current)
      .sort((a, b) => +b.createdAt - +a.createdAt)
  );

  return (
    <Column gap="lg">
      <Switch fallback={<Preloader type="ring" />}>
        <Match when={client().sessions.size()}>
          <ManageCurrentSession otherSessions={otherSessions} />
          <ListOtherSessions otherSessions={otherSessions} />
        </Match>
      </Switch>
    </Column>
  );
}

/**
 * Manage user's current session
 */
function ManageCurrentSession(props: { otherSessions: Accessor<Session[]> }) {
  const client = useClient();
  const theme = useTheme();

  /**
   * Resolve current session
   */
  const currentSession = () => client().sessions.get(client().sessionId!);

  return (
    <CategoryButtonGroup>
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

      <Show when={props.otherSessions().length}>
        <CategoryButton
          action="chevron"
          onClick={() =>
            getController("modal").push({
              type: "sign_out_sessions",
              client: client(),
            })
          }
          icon={<MdLogout {...iconSize(24)} fill={theme.scheme.error} />}
          description="Logs you out of all sessions except this device."
        >
          Log Out Other Sessions
        </CategoryButton>
      </Show>
    </CategoryButtonGroup>
  );
}

/**
 * List other logged in sessions
 */
function ListOtherSessions(props: { otherSessions: Accessor<Session[]> }) {
  return (
    <Show when={props.otherSessions().length}>
      <Column>
        <CategoryButtonGroup>
          <For each={props.otherSessions()}>
            {(session) => (
              <CategoryCollapse
                icon={<SessionIcon session={session} />}
                title={<Capitalise>{session.name}</Capitalise>}
                description={
                  <>
                    Created <Time value={session.createdAt} format="relative" />
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
        </CategoryButtonGroup>
      </Column>
    </Show>
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
    <Switch fallback={<BiRegularQuestionMark size={22} />}>
      <Match when={/linux/i.test(props.session?.name ?? "")}>
        <FaBrandsLinux size={22} />
      </Match>
      <Match when={/windows/i.test(props.session?.name ?? "")}>
        <BiLogosWindows size={22} />
      </Match>
      <Match when={/android/i.test(props.session?.name ?? "")}>
        <BiLogosAndroid size={22} />
      </Match>
      <Match when={/mac.*os|i(Pad)?os/i.test(props.session?.name ?? "")}>
        <BiLogosApple size={22} />
      </Match>
    </Switch>
  );
}
