import { Modal } from "./Modal";
import { ComponentProps } from "solid-js";
import type { ComponentStory } from "../../../stories";
import { Button } from "../inputs";

export default {
  component: Modal,
  category: "Design System/Atoms/Display",
  stories: [
    {
      title: "Default",
    },
    {
      title: "No Actions",
      props: {
        actions: [],
      },
    },
  ],
  props: {
    show: false,
    title: "Modal Title",
    description: "Optional modal description.",
    children:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    actions: [
      {
        children: "OK",
        palette: "accent",
        confirmation: true,
        onClick: () => true,
      },
      {
        children: "Cancel",
        palette: "plain",
        onClick: () => true,
      },
    ],
  },
  propTypes: {
    show: "boolean",
    title: "string",
    description: "string",
    children: "string",
  },
  decorators: [
    (props) => (
      <div>
        <Button
          palette="accent"
          onClick={() => (props.childProps as any).onShow()}
        >
          Open Modal
        </Button>
        {props.children}
      </div>
    ),
  ],
  effects: {
    onClose: (_) => ({ show: false }),
    ...({
      onShow: () => ({ show: true }),
    } as any),
  },
} as ComponentStory<typeof Modal, ComponentProps<typeof Modal>>;
