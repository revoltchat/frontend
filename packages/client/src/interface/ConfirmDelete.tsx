import { BiRegularCheck } from "solid-icons/bi";
import { Show, Suspense, createMemo, createResource } from "solid-js";

import { useParams } from "@solidjs/router";
import { styled } from "styled-system/jsx";

import { Modal, Preloader } from "@revolt/ui";
import { useApi } from "@revolt/client";

const Centre = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
  },
});

export function ConfirmDelete() {
  const api = useApi();
  const params = useParams<{ token: string }>();

  const [deleted] = createResource<boolean | null>(
    async () => {
      try {
        await api.put("/auth/account/delete", {
          token: params.token,
        });
        return true;
      } catch (e) {
        /*
      createResource cannot handle thrown errors without ErrorBoundary,
      so we wrangle states manually

      null - error
      true - deleted
      false - initial
       */
        return null;
      }
    },
    {
      initialValue: false,
    },
  );

  const title = createMemo(() => {
    if (deleted() === null) return "missing i18n";

    return deleted() ? "missing i18n" : "missing i18n";
  });

  const description = createMemo(() => {
    if (deleted() === null) return "missing i18n";

    if (deleted())
      return (
        <>
          {"missing i18n"}
          <br />
          {"missing i18n"}{" "}
          <a href="mailto:contact@revolt.chat">{"missing i18n"}</a>{" "}
          {"missing i18n"}
        </>
      );

    return "missing i18n";
  });

  return (
    <Modal show title={title()} description={description()} nonDismissable>
      <Suspense fallback={<Preloader type="ring" />}>
        <Show when={deleted()} keyed>
          <Centre>
            <BiRegularCheck size={48} />
          </Centre>
        </Show>
      </Suspense>
    </Modal>
  );
}
