import { styled } from "styled-system/jsx";

import {
  CategoryButton,
  CategoryButtonGroup,
  Column,
  Row,
  iconSize,
} from "@revolt/ui";

import MdBrush from "@material-design-icons/svg/outlined/brush.svg?component-solid";
import MdDataObject from "@material-design-icons/svg/outlined/data_object.svg?component-solid";
import MdFormatSize from "@material-design-icons/svg/outlined/format_size.svg?component-solid";
import MdPalette from "@material-design-icons/svg/outlined/palette.svg?component-solid";
import MdSentimentVerySatisfied from "@material-design-icons/svg/outlined/sentiment_very_satisfied.svg?component-solid";
import MdWallpaper from "@material-design-icons/svg/outlined/wallpaper.svg?component-solid";

import { useSettingsNavigation } from "../Settings";

/**
 * Appearance
 */
export default function Appearance() {
  const { navigate } = useSettingsNavigation();
  return (
    <Column gap="lg">
      {/* <Row>
        <ThemePreview
          src="https://app.revolt.chat/assets/dark.f38e16a0.svg"
          draggable={false}
        />
        <ThemeProperties>hello</ThemeProperties>
      </Row>
      <CategoryButtonGroup>
        <CategoryButton
          action="chevron"
          icon={<MdPalette {...iconSize(22)} />}
          onClick={() => navigate("appearance/colours")}
          description="Customise accent colour, additional colours, and transparency"
        >
          Colours
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<MdFormatSize {...iconSize(22)} />}
          onClick={() => navigate("appearance/fonts")}
          description="Customise display and text options"
        >
          Display and fonts
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<MdWallpaper {...iconSize(22)} />}
          onClick={() => navigate("appearance/wallpaper")}
          description="Set a wallpaper for your chats"
        >
          Wallpaper
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<MdSentimentVerySatisfied {...iconSize(22)} />}
          onClick={() => navigate("appearance/emoji")}
          description="Change how your emojis look"
        >
          Emoji
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<MdDataObject {...iconSize(22)} />}
          onClick={() => navigate("appearance/advanced_options")}
          description="Customise theme variables and apply custom CSS"
        >
          Advanced Options
        </CategoryButton>
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <CategoryButton
          action="external"
          icon={<MdBrush {...iconSize(22)} />}
          description="Browse themes made by the community"
        >
          Discover themes
        </CategoryButton>
      </CategoryButtonGroup> */}
    </Column>
  );
}

/**
 * Theme preview styling
 */
const ThemePreview = styled("img", {
  base: {
    height: "200px",
    width: "fit-content",
    borderRadius: "var(--borderRadius-xl)",
  },
});

/**
 * Theme preview styling
 */
const ThemeProperties = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    padding: "20px",
    background: "var(--colours-temp-1)",
    borderRadius: "var(--borderRadius-xl)",
  },
});
