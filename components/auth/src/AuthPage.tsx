import { Route, Routes } from "@revolt/routing";
import { styled } from "solid-styled-components";
import { LocaleSelector, useTranslation } from "@revolt/i18n";

import { BiLogosGithub, BiLogosTwitter, BiLogosMastodon } from "solid-icons/bi";

import background from "./background.jpg";
import wordmark from "../../../assets/wordmark.svg";

import FlowCreate from "./flows/FlowCreate";
import FlowLogin from "./flows/FlowLogin";
import { FlowBase } from "./flows/Flow";

/**
 * Authentication page layout
 */
const Base = styled("div")`
  color: white;

  width: 100%;
  height: 100%;
  display: flex;
  padding: 40px 35px;

  user-select: none;

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

  a,
  a:link,
  a:visited,
  a:active {
    color: white;
    text-decoration: none;
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

  color: #ddd;
  font-size: 0.9em;

  @media (max-width: ${({ theme }) => theme!.breakpoints.md}) {
    display: ${(props) => (props.hide ? "none" : "flex")};
  }

  @media (max-width: ${({ theme }) => theme!.breakpoints.md}) {
    flex-direction: ${(props) => (props.stack ? "column" : "row")};
  }
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

/**
 * Authentication page
 */
export function AuthPage() {
  const t = useTranslation();

  return (
    <Base>
      <Nav>
        <Logo src={wordmark} />
        <LocaleSelector />
      </Nav>
      <FlowBase>
        <Routes>
          <Route path="/create" component={FlowCreate} />
          <Route path="/resend" component={FlowCreate} />
          <Route path="/reset" component={FlowCreate} />
          <Route path="/verify/:token" component={FlowCreate} />
          <Route path="/reset/:token" component={FlowCreate} />
          <Route path="/*any" component={FlowLogin} />
        </Routes>
      </FlowBase>
      <Nav>
        <NavItems stack grow>
          <NavItems>
            <a href="https://github.com/revoltchat" target="_blank">
              <BiLogosGithub size={24} color="white" />
            </a>
            <a href="https://twitter.com/revoltchat" target="_blank">
              <BiLogosTwitter size={24} color="white" />
            </a>
            <a href="https://mastodon.social/web/@revoltchat" target="_blank">
              <BiLogosMastodon size={24} color="white" />
            </a>
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
          <a>unsplash.com</a>
        </NavItems>
      </Nav>
    </Base>
  );
}
