import { Match, Switch } from "solid-js";

import { useMutation } from "@tanstack/solid-query";
import { Message } from "revolt.js";
import { styled } from "styled-system/jsx";

import { useModals } from "@revolt/modal";
import { useState } from "@revolt/state";
import { Text, TextField } from "@revolt/ui";

export function EditMessage(props: { message: Message }) {
  const state = useState();
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
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            saveMessage(e.currentTarget.value);
          }
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
