import "mdui/components/segmented-button-group.js";
import "mdui/components/segmented-button.js";

export function SingleSelectSegmentedButton() {
  return (
    <mdui-segmented-button-group selects="single" onChange={() => {}}>
      <mdui-segmented-button value="day">Allow</mdui-segmented-button>
      <mdui-segmented-button value="week">Inherit</mdui-segmented-button>
      <mdui-segmented-button value="month">Disallow</mdui-segmented-button>
    </mdui-segmented-button-group>
  );
}
