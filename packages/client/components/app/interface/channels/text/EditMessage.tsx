import { Match, Switch } from "solid-js";

import { useMutation } from "@tanstack/solid-query";
import { Message } from "revolt.js";
import { styled } from "styled-system/jsx";

import { useClient } from "@revolt/client";
import { useModals } from "@revolt/modal";
import { useState } from "@revolt/state";
import { Text, TextField } from "@revolt/ui";

export function EditMessage(props: { message: Message }) {
  const state = useState();
  const client = useClient();
  const { openModal } = useModals();

  const change = useMutation(() => ({
    mutationFn: (content: string) => props.message.edit({ content }),
    onSuccess() {
      state.draft.setEditingMessage(undefined);
    },
    onError(error) {
      openModal({ type: "error2", error });
    },
  }));

  function saveMessage(content: string) {
    if (content.length) {
      // bring focus back to main composition
      document.getElementById("msgbox")?.focus();

      change.mutate(content);
    } else {
      openModal({
        type: "delete_message",
        message: props.message,
      });
    }
  }

  return (
    <>
      <TextField
        ref={(el) =>
          el.parentElement?.parentElement?.parentElement?.scrollIntoView({
            behavior: "instant",
            block: "center",
          })
        }
        autoFocus
        autosize
        max-rows={10}
        enterkeyhint="enter"
        variant="outlined"
        disabled={change.isPending}
        value={state.draft.editingMessageContent}
        onChange={(e) =>
          state.draft.setEditingMessageContent(e.currentTarget.value)
        }
        use:autoComplete={{
          client: client(),
          onKeyDown(e) {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              saveMessage(e.currentTarget.value);
            }

            if (e.key === "Escape") {
              state.draft.setEditingMessage(undefined);
            }
          },
          searchSpace: props.message.channel?.server
            ? {
                members: client().serverMembers.filter(
                  (member) =>
                    member.id.server === props.message.channel!.serverId,
                ),
                channels: props.message.channel!.server.channels,
                roles: [...props.message.channel!.server.roles.values()],
              }
            : props.message.channel?.type === "Group"
              ? { users: props.message.channel.recipients, channels: [] }
              : { channels: [] },
        }}
      />

      <Switch
        fallback={
          <Text size="small">
            escape to{" "}
            <Action onClick={() => state.draft.setEditingMessage(undefined)}>
              cancel
            </Action>{" "}
            &middot; enter to{" "}
            <Action
              onClick={() => saveMessage(state.draft.editingMessageContent!)}
            >
              save
            </Action>
          </Text>
        }
      >
        <Match when={change.isPending}>
          <Text size="small">Saving message...</Text>
        </Match>
      </Switch>
    </>
  );
}

const Action = styled("span", {
  base: {
    fontWeight: 600,
    cursor: "pointer",
    color: "var(--md-sys-color-primary)",
  },
});
