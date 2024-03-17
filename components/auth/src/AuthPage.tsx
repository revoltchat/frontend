import { BiLogosGithub, BiLogosMastodon, BiLogosTwitter } from "solid-icons/bi";
import { styled } from "solid-styled-components";

import { useTranslation } from "@revolt/i18n";
import { Route, Routes } from "@revolt/routing";
import { Button, iconSize } from "@revolt/ui";

import MdDarkMode from "@material-design-icons/svg/filled/dark_mode.svg?component-solid";

import wideSvg from "../../../packages/client/public/assets/wide.svg";

import { LocaleSelector } from "./LocaleSelector";
import background from "./background.jpg";
import { FlowBase } from "./flows/Flow";
import FlowCheck from "./flows/FlowCheck";
import FlowConfirmReset from "./flows/FlowConfirmReset";
import FlowCreate from "./flows/FlowCreate";
import FlowHome from "./flows/FlowHome";
import FlowLogin from "./flows/FlowLogin";
import FlowResend from "./flows/FlowResend";
import FlowReset from "./flows/FlowReset";
import FlowVerify from "./flows/FlowVerify";

/**
 * Authentication page layout
 */
const Base = styled("div")`
  width: 100%;
  height: 100%;
  padding: 40px 35px;

  user-select: none;
  overflow-y: scroll;

  color: white;
  background: url(${background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme!.breakpoints.md}) {
    padding: 30px 20px;
    background-image: unset;
    background-color: ${({ theme }) => theme!.colours["background-200"]};
  }
`;

/**
 * Top and bottom navigation bars
 */
const Nav = styled("div")`
  height: 32px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;

  a,
  a:link,
  a:visited,
  a:active {
    color: white;
    text-decoration: none;
  }

  @media (max-width: ${({ theme }) => theme!.breakpoints.md}) {
    color: ${(props) => props.theme!.colours.foreground};

    a,
    a:link,
    a:visited,
    a:active,
    svg {
      color: ${(props) => props.theme!.colours.foreground};
    }
  }
`;

/**
 * Navigation items
 */
const NavItems = styled("div")<{
  stack?: boolean;
  hide?: boolean;
  grow?: boolean;
}>`
  gap: 10px;
  display: flex;
  align-items: center;
  flex-grow: ${(props) => (props.grow ? 1 : 0)};

  font-size: 0.9em;

  @media (max-width: ${({ theme }) => theme!.breakpoints.md}) {
    display: ${(props) => (props.hide ? "none" : "flex")};
  }

  @media (max-width: ${({ theme }) => theme!.breakpoints.md}) {
    flex-direction: ${(props) => (props.stack ? "column" : "row")};
  }
`;

/**
 * Link with an icon inside
 */
const LinkWithIcon = styled("a")`
  height: 24px;
`;

/**
 * Middot-like bullet
 */
const Bullet = styled("div")`
  height: 5px;
  width: 5px;
  background: grey;
  border-radius: 50%;

  @media (max-width: ${({ theme }) => theme!.breakpoints.md}) {
    display: none;
  }
`;

/**
 * Revolt Wordmark
 */
const Logo = styled("img")`
  height: 24px;
`;

let a = false;

/**
 * Authentication page
 */
export function AuthPage() {
  const t = useTranslation();

  return (
    <Base>
      <Nav>
        <div />
        <Button
          compact="icon"
          onClick={() => {
            a = !a;
            (window as any)._demo_setDarkMode(a);
          }}
        >
          <MdDarkMode {...iconSize("24px")} />
        </Button>
      </Nav>
      {/*<Nav>
        <Logo src={wideSvg} />
        <LocaleSelector />
      </Nav>*/}
      <FlowBase>
        <Routes>
          <Route path="/check" component={FlowCheck} />
          <Route path="/create" component={FlowCreate} />
          <Route path="/auth" component={FlowLogin} />
          <Route path="/auth2" element={<b>test</b>} />
          <Route path="/resend" component={FlowResend} />
          <Route path="/reset" component={FlowReset} />
          <Route path="/verify/:token" component={FlowVerify} />
          <Route path="/reset/:token" component={FlowConfirmReset} />
          <Route path="/*any" component={FlowHome} />
        </Routes>
      </FlowBase>
      <Nav>
        <NavItems stack grow>
          <NavItems>
            <LinkWithIcon href="https://github.com/revoltchat" target="_blank">
              <BiLogosGithub size={24} />
            </LinkWithIcon>
            <LinkWithIcon href="https://twitter.com/revoltchat" target="_blank">
              <BiLogosTwitter size={24} />
            </LinkWithIcon>
            <LinkWithIcon
              href="https://mastodon.social/web/@revoltchat"
              target="_blank"
            >
              <BiLogosMastodon size={24} />
            </LinkWithIcon>
          </NavItems>
          <Bullet />
          <NavItems>
            <a href="https://revolt.chat/about" target="_blank">
              {t("general.about")}
            </a>
            <a href="https://revolt.chat/terms" target="_blank">
              {t("general.tos")}
            </a>
            <a href="https://revolt.chat/privacy" target="_blank">
              {t("general.privacy")}
            </a>
          </NavItems>
        </NavItems>
        <NavItems hide>
          {t("general.image_by")} @fakurian
          <Bullet />
          <a href="https://unsplash.com/" target="_blank" rel="noreferrer">
            unsplash.com
          </a>
        </NavItems>
      </Nav>
    </Base>
  );
}
