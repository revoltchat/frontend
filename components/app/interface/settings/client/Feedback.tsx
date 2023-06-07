import {
  BiLogosGithub,
  BiLogosTrello,
} from "solid-icons/bi";
import MdFormatListNumbered from "@material-design-icons/svg/outlined/format_list_numbered.svg?component-solid";
import MdBugReport from "@material-design-icons/svg/outlined/bug_report.svg?component-solid";
import MdExitToApp from "@material-design-icons/svg/outlined/exit_to_app.svg?component-solid";

import { useTranslation } from "@revolt/i18n";
import { CategoryButton, CategoryButtonGroup, styled, iconSize, } from "@revolt/ui";

/**
 * Feedback
 */
export default function Feedback() {
  const t = useTranslation();

  return (
    <CategoryButtonGroup>
      <Link href="https://trello.com/b/4e2O7tge/roadmap" target="_blank">
        <CategoryButton
          action="external"
          icon={<BiLogosTrello size={24} />}
          onClick={() => void 0}
          description="See what we're currently working on."
        >
          Roadmap
        </CategoryButton>
      </Link>
      <Link
        href="https://github.com/orgs/revoltchat/discussions"
        target="_blank"
      >
        <CategoryButton
          action="external"
          icon={<BiLogosGithub size={24} />}
          onClick={() => void 0}
          description={t("app.settings.pages.feedback.suggest_desc")}
        >
          {t("app.settings.pages.feedback.suggest")}
        </CategoryButton>
      </Link>
      <Link
        href="https://github.com/revoltchat/frontend/issues/new/choose"
        target="_blank"
      >
        <CategoryButton
          action="external"
          icon={<MdFormatListNumbered {...iconSize(24)} />}
          onClick={() => void 0}
          description={t("app.settings.pages.feedback.issue_desc")}
        >
          {t("app.settings.pages.feedback.issue")}
        </CategoryButton>
      </Link>
      <Link
        href="https://github.com/orgs/revoltchat/projects/3"
        target="_blank"
      >
        <CategoryButton
          action="external"
          icon={<MdBugReport {...iconSize(24)} />}
          onClick={() => void 0}
          description={t("app.settings.pages.feedback.bug_desc")}
        >
          {t("app.settings.pages.feedback.bug")}
        </CategoryButton>
      </Link>
      <CategoryButton
        action="chevron"
        icon={<MdExitToApp {...iconSize(24)} />}
        onClick={() => void 0}
        description="You can report issues and discuss improvements with us directly here."
      >
        Join the Revolt Lounge
      </CategoryButton>
    </CategoryButtonGroup>
  );
}

/**
 * Link without decorations
 */
const Link = styled.a`
  text-decoration: none;
`;
