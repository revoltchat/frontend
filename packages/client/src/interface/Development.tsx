import { clientController } from "@revolt/client";
import { modalController } from "@revolt/modal";
import { Button, Column } from "@revolt/ui";

export function DevelopmentPage() {
  function open() {
    modalController.push({
      type: "delete_message",
      message: [...clientController.getReadyClient()!.messages.values()][0],
    });
  }

  return (
    <Column>
      <Button onClick={open}>Open Modal</Button>
    </Column>
  );
}
