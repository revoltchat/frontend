import MdPalette from "@material-design-icons/svg/outlined/palette.svg?component-solid";
import MdBrush from "@material-design-icons/svg/outlined/brush.svg?component-solid";
import MdLanguage from "@material-design-icons/svg/outlined/language.svg?component-solid";

import { useTranslation } from "@revolt/i18n";
import {
  CategoryButton,
  CategoryButtonGroup,
  Checkbox,
  FormGroup,
  Column,
  iconSize,
} from "@revolt/ui";

/**
 * Sync Configuration Page
 */
export default function Sync() {
  const t = useTranslation();

  //TODO: replace "Last sync" with Notice component once available
  return (
    <Column gap="lg">
      <CategoryButtonGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdPalette {...iconSize(24)} />}
            description={t("app.settings.pages.sync.descriptions.appearance")}
          >
            {t("app.settings.pages.appearance.title")}
          </CategoryButton>
        </FormGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdBrush {...iconSize(24)} />}
            description={t("app.settings.pages.sync.descriptions.theme")}
          >
            {t("app.settings.pages.appearance.theme")}
          </CategoryButton>
        </FormGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdLanguage {...iconSize(24)} />}
            description={t("app.settings.pages.sync.descriptions.locale")}
          >
            {t("app.settings.pages.language.title")}
          </CategoryButton>
        </FormGroup>
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <CategoryButton>
          Last sync at (time here)
        </CategoryButton>
      </CategoryButtonGroup>
    </Column>
  );
}
