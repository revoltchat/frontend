import { BiSolidBatteryLow, BiSolidUser } from "solid-icons/bi";

import type { ComponentStory } from "../../../stories";

import { Button } from "./Button";

export default {
  category: "Design System/Atoms/Inputs",
  component: Button,
  stories: [
    {
      title: "Primary",
      props: {
        palette: "primary",
      },
    },
    {
      title: "Primary (Disabled)",
      props: {
        palette: "primary",
        disabled: true,
      },
    },
    {
      title: "Secondary",
      props: {
        palette: "secondary",
      },
    },
    {
      title: "Accent",
      props: {
        palette: "accent",
      },
    },
    {
      title: "Plain",
      props: {
        palette: "plain",
      },
    },
    {
      title: "Plain (Secondary)",
      props: {
        palette: "plain-secondary",
      },
    },
    {
      title: "Success",
      props: {
        palette: "success",
        children: "Continue",
      },
    },
    {
      title: "Warning",
      props: {
        palette: "warning",
        children: "Apply",
      },
    },
    {
      title: "Error",
      props: {
        palette: "error",
        children: "Delete",
      },
    },
    {
      title: "Icon",
      props: {
        compact: "icon",
        children: <BiSolidUser size={16} />,
      },
    },
    {
      title: "Icon (Accent)",
      props: {
        compact: "icon",
        palette: "accent",
        children: <BiSolidBatteryLow size={16} />,
      },
    },
  ],
  props: {
    children: "Hello!",
  },
  propTypes: {
    palette: [
      "primary",
      "secondary",
      "plain",
      "plain-secondary",
      "accent",
      "success",
      "warning",
      "error",
    ],
    compact: [true, false, "icon"],
    children: "string",
  },
} as ComponentStory<typeof Button>;
