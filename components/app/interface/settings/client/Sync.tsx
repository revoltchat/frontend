import { BiRegularGlobe, BiSolidBrush, BiSolidPalette } from "solid-icons/bi";

import { useTranslation } from "@revolt/i18n";
import {
  CategoryButton,
  CategoryButtonGroup,
  Checkbox,
  FormGroup,
} from "@revolt/ui";

/**
 * Sync Configuration Page
 */
export default function Sync() {
  const t = useTranslation();

  return (
    <CategoryButtonGroup>
      <FormGroup>
        <CategoryButton
          action={<Checkbox value onChange={(value) => void value} />}
          onClick={() => void 0}
          icon={<BiSolidPalette size={24} />}
          description={t("app.settings.pages.sync.descriptions.appearance")}
        >
          {t("app.settings.pages.appearance.title")}
        </CategoryButton>
      </FormGroup>
      <FormGroup>
        <CategoryButton
          action={<Checkbox value onChange={(value) => void value} />}
          onClick={() => void 0}
          icon={<BiSolidBrush size={24} />}
          description={t("app.settings.pages.sync.descriptions.theme")}
        >
          {t("app.settings.pages.appearance.theme")}
        </CategoryButton>
      </FormGroup>
      <FormGroup>
        <CategoryButton
          action={<Checkbox value onChange={(value) => void value} />}
          onClick={() => void 0}
          icon={<BiRegularGlobe size={24} />}
          description={t("app.settings.pages.sync.descriptions.locale")}
        >
          {t("app.settings.pages.language.title")}
        </CategoryButton>
      </FormGroup>
    </CategoryButtonGroup>
  );
}
