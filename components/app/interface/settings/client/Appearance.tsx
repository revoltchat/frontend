import {
  BiRegularCodeCurly,
  BiRegularText,
  BiSolidBrush,
  BiSolidHappyBeaming,
  BiSolidPalette,
} from "solid-icons/bi";

import { CategoryButton, Column } from "@revolt/ui";

import { useSettingsNavigation } from "../Settings";

/**
 * Appearance
 */
export default function () {
  const { navigate } = useSettingsNavigation();
  return (
    <Column>
      <img
        src="https://app.revolt.chat/assets/dark.f38e16a0.svg"
        height={240}
        style={{ "max-width": "360px", "max-height": "240px" }}
      />
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
    </Column>
  );
}
