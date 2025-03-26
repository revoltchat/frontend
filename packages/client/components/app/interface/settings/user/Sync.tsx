import { useTranslation } from "@revolt/i18n";
import {
  CategoryButton,
  CategoryButtonGroup,
  Checkbox,
  Column,
  FormGroup,
  Time,
  iconSize,
} from "@revolt/ui";

import MdBrush from "@material-design-icons/svg/outlined/brush.svg?component-solid";
import MdLanguage from "@material-design-icons/svg/outlined/language.svg?component-solid";
import MdPalette from "@material-design-icons/svg/outlined/palette.svg?component-solid";
import { Trans } from "@lingui-solid/solid/macro";

/**
 * Sync Configuration Page
 */
export default function Sync() {
  const t = useTranslation();

  return (
    <Column gap="lg">
      <CategoryButtonGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdPalette {...iconSize(22)} />}
            description={
              <Trans>
                Sync appearance options, such as chosen emoji pack and message
                density.
              </Trans>
            }
          >
            <Trans>Appearance</Trans>
          </CategoryButton>
        </FormGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdBrush {...iconSize(22)} />}
            description={
              <Trans>
                Sync your chosen theme, colours, and any custom CSS.
              </Trans>
            }
          >
            <Trans>Theme</Trans>
          </CategoryButton>
        </FormGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdLanguage {...iconSize(22)} />}
            description={<Trans>Sync your currently chosen language.</Trans>}
          >
            <Trans>Language</Trans>
          </CategoryButton>
        </FormGroup>
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <CategoryButton>
          <Trans>
            Last sync <Time format="relative" value={0} />
          </Trans>
        </CategoryButton>
      </CategoryButtonGroup>
    </Column>
  );
}
