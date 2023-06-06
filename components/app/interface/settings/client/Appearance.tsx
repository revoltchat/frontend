import {
  BiRegularCodeCurly,
  BiRegularText,
  BiSolidBrush,
  BiSolidHappyBeaming,
  BiSolidPalette,
} from "solid-icons/bi";

import { CategoryButton, CategoryButtonGroup, Column } from "@revolt/ui";

import { useSettingsNavigation } from "../Settings";

/**
 * Appearance
 */
export default function Appearance() {
  const { navigate } = useSettingsNavigation();
  return (
    <Column gap="xl">
      <img
        src="https://app.revolt.chat/assets/dark.f38e16a0.svg"
        width="360px"
      />
      <Column>
        <CategoryButtonGroup>
          <CategoryButton
            action="chevron"
            icon={<BiSolidPalette size={24} />}
            onClick={() => navigate("appearance/colours")}
            description="Customise accent colour, additional colours, and transparency"
          >
            Colours
          </CategoryButton>
          <CategoryButton
            action="chevron"
            icon={<BiSolidHappyBeaming size={24} />}
            onClick={() => navigate("appearance/emoji")}
            description="Change how your emojis look"
          >
            Emoji
          </CategoryButton>
          <CategoryButton
            action="chevron"
            icon={<BiRegularText size={24} />}
            onClick={() => navigate("appearance/fonts")}
            description="Customise font and text display"
          >
            Fonts
          </CategoryButton>
          <CategoryButton
            action="chevron"
            icon={<BiRegularCodeCurly size={24} />}
            onClick={() => navigate("appearance/advanced_options")}
            description="Customise theme variables and apply custom CSS"
          >
            Advanced Options
          </CategoryButton>
          <CategoryButton
            action="external"
            icon={<BiSolidBrush size={24} />}
            description="Browse themes made by the community"
          >
            Discover themes
          </CategoryButton>
        </CategoryButtonGroup>
      </Column>
    </Column>
  );
}
