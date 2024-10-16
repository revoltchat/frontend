import { getController } from "@revolt/common";
import { createEffect, createMemo, createResource, createSignal, onMount, Show, Suspense } from "solid-js";
import { useParams } from "@solidjs/router";
import { Modal, Preloader } from "@revolt/ui";
import { styled } from "styled-system/jsx";
import { BiRegularCheck } from "solid-icons/bi";
import { useTranslation } from "@revolt/i18n";

const Centre = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'center'
  }
});

const i18nScope = 'app.settings.pages.account.delete';

export function ConfirmDelete() {
  const t = useTranslation();
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
    if (deleted() === null) return t(`${i18nScope}.error.title`);

    return deleted() ? t(`${i18nScope}.success.title`) : t(`${i18nScope}.loading.title`);
  });

  const description = createMemo(() => {
    if (deleted() === null) return t(`${i18nScope}.error.description`);

    if (deleted()) return (
      <>
        {t(`${i18nScope}.success.description.header`)}
        <br />
        {t(`${i18nScope}.success.description.paragraph_first`)}{" "}
        <a href="mailto:contact@revolt.chat">
          {t(`${i18nScope}.success.description.support`)}
        </a>{" "}
        {t(`${i18nScope}.success.description.paragraph_second`)}
      </>
    )

    return t(`${i18nScope}.loading.description`)
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