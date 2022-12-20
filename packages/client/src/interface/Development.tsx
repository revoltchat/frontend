import { clientController } from "@revolt/client";
import { modalController } from "@revolt/modal";
import { Button, Column } from "@revolt/ui";

export function DevelopmentPage() {
  function open() {
    modalController.push({
      type: "create_server",
      client: clientController.getReadyClient()!,
    });
  }

  return (
    <Column>
      <Button onClick={open}>Open Modal</Button>
    </Column>
  );
}
