import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import {
  CategoryButton,
  CategoryButtonGroup,
  Column,
  iconSize,
} from "@revolt/ui";

import MdBugReport from "@material-design-icons/svg/outlined/bug_report.svg?component-solid";
import MdExitToApp from "@material-design-icons/svg/outlined/exit_to_app.svg?component-solid";
import MdFormatListNumbered from "@material-design-icons/svg/outlined/format_list_numbered.svg?component-solid";
import MdStar from "@material-design-icons/svg/outlined/star_outline.svg?component-solid";
import MdViewKanban from "@material-design-icons/svg/outlined/view_kanban.svg?component-solid";

/**
 * Feedback
 */
export function Feedback() {
  return (
    <Column gap="lg">
      <CategoryButtonGroup>
        <Link
          href="https://github.com/orgs/revoltchat/projects/6/views/4"
          target="_blank"
        >
          <CategoryButton
            action="external"
            icon={<MdViewKanban {...iconSize(22)} />}
            onClick={() => void 0}
            description={<Trans>See what we're currently working on.</Trans>}
          >
            <Trans>Roadmap</Trans>
          </CategoryButton>
        </Link>
        <Link
          href="https://github.com/orgs/revoltchat/discussions"
          target="_blank"
        >
          <CategoryButton
            action="external"
            icon={<MdStar {...iconSize(22)} />}
            onClick={() => void 0}
            description={
              <Trans>Suggest new Revolt features on GitHub discussions.</Trans>
            }
          >
            <Trans>Submit feature suggestion</Trans>
          </CategoryButton>
        </Link>
        <Link
          href="https://github.com/revoltchat/frontend/issues/new/choose"
          target="_blank"
        >
          <CategoryButton
            action="external"
            icon={<MdFormatListNumbered {...iconSize(22)} />}
            onClick={() => void 0}
            description={<Trans>Submit feedback</Trans>}
          >
            <Trans>Feedback</Trans>
          </CategoryButton>
        </Link>
        <Link
          href="https://github.com/orgs/revoltchat/projects/3"
          target="_blank"
        >
          <CategoryButton
            action="external"
            icon={<MdBugReport {...iconSize(22)} />}
            onClick={() => void 0}
            description={<Trans>View currently active bug reports here.</Trans>}
          >
            <Trans>Bug Tracker</Trans>
          </CategoryButton>
        </Link>
      </CategoryButtonGroup>
      <CategoryButtonGroup>
        <CategoryButton
          action="chevron"
          icon={<MdExitToApp {...iconSize(22)} />}
          onClick={() => void 0}
          description={
            <Trans>
              You can report issues and discuss improvements with us directly
              here.
            </Trans>
          }
        >
          <Trans>Join the Revolt Lounge</Trans>
        </CategoryButton>
      </CategoryButtonGroup>
    </Column>
  );
}

/**
 * Link without decorations
 */
const Link = styled("a", {
  base: {
    textDecoration: "none",
  },
});
