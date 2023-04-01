import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";

interface Props {
  /**
   * Callback for dropped files
   * @param files List of files
   */
  onFiles: (files: File[]) => void;
}

export function FileDropAnywhereCollector(props: Props) {
  const [showIndicator, setShowIndicator] = createSignal(false);

  /**
   * Hamdle item drag event
   * @param event Drag event
   */
  function onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
      setShowIndicator(true);
    }
  }

  /**
   * Handle cancelled drag event
   */
  function onDragLeave() {
    setShowIndicator(false);
  }

  /**
   * Handle item drop event
   * @param event Drag event
   */
  function onDrop(event: DragEvent) {
    const files = event.dataTransfer?.files;
    if (files) {
      props.onFiles([...files]);
    }

    setShowIndicator(false);
  }

  onMount(() => {
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragleave", onDragLeave);
    document.addEventListener("drop", onDrop);
  });

  onCleanup(() => {
    document.removeEventListener("dragover", onDragOver);
    document.removeEventListener("dragleave", onDragLeave);
    document.removeEventListener("drop", onDrop);
  });

  return (
    <Show when={showIndicator()}>
      <Portal>
        <div
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            background: "red",
          }}
        >
          hello gamer
        </div>
      </Portal>
    </Show>
  );
}
