import MdExitToApp from "@material-design-icons/svg/outlined/exit_to_app.svg?component-solid";
import MdCancelPresentation from "@material-design-icons/svg/outlined/cancel_presentation.svg?component-solid";
import MdWebAsset from "@material-design-icons/svg/outlined/web_asset.svg?component-solid";
import MdDesktopWindows from "@material-design-icons/svg/outlined/desktop_windows.svg?component-solid";

import {
  CategoryButton,
  CategoryButtonGroup,
  Checkbox,
  Column,
  FormGroup,
  iconSize,
} from "@revolt/ui";
import { Trans } from "@lingui-solid/solid/macro";

/**
 * Desktop Configuration Page
 */
export default function Native() {
  return (
    <Column gap="lg">
      <CategoryButtonGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdExitToApp {...iconSize(22)} />}
            description={
              <Trans>Launch Revolt when you log into your computer.</Trans>
            }
          >
            <Trans>Start with Computer</Trans>
          </CategoryButton>
        </FormGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdCancelPresentation {...iconSize(22)} />}
            description={
              <Trans>Instead of closing, Revolt will hide in your tray.</Trans>
            }
          >
            <Trans>Minimise to Tray</Trans>
          </CategoryButton>
        </FormGroup>
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <FormGroup>
          <CategoryButton
            action={<Checkbox value onChange={(value) => void value} />}
            onClick={() => void 0}
            icon={<MdWebAsset {...iconSize(22)} />}
            description={<Trans>Let Revolt use its own custom titlebar.</Trans>}
          >
            <Trans>Custom window frame</Trans>
          </CategoryButton>
        </FormGroup>
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <CategoryButton
          icon={<MdDesktopWindows {...iconSize(22)} />}
          description="Version 1.0.0"
        >
          <Trans>Revolt Desktop</Trans>
        </CategoryButton>
      </CategoryButtonGroup>
    </Column>
  );
}
