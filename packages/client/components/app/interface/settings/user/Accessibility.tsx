import { Trans } from "@lingui-solid/solid/macro";

import {
  CategoryButton,
  CategoryButtonGroup,
  Checkbox,
  Column,
  iconSize,
} from "@revolt/ui";

import MdAnimation from "@material-design-icons/svg/outlined/animation.svg?component-solid";

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
