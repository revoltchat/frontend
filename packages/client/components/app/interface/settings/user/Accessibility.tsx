import { useTranslation } from "@revolt/i18n";
import {
  CategoryButton,
  CategoryButtonGroup,
  Checkbox,
  Column,
  FormGroup,
  iconSize,
} from "@revolt/ui";

import MdAnimation from "@material-design-icons/svg/outlined/animation.svg?component-solid";
import { Trans } from "@lingui-solid/solid/macro";

/**
 * Accessibility settings page
 */
export default function Accessibility() {
  return (
    <Column gap="lg">
      {/* <CategoryButtonGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdAnimation {...iconSize(22)} />}
            description={
              <Trans>
                If this is enabled, animations and motion effects won't play or
                will be less intense.
              </Trans>
            }
          >
            <Trans>Reduced Motion</Trans>
          </CategoryButton>
        </FormGroup>
      </CategoryButtonGroup> */}
    </Column>
  );
}
