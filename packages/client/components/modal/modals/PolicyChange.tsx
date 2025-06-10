import { For, createSignal } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";

import {
  Checkbox2,
  Column,
  List,
  ListItem,
  Modal2,
  Modal2Props,
  Text,
  Time,
} from "@revolt/ui";

import MdPolicy from "@material-design-icons/svg/outlined/policy.svg?component-solid";

import { useModals } from "..";
import { Modals } from "../types";

export function PolicyChangeModal(
  props: Modal2Props & Modals & { type: "policy_change" },
) {
  const { showError } = useModals();
  const [confirm, setConfirm] = createSignal(false);

  return (
    <Modal2
      icon={<MdPolicy />}
      show={props.show}
      onClose={props.onClose}
      title={<Trans>Review policy changes</Trans>}
      actions={[
        { text: <Trans>Close</Trans> },
        {
          text: <Trans>Acknowledge</Trans>,
          isDisabled: !confirm(),
          async onClick() {
            await props.acknowledge().catch(showError);
          },
        },
      ]}
    >
      <Trans>
        Click on the items below to learn more about different changes!
      </Trans>
      <List>
        <For each={props.changes}>
          {(change) => (
            <ListItem onClick={() => window.open(change.url, "_blank")}>
              <Column gap="none">
                <Text class="title">{change.description}</Text>
                <Text class="label">
                  <Trans>
                    Effective{" "}
                    <Time format="iso8601" value={change.effective_time} /> (
                    <Time format="relative" value={change.effective_time} />)
                  </Trans>
                </Text>
              </Column>
            </ListItem>
          )}
        </For>
      </List>
      <Checkbox2
        checked={confirm()}
        onChange={() => setConfirm((checked) => !checked)}
      >
        I've read and reviewed the changes.
      </Checkbox2>
    </Modal2>
  );
}
