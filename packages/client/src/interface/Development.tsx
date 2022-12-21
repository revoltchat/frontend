import { clientController } from "@revolt/client";
import { modalController } from "@revolt/modal";
import { Button, Column } from "@revolt/ui";

export function DevelopmentPage() {
  function open() {
    modalController.push({
      type: "server_info",
      server: [...clientController.getReadyClient()!.servers.values()][0],
    });
  }

  function changelog() {
    modalController.push({
      type: "changelog",
      posts: [
        {
          date: new Date("2022-06-12T20:39:16.674Z"),
          title: "Secure your account with 2FA",
          content: [
            "Two-factor authentication is now available to all users, you can now head over to settings to enable recovery codes and an authenticator app.",
            {
              type: "image",
              src: "https://autumn.revolt.chat/attachments/E21kwmuJGcASgkVLiSIW0wV3ggcaOWjW0TQF7cdFNY/image.png",
            },
            "Once enabled, you will be prompted on login.",
            {
              type: "image",
              src: "https://autumn.revolt.chat/attachments/LWRYoKR2tE1ggW_Lzm547P1pnrkNgmBaoCAfWvHE74/image.png",
            },
            "Other authentication methods coming later, stay tuned!",
          ],
        },
      ],
    });
  }

  return (
    <Column>
      <Button onClick={open}>Open Modal</Button>
      <Button onClick={changelog}>Changelog Modal</Button>
    </Column>
  );
}
