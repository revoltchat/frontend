import { JSX, splitProps } from "solid-js";

import { Link } from "@revolt/routing";

// import { determineLink } from "../../../lib/links";

// import { modalController } from "../../../controllers/modals/ModalController";

export function RenderAnchor(
  props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const [localProps, remoteProps] = splitProps(props, ["href"]);

  // Pass-through no href or if anchor
  if (!localProps.href || localProps.href.startsWith("#"))
    return <a href={localProps.href} {...props} />;

  // Determine type of link
  /*const link = determineLink(localProps.href);
  if (link.type === "none") return <a {...props} />;

  // Render direct link if internal
  if (link.type === "navigate") {
    return <Link to={link.path} children={props.children} />;
  }*/

  return (
    <a
      {...remoteProps}
      href={localProps.href}
      target="_blank"
      rel="noreferrer"
      // onClick={(ev) => modalController.openLink(href) && ev.preventDefault()}
    />
  );
}
