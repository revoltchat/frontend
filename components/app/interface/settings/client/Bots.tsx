import { BiSolidBot } from "solid-icons/bi";
import { For, Match, Show, Switch, createSignal, onMount } from "solid-js";

import { Bot } from "revolt.js";

import { useClient } from "@revolt/client";
import {
  Avatar,
  CategoryButton,
  CategoryButtonGroup,
  Column,
  Preloader,
  Typography,
} from "@revolt/ui";

import { useSettingsNavigation } from "../Settings";

/**
 * Bots
 */
export default function Bots() {
  return (
    <Column gap="xl">
      <CreateBot />
      <ListBots />
    </Column>
  );
}

/**
 * Prompt to create a new bot
 */
function CreateBot() {
  return (
    <CategoryButton
      action="chevron"
      icon={<BiSolidBot size={24} />}
      onClick={() => void 0}
      description="You agree that your bot is subject to the Acceptable Usage Policy."
    >
      Create Bot
    </CategoryButton>
  );
}

/**
 * List owned bots by current user
 */
function ListBots() {
  const client = useClient();
  const { navigate } = useSettingsNavigation();
  const [bots, setBots] = createSignal<Bot[]>();

  onMount(() => {
    if (client().bots.size()) {
      setBots(client().bots.toList());
    } else {
      client().bots.fetchOwned().then(setBots);
    }
  });

  return (
    <Show when={!bots() || bots()!.length !== 0}>
      <Column>
        <Typography variant="label">My Bots</Typography>
        <Switch fallback={<Preloader type="ring" />}>
          <Match when={bots()?.length}>
            <CategoryButtonGroup>
              <For each={bots()}>
                {(bot) => (
                  <CategoryButton
                    icon={
                      <Avatar src={bot.user!.animatedAvatarURL} size={24} />
                    }
                    description={bot.id}
                    onClick={() => navigate(`bots/${bot.id}`)}
                    action="chevron"
                  >
                    {bot.user!.username}
                  </CategoryButton>
                )}
              </For>
            </CategoryButtonGroup>
          </Match>
        </Switch>
      </Column>
    </Show>
  );
}
