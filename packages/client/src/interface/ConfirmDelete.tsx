import { getController } from "@revolt/common";
import { createEffect, createMemo, createResource, createSignal, onMount, Show, Suspense } from "solid-js";
import { useParams } from "@solidjs/router";
import { Modal, Preloader } from "@revolt/ui";
import { styled } from "styled-system/jsx";
import { BiRegularCheck } from "solid-icons/bi";

const Centre = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'center'
  }
});

export function ConfirmDelete() {
  const params = useParams<{ token: string }>();
  const clientController = getController("client");
  const [deleted] = createResource<boolean | null>( async () => {
    try {
      await clientController.api.put("/auth/account/delete", { token: params.token });
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
  }, {
    initialValue: false
  })

  const title = createMemo(() => {
    if (deleted() === null) return "Deletion failed";

    return deleted() ? "Confirmed deletion" : "Please wait";
  });

  const description = createMemo(() => {
    if (deleted() === null) return "There was an error with your request.";

    if (deleted()) return (
      <>
        Your account will be deleted in 7 days.
        <br />
        You may contact{" "}
        <a href="mailto:contact@revolt.chat">
          Revolt support
        </a>{" "}
        to cancel the request if you wish.
      </>
    )

    return "Contacting the server."
  })

  return (
    <Modal
      show
      title={title()}
      description={description()}
      nonDismissable
    >
      <Suspense fallback={<Preloader type="ring" />}>
        <Show when={deleted()} keyed>
          <Centre>
            <BiRegularCheck size={48} />
          </Centre>
        </Show>
      </Suspense>
    </Modal>
  )
}