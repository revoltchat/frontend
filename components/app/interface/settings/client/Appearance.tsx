import MdPalette from "@material-design-icons/svg/outlined/palette.svg?component-solid";
import MdSentimentVerySatisfied from "@material-design-icons/svg/outlined/sentiment_very_satisfied.svg?component-solid";
import MdFormatSize from "@material-design-icons/svg/outlined/format_size.svg?component-solid";
import MdDataObject from "@material-design-icons/svg/outlined/data_object.svg?component-solid";
import MdBrush from "@material-design-icons/svg/outlined/brush.svg?component-solid";

import { CategoryButton, CategoryButtonGroup, Column, styled, iconSize } from "@revolt/ui";

import { useSettingsNavigation } from "../Settings";

/**
 * Appearance
 */
export default function Appearance() {
  const { navigate } = useSettingsNavigation();
  return (
    <Column gap="lg">
      <ThemePreview>
        <img src="https://app.revolt.chat/assets/dark.f38e16a0.svg" draggable={false} />
      </ThemePreview>
      <CategoryButtonGroup>
        <CategoryButton
          action="chevron"
          icon={<MdPalette {...iconSize(24)} />}
          onClick={() => navigate("appearance/colours")}
          description="Customise accent colour, additional colours, and transparency"
        >
          Colours
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<MdSentimentVerySatisfied {...iconSize(24)} />}
          onClick={() => navigate("appearance/emoji")}
          description="Change how your emojis look"
        >
          Emoji
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<MdFormatSize {...iconSize(24)} />}
          onClick={() => navigate("appearance/fonts")}
          description="Customise font and text display"
        >
          Fonts
        </CategoryButton>
        <CategoryButton
          action="chevron"
          icon={<MdDataObject {...iconSize(24)} />}
          onClick={() => navigate("appearance/advanced_options")}
          description="Customise theme variables and apply custom CSS"
        >
          Advanced Options
        </CategoryButton>
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <CategoryButton
          action="external"
          icon={<MdBrush {...iconSize(24)} />}
          description="Browse themes made by the community"
        >
          Discover themes
        </CategoryButton>
      </CategoryButtonGroup>
    </Column>
  );
}

/**
 * Theme preview styling
 */
const ThemePreview = styled.div`
  img {
    height: 200px;
    border-radius: ${(props) => props.theme!.borderRadius.xl};
  }
`;