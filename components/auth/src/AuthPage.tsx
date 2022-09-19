import { styled } from "solid-styled-components";

import { BiLogosGithub, BiLogosTwitter, BiLogosMastodon } from "solid-icons/bi";

import background from "./background.jpg";
import wordmark from "../../../assets/wordmark.svg";

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
const NavItems = styled("div")`
  gap: 10px;
  display: flex;
  align-items: center;

  color: #ddd;
  font-size: 0.9em;
`;

/**
 * Middot-like bullet
 */
const Bullet = styled("div")`
  height: 5px;
  width: 5px;
  background: grey;
  border-radius: 50%;
`;

/**
 * Revolt Wordmark
 */
const Logo = styled("img")`
  height: 24px;
`;

export function AuthPage() {
  return (
    <Base>
      <Nav>
        <Logo src={wordmark} />
      </Nav>
      <div>welcome to COCK!</div>
      <Nav>
        <NavItems>
          <BiLogosGithub size={24} color="white" />
          <BiLogosTwitter size={24} color="white" />
          <BiLogosMastodon size={24} color="white" />
          <Bullet />
          <a>About</a>
          <a>Terms of Service</a>
          <a>Privacy Policy</a>
        </NavItems>
        <NavItems>
          Image by @fakurian
          <Bullet />
          <a>unsplash.com</a>
        </NavItems>
      </Nav>
    </Base>
  );
}
