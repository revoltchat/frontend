/* eslint-disable */
import { BiSolidPalette, BiSolidSpeaker } from "solid-icons/bi";

import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { clientController } from "@revolt/client";
import { modalController } from "@revolt/modal";
import {
  Button,
  CategoryButton,
  CategoryCollapse,
  Column,
  ComboBox,
  OverrideSwitch,
  iconSize,
} from "@revolt/ui";

import Face from "@material-design-icons/svg/filled/face.svg?component-solid";

const NewComponent = styled("div", {
  base: {
    background: "blue",
    color: "white",
  },
});

const newComponent = cva({
  base: {
    background: "blue",
    color: "white",
  },
});

export function DevelopmentPage() {
  function open() {
    modalController.push({
      type: "custom_status",
      client: clientController.getCurrentClient()!,
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
      <div
        style={{
          width: "480px",
          height: "480px",
          display: "grid",
          "place-items": "center",
        }}
      >
        <Face fill="red" {...iconSize(128)} />
      </div>
      <OverrideSwitch />

      <div
        // have to wrap the component in something that can receive a directive
        use:floating={{ tooltip: { content: "hello", placement: "bottom" } }}
      >
        <NewComponent>hello, but im from panda-css</NewComponent>
      </div>

      <div
        class={newComponent()}
        use:floating={{ tooltip: { content: "hello", placement: "bottom" } }}
      >
        best of both worlds?
      </div>

      <Button onPress={open}>Open Modal</Button>
      <Button onPress={changelog}>Changelog Modal</Button>
      <Button
        use:floating={{ tooltip: { content: "hi", placement: "bottom" } }}
      >
        I'm a button with a tooltip!
      </Button>
      <div style={{ padding: "1em", width: "400px" }}>
        <Column>
          <CategoryButton
            icon={<BiSolidPalette size={24} />}
            description="description!"
            onClick={() => void 0}
          >
            I am a button
          </CategoryButton>
          <CategoryCollapse
            icon={<BiSolidSpeaker size={24} />}
            description="description!"
            title="Choose output device tbh"
          >
            <CategoryButton
              description="Active device"
              onClick={() => void 0}
              icon={<div style={{ width: "24px" }} />}
            >
              Realtek Audio
            </CategoryButton>
            <CategoryButton
              onClick={() => void 0}
              icon={<div style={{ width: "24px" }} />}
            >
              Line-Out Speaker
            </CategoryButton>
            <CategoryButton
              onClick={() => void 0}
              icon={<div style={{ width: "24px" }} />}
            >
              Airpods 3
            </CategoryButton>
            <CategoryButton
              icon={<div style={{ width: "24px" }} />}
              action={
                <ComboBox>
                  <option>deez</option>
                </ComboBox>
              }
            >
              combo box
            </CategoryButton>
          </CategoryCollapse>
        </Column>
      </div>
    </Column>
  );
}
