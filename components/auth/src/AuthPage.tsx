import { Route, Routes } from "@solidjs/router";
import { styled } from "solid-styled-components";
import { LocaleSelector, useTranslation } from "@revolt/i18n";

import { BiLogosGithub, BiLogosTwitter, BiLogosMastodon } from "solid-icons/bi";

import background from "./background.jpg";
import wordmark from "../../../assets/wordmark.svg";

import FlowCreate from "./flows/FlowCreate";
import FlowLogin from "./flows/FlowLogin";

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
    /* TODO primary bg */
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
      <div>
        <Routes>
          <Route path="/login/create" component={FlowCreate} />
          <Route path="/login/resend" component={FlowCreate} />
          <Route path="/login/reset" component={FlowCreate} />
          <Route path="/login/verify/:token" component={FlowCreate} />
          <Route path="/login/reset/:token" component={FlowCreate} />
          <Route path="/*any" component={FlowLogin} />
        </Routes>
      </div>
      <Nav>
        <NavItems stack grow>
          <NavItems>
            <BiLogosGithub size={24} color="white" />
            <BiLogosTwitter size={24} color="white" />
            <BiLogosMastodon size={24} color="white" />
          </NavItems>
          <Bullet />
          <NavItems>
            <a>{t("general.about")}</a>
            <a>{t("general.tos")}</a>
            <a>{t("general.privacy")}</a>
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
